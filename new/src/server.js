const Express = require('express')
const bodyParser = require('body-parser')
var wd = require("word-definition");
const createShortUrlsFactory = require('./createShortUrls')
const slashCommandFactory = require('./slashCommand')
const { WebClient } = require('@slack/client');
const { RTMClient } = require('@slack/client');



const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

const {SLACK_TOKEN: slackToken, REBRANDLY_APIKEY: apiKey, WEB_TOKEN: webtoken, PORT} = process.env
const web = new WebClient(webtoken);
const rtm = new RTMClient(webtoken);
rtm.start();


if (!slackToken || !apiKey) {
  console.error('missing environment variables SLACK_TOKEN and/or REBRANDLY_APIKEY')
  process.exit(1)
}

const port = PORT || 80

const rebrandlyClient = createShortUrlsFactory(apiKey)
const slashCommand = slashCommandFactory(rebrandlyClient, slackToken)



app.post('/', (req, res) => {
  slashCommand(req.body)
    .then((result) => {
      web.chat.postMessage({ channel: req.body['channel_id'], text: result['text'], attachments: result['attachments'] })
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ');
  })
  .catch(console.error);
     // return res.json(result)
    })
    .catch(console.error)
})


app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})