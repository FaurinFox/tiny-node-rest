import config from '../conf.json' assert {type: 'json'};
import nodemailer from 'nodemailer';

const mailer = function mail(detailsObject) {
    // Create a Nodemailer transport using SMTP
    const transporter = nodemailer.createTransport(
    {
        host: config.mailConfig.host, // host
        port: config.mailConfig.port, // port
        secure: config.mailConfig.secure, // use SSL or not,
        auth: { // user auth
            user: config.mailConfig.auth.user,
            pass: config.mailConfig.auth.password
        }
    });
    // Define the email options
    const mailOptions = {
        from: detailsObject.from,
        to: detailsObject.to,
        subject: detailsObject.subject,
        text: detailsObject.text
    };
    // Return a promise in order to catch the error in the main code
    return new Promise((resolve, reject) => {
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(new Error('Error sending email:', error));
            } else {
                console.log('Email sent:', info.response);
                resolve(info);
            }
        });
    })
}

export default mailer;