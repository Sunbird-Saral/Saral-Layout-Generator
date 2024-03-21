const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000

app.use('/webapp', express.static(path.join(__dirname, 'build')));

app.get('/webapp/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log('Server is up on port '+port);
});
