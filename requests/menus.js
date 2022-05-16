const { db } = require('../util/admin');
require('dotenv').config({ path: '.env' });
const make_request = require('request');
const util = require('util');

function checkAndAdd(final_results, item){
    if (!item["summary"].toUpperCase().replace(/\s/g, '').includes("COOPDAILYMENU".toUpperCase())) {
        new_summary = item["summary"][0].toUpperCase() + item["summary"].substring(1).toLowerCase();
        final_results[new_summary] = item;
    }
}

function cleanString(my_string) {
    // try to remove i, b, u tags and *s
    try {
        my_reg = /(<\/* *span\/* *\/*>|<\/* *u\/* *\/*>|<\/* *b\/* *\/*>|<\/* *i *\/*>|\*)/g
        my_string = my_string.replace(my_reg, "");
    } catch(error) {
        console.log("Failed to match <i>, <b>, and <u> tags "+ error);
    }

    try {
        my_string = my_string.replace(/(&nbsp;)/g, ' ');
        my_string = my_string.replace(/(&amp;)/g, ' ');
        my_string = my_string.replace(/\n/g, "<br />");
    } catch (error) {
        console.log("Failed to replace &nbsp; with ' '  "+ error);

    }

    try {
        // rule for everything between <br><br>
        var myRegexp = new RegExp("<br *\/*><br *\/*>(.|\s)+<br *\/*><br *\/*>", "g");
        var match = myRegexp.exec(my_string);
        match = match[0];
    } catch (error) {
        try {
            // everything after <br><br>
            var myRegexp = new RegExp("<br *\/*><br *\/*>(.|\s)+", "g");
            var match = myRegexp.exec(my_string);
            match = match[0];
        } catch (error) {
            // everything between newlines
            var myRegexp = new RegExp("\\n\\n(.|\s)+", "g");
            var match = myRegexp.exec(my_string);
            console.log(match);
            match = match[0];
        }
    }

    var make_list = match.replace(/[ ]*(<br *\/*>|\*|<[^>]*>|\&amp\;)[ ]*/g, ",");
    make_list = make_list.replace(/[ ]*V[^a-zA-Z]/g, ",");
    make_list = make_list.replace(/[ ]*\*[^a-zA-Z]/g, " ");
    
    make_list = make_list.split(',');

    var filtered = make_list.filter(function (el) {
        return (el != "" && el != " ");
    });

    var item_list_final = []
    var filtered = filtered.forEach((item) => {
        
        // remove weird spacing
        my_string = item.trim();
        my_string = my_string.replace(/\s+/g, " ");

        // check if exists
        if (!(item_list_final.includes(my_string))) {
            item_list_final.push(my_string);
        }
    })

    return item_list_final;

}

exports.getDaysMenus = (request, response) => {
    const dayNum = request.params.dayNum;
	
    const asyncWrapper = async (dayNum) => {
        
        // brute force selected day
        var selected_day = new Date();
        while (selected_day.getDay() != dayNum && dayNum < 7){
            selected_day.setDate(selected_day.getDate() + 1);
        }
        
        var dd = String(selected_day.getDate()).padStart(2, '0');
        var mm = String(selected_day.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = selected_day.getFullYear();
        
        var today_str = yyyy + '-' + mm + '-' + dd;
        
        // debug
        // console.log(today_str);
        // var today_str = "2022-05-03";
        // var today_str = request.query.debug;

        // make async menu call
        const requestPromise = util.promisify(make_request);

        var options = {
            'method': 'GET',
            'url': 'https://www.googleapis.com/calendar/v3/calendars/hc.dining@gmail.com/events?key=+'+process.env.calKey+'+&timeMin='+today_str+'T06:00:00-05:00&timeMax='+today_str+'T22:00:00-05:00&singleEvents=true',
            'headers': {
            }
        };
        const my_response = await requestPromise(options);

        // get days menu
        final_results = {}
        JSON.parse(my_response.body)["items"].forEach(function (item, index) {
            // add everything but coop menu
            checkAndAdd(final_results, item);
        })

        // create meal item lists and parse times
        var to_json = [];
        for (const [key, value] of Object.entries(final_results)){
            to_json.push([key.trim(), cleanString(value["description"]), Date.parse(value["start"]["dateTime"])]);
        }

        // sort to correct meal order
        to_json.sort((a, b) => a[2] - b[2])
        
        // pop datetime
        to_json.forEach((item, index) => {
            to_json[index].pop();
        })

        return response.json(to_json);
    }

    asyncWrapper(dayNum);
}