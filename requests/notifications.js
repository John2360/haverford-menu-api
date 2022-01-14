
const { db } = require('../util/admin');
const request_mod = require('request');

exports.sendNotification = (request, response) => {
    const token = request.body.token;
    const title = request.body.title;
    const body = request.body.body;
	
    const asyncWrapper = async (token, title, body) => {

        var options = {
            'method': 'POST',
            'url': 'https://exp.host/--/api/v2/push/send',
            'headers': {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "to": token,
              "title": title,
              "body": body
            })
          
          };

          request_mod(options, function (error, res) {
            if (error) throw new Error(error);
            return response.json(res.body);
          });

    }

    asyncWrapper(token, title, body);
}