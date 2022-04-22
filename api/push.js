var FCM = require('fcm-push');
var serverkey = '<insert-server-key>';  
var fcm = new FCM(serverkey);
var message {  
    to : '<insert-device-token>',
    collapse_key : '<insert-collapse-key>',
    data : {
        <random-data-key1> : '<random-data-value1>',
        <random-data-key2> : '<random-data-value2>'
    },
    notification : {
        title : 'Title of the notification',
        body : 'Body of the notification'
    }
};
fcm.send(message, function(err,response){  
    if(err) {
        console.log("Something has gone wrong !");
    } else {
        console.log("Successfully sent with resposne :",response);
    }
});