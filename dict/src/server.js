const Express = require('express')
const bodyParser = require('body-parser')
var wd = require("word-definition");
const { WebClient } = require('@slack/client');

const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

const {SLACK_TOKEN: slackToken, WEB_TOKEN: webtoken, PORT} = process.env
const web = new WebClient(webtoken);



if (!slackToken) {
  console.error('missing environment variables SLACK_TOKEN and/or REBRANDLY_APIKEY')
  process.exit(1)
}

const port = PORT || 80


app.post('/', (req, res) => {
  //console.log(req.body['text']);
 console.log(req.body);
  wd.getDef(req.body['text'], "en", null, function(definition) {
    console.log(definition);
    res.send(req.body['command'] + ': ' + req.body['text']);
    web.chat.postMessage({ channel: req.body['channel_id'], text: 'The definition of ' + definition['word'] + ' (' + definition['category'] + ')' + ' is: ' + definition['definition'] })
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ');
  })
  .catch(console.error);

    });
  

})


app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})