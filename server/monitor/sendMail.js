var nodemailer = require('nodemailer');
var email_config = require('./email_config.js');

var transporter = nodemailer.createTransport({
    service: email_config.auth.service,
    auth: {
        user: email_config.auth.user, // Your email id
        pass: email_config.auth.password // Your password
    }
});


// Send Mail
function sendMail(status){
    
    var subjectToSend = "ALERT: High Load"
    var textToSend;

    if (status == 'c')
        textToSend="High CPU Load"
    else
        textToSend="High Memory Load"

    var mailOptions = {
        from: email_config.options.from,
        to: email_config.options.to,
        subject: subjectToSend,
        text: textToSend
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}


sendMail(process.argv[2])