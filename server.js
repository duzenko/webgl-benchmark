const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const port = 8081

app.get('/shader', function (req, res) {
    var name = req.query.name
    var vertex = fs.readFileSync(__dirname + '/shaders/' + name + '.vs', 'utf8')
    var fragment = fs.readFileSync(__dirname + '/shaders/' + name + '.fs', 'utf8')
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.send({ vertex, fragment })
})
app.use(express.static('public'))
app.use('/src', express.static('src'))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/a.html'));
})
app.listen(port, () => console.log(`Listening on port ${port}!`))