const { db } = require('../util/admin');

exports.updateToken = async(request, response) => {
    const uid = request.body.uid;
    const expo_token = request.body.expoToken;

    await db.collection("notification-tokens").doc(uid).update({expoToken: expo_token});
    return response.json({"status": "success"});
}

exports.getNotifications = async(request, response) => {
    const uid = request.params.uid;
	
    const docRef = db.collection("notification-tokens").doc(uid);
    const doc = await docRef.get();

    try {
        if (doc.data().hasOwnProperty('active')){
            const status = {"status": doc.data().active};
            return response.json(status);
        } else {
            const status = {"status": null};
            return response.json(status);
        }
    } catch (error) {
        console.log("Account not found. "+error);
        return response.json({"status": null});
    }
}

exports.updateNotifications = async(request, response) => {
    const uid = request.body.uid;
    const status = request.body.status;

    await db.collection("notification-tokens").doc(uid).update({active: status});

    const resp = {"status": "success"};

    return response.json(resp);
}