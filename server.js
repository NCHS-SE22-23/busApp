// Load Node modules
var express = require('express');
const ejs = require('ejs');
// Initialise Express
var app = express();
// Render static files
app.use(express.static('public'));
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Port website will run on
app.listen(8080);
console.log('On Successfully (probably)')

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended:true
}));
const fs = require('fs');

// *** GET Routes - display pages ***
// Root Route
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/buslist', function (req, res) {
    const f = require('fs');
    const readline = require('readline');
    var user_file = 'buslist.txt';
    var r = readline.createInterface({
        input : f.createReadStream(user_file)
    });
    r.on('line', function (text) {
        res.send
    }); 
    res.render('pages/buslist');
});

app.get('/buschanges', function(req, res) {
    res.render('pages/buschanges');
});

app.get('/logs', function (req, res) {
    res.render('pages/logs');
});

app.get('/settings', function (req, res) {
    res.render('pages/settings');
});
app.post('/addbus', (req, res) => {
    const fs = require('fs');
    let num = Number(req.body.busnum);


    let bus = JSON.stringify(num);

    let datajson = fs.readFileSync('buslist.json');
    let data = JSON.parse(datajson);
    data.push(bus);

    fs.writeFile('buslist.json', JSON.stringify(data), function(err) {
        if (err) throw err;
    });
    res.redirect('settings');
});
app.get('/getbus', (req, res) => {
    let datajson = fs.readFileSync('buslist.json');
    let data = JSON.parse(datajson);
    res.send(datajson);
})

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
verify().catch(console.error);