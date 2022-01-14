//products.js

const { db } = require('../util/admin');

exports.updateToken = (request, response) => {
    const uid = request.body.uid;
    const expo_token = request.body.expoToken;
	
    const asyncWrapper = async (uid, expo_token) => {
        
        await db.collection("notification-tokens").doc(uid).set({expoToken: expo_token});

        return response.json({"status": "success"});
    }

    asyncWrapper(uid, expo_token);
}

exports.getNotifications = (request, response) => {
    const uid = request.params.uid;
	
    const asyncWrapper = async (uid) => {

        const docRef = db.collection("notification-tokens").doc(uid);
        const doc = await docRef.get();

        if (doc.data().hasOwnProperty('active')){
            const status = {"status": doc.data().active};
        } else {
            const status = {"status": null};
        }

        return response.json(status);
    }

    asyncWrapper(uid);
}

exports.updateNotifications = (request, response) => {
    const uid = request.body.uid;
    const status = request.body.status;
	
    const asyncWrapper = async (uid, status) => {

        await db.collection("notification-tokens").doc(uid).update({active: status});

        const resp = {"status": "success"};

        return response.json(resp);
    }

    asyncWrapper(uid, status);
}