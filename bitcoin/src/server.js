const Express = require('express')
const bodyParser = require('body-parser')
const Cryptoex = require("cryptoex");
const { WebClient } = require('@slack/client');


const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

const {SLACK_TOKEN: slackToken, WEB_TOKEN: webtoken, PORT} = process.env
let cryptoex = new Cryptoex({fixerAccessKey: '176de4eb76c7d6cf82c33b2cfe808ee4'});
const web = new WebClient(webtoken);



if (!slackToken) {
  console.error('missing environment variables SLACK_TOKEN')
  process.exit(1)
}

const port = PORT || 80


app.post('/', (req, res) => {
  let a = req.body['text'].substring(0,3);
  let b = req.body['text'].substring(4);
  cryptoex.getRates(a).then((rates) => {
  	//console.log(rate)
  	res.send(req.body['command'] + ': ' + req.body['text']);
  	web.chat.postMessage({ channel: req.body['channel_id'], text: '1' + a + ' is: ' + rates[b] + b})
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