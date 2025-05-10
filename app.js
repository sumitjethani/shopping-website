const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mailRoutes = require('./routes/mailRoutes');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

console.log('Environment variables loaded:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '[REDACTED]' : 'MISSING');
console.log('SUPPORT_EMAIL:', process.env.SUPPORT_EMAIL);
console.log('PORT:', process.env.PORT);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/mail', mailRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server startup error:', err);
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Try a different port.`);
    } else if (err.code === 'EACCES') {
        console.error(`Permission denied on port ${PORT}. Try running with elevated privileges or a different port.`);
    }
});