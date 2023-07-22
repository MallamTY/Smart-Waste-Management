// import fetch from "node-fetch";

// const url = 'https://api.smslive247.com/api/v4/sms';
// const options = {
//   method: 'POST',
//   headers: {
//     accept: 'application/json',
//     'content-type': 'application/*+json',
//     Authorization: 'MA-b2a1ce4a-1981-411c-93c7-d5a2f8479e51'
//   },
//   body: '{"senderID":"test","messageText":"test","mobileNumber":"+2347037767045"}'
// };

// fetch(url, options)
//   .then(json => console.log(json))
//   .catch(err => console.error('error:' + err));


// const accountSid = "ACede7f2755fb7a2a087f4057f88345ec6";
// const authToken = "5949e9ebb11ef037bb39de12852a5fd7";
// import twilio from 'twilio';

// const client =twilio(accountSid, authToken);

// client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from: '+15017122661',
//      to: '+2347037767045'
//    })
//   .then(message => console.log(message.sid)).catch(err => console.log(err));

// import messagebird from "messagebird";
// const client = messagebird.initClient("RqpLXXItqGag10CvVVwf65fwY");

// client.messages.create({
//     originator : '+2347037767045',
//     recipients : [ '+2347037767045' ],
//     body : 'Hi! This is your first message'
// },
// function (err, response) {
//     if (err) {
//     console.log("ERROR:");
//     console.log(err);
// } else {
//     console.log("SUCCESS:");
//     console.log(response);
//         }
// });
