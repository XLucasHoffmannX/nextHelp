const express = require("express");
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks')
const routers = require('./src/routes');
const app = express();

const cfg = 'henriquelucashoffmann@gmail.com'
// config nunjucks
app.set('view engine', 'html')
nunjucks.configure('views', {
    express: app,
    noCache: true,
})

// config statics files
app.use(bodyParser.json())
app.use(express.static('public'));

// config request body
app.use(bodyParser.urlencoded({ extended: true }))

// routes 
app.use(routers);

app.listen(3035, console.log('server in on port 3035'))