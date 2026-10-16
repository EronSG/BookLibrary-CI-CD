const express = require('express');
const path = require('path');
const app = express();
const publicDir = path.join(__dirname, 'public');
app.get('/health', (req, res) => res.json({ status: 'ok', module: 'frontend' }));
app.use(express.static(publicDir));
app.get(/.*/, (req, res) => res.sendFile(path.join(publicDir, 'index.html')));
const port = Number(process.env.PORT || 3001);
app.listen(port, '0.0.0.0', () => console.log(`Frontend running on ${port}`));
