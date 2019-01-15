const Express = require('express')
const bodyParser = require('body-parser')
const Cryptoex = require("cryptoex");

const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

const {SLACK_TOKEN: slackToken, PORT} = process.env
let cryptoex = new Cryptoex({fixerAccessKey: '176de4eb76c7d6cf82c33b2cfe808ee4'});


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
  	res.send('1' + a + ' is: ' + rates[b] + b);
	});
})


app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})