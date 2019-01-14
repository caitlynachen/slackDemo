const Express = require('express')
const bodyParser = require('body-parser')
var wd = require("word-definition");

const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

const {SLACK_TOKEN: slackToken, PORT} = process.env

if (!slackToken) {
  console.error('missing environment variables SLACK_TOKEN and/or REBRANDLY_APIKEY')
  process.exit(1)
}

const port = PORT || 80


app.post('/', (req, res) => {
  console.log(req.body['text']);
  wd.getDef(req.body['text'], "en", null, function(definition) {
    console.log(definition);
    res.send('The definition of ' + definition['word'] + ' (' + definition['category'] + ')' + ' is: ' + definition['definition']);
});
  

})


app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})