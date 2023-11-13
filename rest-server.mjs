import app from './simple-rest.mjs'; // Adjust the path based on the actual file structure

const port = 3770;

// This application is served via reverse proxy (nginx) on a domain providing https
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
