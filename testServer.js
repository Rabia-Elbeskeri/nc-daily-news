const express = require('express');
const app = express();

app.get('/api/topics', (req, res) => {
    res.send('Server is working!');
});

app.listen(8081, () => {
    console.log('Server is running on port 8081');
});
