// server.js
const path = require('path')
const express = require('express')
const layout = require('express-layout')
var bodyParser = require('body-parser');
const routes = require('./routes')
const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// const middleware = [
//   layout(),
//   express.static(path.join(__dirname, 'public')),
// ]
// app.use(middleware)

app.use('/', routes)

app.use((req, res, next) => {
  console.log(req);
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000, () => {
  console.log(`App running at http://localhost:3000`)
  
})