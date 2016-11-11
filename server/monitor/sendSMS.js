var cfg = {};
cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_PHONE_NO;
cfg.recieveNumber = process.env.RECIEVER_PHONE_NO;

var client = require('twilio')(cfg.accountSid, cfg.authToken);

var commandLineArgs = require('command-line-args');

var optionDefinitions = [
  { name: 'highcpu', alias: 'c', type: String },
  { name: 'memory', alias: 'm', type: String}
];

var smsMessage;

var options = commandLineArgs(optionDefinitions);
try{
    var highcpu = options.highcpu
    var memusage = options.memory
    if (highcpu !== undefined){
        smsMessage = "High CPU Utlization on production server!!!"
    } else if (memusage !== undefined){
        smsMessage = "High Memory Utlization on production server!!!"
    }

} catch(error){
    console.error("Error while parsing command line args");
}

// Use this convenient shorthand to send an SMS:
client.sendSms({
    to:cfg.recieveNumber,
    from:cfg.sendingNumber,
    body: smsMessage
}, function(error, message) {
    if (!error) {
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
        console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
        console.log(smsMessage);
        console.log('Oops! There was an error.');
    }
});
