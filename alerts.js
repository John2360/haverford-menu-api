const { db } = require('./util/admin');
const schedule = require('node-schedule');
const request = require('request');
const util = require('util');

async function getMenu(day_num, meal) {
    const requestPromise = util.promisify(request);

    var options = {
        'method': 'GET',
        'url': 'http://localhost:3000/menus/'+day_num,
        'headers': {
        }
    };

    const response = await requestPromise(options);

    return JSON.parse(response.body)[meal];

}

async function getActiveTokens() {


    const queryRef = db.collection('notification-tokens').where('active', '==', true);
    const data = await queryRef.get();

    tokens = [];

    data.forEach((item) => {

        if (item.data().active == true) {

            if (item.data()?.expoToken != null) {
                tokens.push(item.data()?.expoToken);
            }

        }

    })

    return tokens;
}

async function sendPush(tokens, title, body) {

    const requestPromise = util.promisify(request);

        var options = {
            'method': 'POST',
            'url': 'http://localhost:3000/notifications/send',
            'headers': {
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "token": tokens,
            "title": title,
            "body": body
        })

        };
        
        const response = await requestPromise(options);

        return response.body;

}

const job = schedule.scheduleJob('* * * * *', function(){

    var now = new Date();
    var minute = now.getMinutes();
    var hour = now.getHours();
    var day = now.getDay();
    var dayOfWeek = day;

    var title = null;

    var isWeekend = (dayOfWeek === 6) || (dayOfWeek  === 0); // 6 = Saturday, 0 = Sunday

    if (!isWeekend){
        // Week day schedule
        if (hour == 8 && minute == 0) {
            // Send breakfast
            title = "Breakfast";
        }

        if (hour == 11 && minute == 30) {
            // Send lunch
            title = "Lunch";
        }

        if (hour == 17 && minute == 0) {
            // Send dinner
            title = "Dinner";
        }

    } else {
        // Weekend schedules
        if (hour == 10 && minute == 0) {
            // Send brunch
            title = "Brunch";
        }

        if (hour == 17 && minute == 0) {
            // Send dinner
            title = "Dinner";
        }
    }

    if (title != null) {
        // Send push
        console.log('Send push notification');

        getActiveTokens().then(function (tokens) {
            // console.log(tokens);
        
            getMenu(day, title).then(function (menu) {
                // console.log(menu);

                let menu_string = "";
                let i = 0;

                for (const item of menu) {
                    if (i == menu.length-1) {
                        menu_string += item.trim();
                    } else if (i == menu.length-2) {
                        menu_string += item.trim()+", and ";
                    } else {
                        menu_string += item.trim()+", ";
                    }

                    i += 1;
                }
        
                sendPush(tokens, title, menu_string).then(function (response) {
                    return response;
                })
            })
        
        })

    }
});