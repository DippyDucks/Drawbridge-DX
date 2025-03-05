import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Login, Register } from './models/AuthenticationModel.js';

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON body

// Serve static files (HTML, JS, CSS)
app.use(express.static('public'));

// Directly use the model’s Login function as the route handler
app.post('/login/:strategy', async (req, res) => {
    try {
        const response = await Login(req);
        if (response.success) {
            res.json({ success: true, token: response.token, clearance: response.clearance });
        } else {
            res.status(400).json({ success: false, message: 'Login failed' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: error });
    }
});

app.post('/register/:strategy', async (req, res) => {
    try {
        const response = await Register(req);
        if (response.success) {
            res.json({ success: true, message: response.message });
        } else {
            res.status(400).json({ success: false, message: 'Register failed' });
        }
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({});
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
