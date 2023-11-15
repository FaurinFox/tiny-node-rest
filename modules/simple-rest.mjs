import express from 'express';
import config from '../conf.json' assert {type: 'json'};
import mail from './mailer.mjs';
import Utilities from './utils.mjs';

const debug = config.debug;
const app = express();
const utils = new Utilities();

let attachmentAddress = config.mailConfig.to;
let attachmentKey = attachmentAddress.split('@')[0];

function send(message, request, response) {
    if (request.query.format) {
        if (request.query.format.toLowerCase() === "json") {
            response.send({ message: `${message}` });
        }else{
            response.send(`${message}`);
        }
    }else{
        response.send(`${message}`);
    }
}

app.use(express.static('static'));

app.get('/', (req, res) => {
    send("Hello There! You're probably not supposed to see this, I think you need a specific endpoint.", req, res);
});

app.get('/sl-cda', async (req, res) => {
    if(req.query.attachmentKey) {
        attachmentKey = req.query.attachmentKey;
        attachmentAddress = attachmentKey+"@"+attachmentAddress.split('@')[1];
        console.log("New key; "+attachmentKey+", replaced old. New Address; "+attachmentAddress);
    }
    if (req.query.secret) {
        // Has secret associated, check it
        if (req.query.secret == config.secret) {
            send("You got it, SL-CDA Notification was sent to the target", req, res);
            try {
                if (!debug)
                    await mail({
                        from: config.mailConfig.from,
                        to: attachmentAddress,
                        subject: `SL-CDA +${utils.daysToHours(!isNaN(Number(req.query.days)) ? Number(req.query.days) : 1)}`,
                        text: `CDA was triggerred for ${!isNaN(Number(req.query.days)) ? Number(req.query.days) : 1} ${!isNaN(Number(req.query.days)) && Number(req.query.days) !== 1 ? 'days' : 'day'}.`
                    });
                else
                    console.warn("Debug mode was active, would've sent email if it wasn't.");
            } catch (error) {
                console.error(error);
            }

        }else{
            // These will ignore format parameter, always return json
            res.status(406).json({error: 'Unauthorized, not accepted'});
            // While this locally will return express's 406, on the domain
            // Nginx will be configured to override and return its own.
        }
    }else{
        if (req.query.attachmentKey) {
            send("Key set.", req, res);
        }else{
            res.status(401).json({error: 'Unauthorized, secret missing'});
            // Much the same as the above comments.
        }
    }
});

app.use(express.urlencoded({
    extended: true
}));

export default app;
