import express from 'express';
import config from './conf.json' assert {type: 'json'};

const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
    res.send("Hello There! You're probably not supposed to see this, I think you need a specific endpoint.");
});

app.get('/sl-cda', (req, res) => {
    if (req.query.secret) {
        // Has secret associated, check it
        if (req.query.secret == config.secret) {
            res.send("You got it");
            // Do things here later, possibly email
        }else{
            res.status(406).json({error: 'Unauthorized, not accepted'});
            // While this locally will return express's 406, on the domain
            // Nginx will be configured to override and return its own.
        }
    }else{
        res.status(401).json({error: 'Unauthorized, secret missing'});
        // Much the same as the above comments.
    }
});

app.use(express.urlencoded({
    extended: true
}));

export default app;
