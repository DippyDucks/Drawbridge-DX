import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Login, Register } from './src/authentication/AuthenticationManager.js';
import orm from './db/orm.js';

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON body
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, JS, CSS)
app.use(express.static('public'));

// Directly use the model’s Login function as the route handler
app.post('/login/:strategy', async (req, res) => {
    try {
        const response = await Login(req.params.strategy, req.body);
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
        res.json(response);
    } catch (err) {
        console.log("server.js err: ", err);
        res.status(err.status || 500).json(err);
    }
});

app.post('/register/:strategy', async (req, res) => {
    try {
        const response = await Register(req.params.strategy, req.body);
        res.json(response);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
