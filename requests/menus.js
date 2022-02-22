//products.js
const { db } = require('../util/admin');
require('dotenv').config({ path: '.env' });
const make_request = require('request');
const util = require('util');

function checkAndAdd(final_results, meal, item){
    if (item["summary"].toUpperCase().replace(' ', '').includes(meal.toUpperCase())) {
        if (meal in final_results){
            // witch updated is newer
            if (Date.parse(final_results[meal]["updated"]) < Date.parse(item["updated"])) {
                final_results[meal] = item;
            }
        } else {
            final_results[meal] = item;
        }
    }
}

function cleanString(my_string) {
    if (my_string[0] == '<') {
        // rule for everything between <br><br>
        var myRegexp = new RegExp("<br><br>(.|\s)+<br><br>", "g");
        var match = myRegexp.exec(my_string);
    } else {
        var myRegexp = new RegExp("(.|\s)+<br><br>", "g");
        var match = myRegexp.exec(my_string);
    }

    var make_list = match[0].replace(/[ ]*(<br>|\*|\&nbsp\;|<[^>]*>|\&amp\;)[ ]*/g, ",");
    make_list = make_list.replace(/[ ]*V[^a-zA-Z]/g, " ");
    make_list = make_list.replace(/[ ]*\*[^a-zA-Z]/g, " ");
    
    make_list = make_list.split(',');

    var filtered = make_list.filter(function (el) {
        return (el != "" && el != " ");
    });

    return filtered;

}

exports.getDaysMenus = (request, response) => {
    const dayNum = request.params.dayNum;
	
    const asyncWrapper = async (dayNum) => {

        var d = new Date();
        var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        var monday = new Date(d.setDate(diff));
        
        var today = new Date();
        today.setDate(monday.getDate() + (dayNum - 1))
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        
        var today_str = yyyy + '-' + mm + '-' + dd;

        const requestPromise = util.promisify(make_request);

        var options = {
            'method': 'GET',
            'url': 'https://www.googleapis.com/calendar/v3/calendars/hc.dining@gmail.com/events?key=+'+process.env.calKey+'+&timeMin='+today_str+'T06:00:00-05:00&timeMax='+today_str+'T22:00:00-05:00&singleEvents=true',
            'headers': {
            }
        };
        const my_response = await requestPromise(options);

        final_results = {}

        JSON.parse(my_response.body)["items"].forEach(function (item, index) {
            if (dayNum == 6 || dayNum == 0) {
                // find brunch
                checkAndAdd(final_results, "Brunch", item);

            } else {
                // breakfast and lunch
                checkAndAdd(final_results, "Breakfast", item);

                checkAndAdd(final_results, "Lunch", item);
            }

            // find dinner
            checkAndAdd(final_results, "Dinner", item);
        })

        var to_json = {};
        for (const [key, value] of Object.entries(final_results)){
            to_json[key] = cleanString(value["description"]);
        }

        var final_json = {};
        if ("Brunch" in to_json) {
            final_json = {
                "Brunch": to_json["Brunch"],
                "Dinner": to_json["Dinner"]
            }
        } else {
            final_json = {
                "Breakfast": to_json["Breakfast"],
                "Lunch": to_json["Lunch"],
                "Dinner": to_json["Dinner"]
            }
        }

        return response.json(final_json);
    }

    asyncWrapper(dayNum);
}