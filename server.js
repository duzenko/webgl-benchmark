const express = require('express')
const path = require('path')
const app = express()
const port = 8081

app.use(express.static('public'))
app.use('/src', express.static('src'))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/a.html'));
});
app.listen(port, () => console.log(`Listening on port ${port}!`))