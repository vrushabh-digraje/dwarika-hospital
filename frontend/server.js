import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow requests from frontend (usually on port 5173)
app.use(express.json()); // Parse JSON bodies

// Routes matching src/lib/api.ts endpoints
app.post('/api/auth/login', (req, res) => {
    console.log('Login attempt:', req.body);
    // Simulate DB check
    res.json({ success: true, token: 'mock-token-123', user: { name: 'John Doe' } });
});

app.post('/api/auth/register', (req, res) => {
    console.log('Registration:', req.body);
    res.json({ success: true, message: 'Account created successfully' });
});

app.post('/api/inquiry', (req, res) => {
    console.log('Online Form:', req.body);
    res.json({ success: true, message: 'Form received' });
});

app.post('/api/appointments', (req, res) => {
    console.log('Appointment Request:', req.body);
    res.json({ success: true, message: 'Appointment request logged' });
});

// Add endpoint for forgot password
app.post('/api/auth/forgot-password', (req, res) => {
    console.log('Forgot Password Request:', req.body);
    res.json({ success: true, message: 'Password reset link sent.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
    console.log(`API endpoint available at http://localhost:${PORT}/api`);
});