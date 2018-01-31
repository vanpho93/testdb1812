const express = require('express');

const app = express();

app.get('/cong/:a/:b', (req, res) => {
    const { a, b } = req.params;
    if (isNaN(a) || isNaN(b)) return res.status(400).send('Type error.');
    res.send(+a + +b + '');
});

module.exports = app;
