const express = require('express');
const router = express.Router();
const { sendMail } = require('../controllers/mailController');

router.post('/send-reset', async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const resetToken = Buffer.from(email).toString('base64');
        const resetLink = `http://localhost:3000/reset-password.html?token=${resetToken}&email=${encodeURIComponent(email)}`;

        const subject = 'Password Reset Request - Tortugo';
        const text = `Click the link to reset your password: ${resetLink}`;
        const html = `
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        `;

        await sendMail(email, subject, text, html);
        res.status(200).json({ message: 'Password reset link sent to your email!' });
    } catch (error) {
        console.error('Send reset email error:', error);
        res.status(500).json({ error: 'Failed to send reset email. Please try again later.' });
    }
});

router.post('/send-contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }
        if (!process.env.SUPPORT_EMAIL) {
            return res.status(500).json({ error: 'Support email not configured' });
        }

        const subject = 'New Contact Form Submission - Tortugo';
        const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
        const html = `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
        `;

        await sendMail(process.env.SUPPORT_EMAIL, subject, text, html);
        res.status(200).json({ message: 'Message sent successfully! We will get back to you soon.' });
    } catch (error) {
        console.error('Send contact email error:', error);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

module.exports = router;