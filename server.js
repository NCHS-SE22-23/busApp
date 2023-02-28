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


app.use(express.json({  extended: true }));
app.use(express.urlencoded({  extended: true }));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended:true
}));
const fs = require('fs');
const { ok } = require('assert');

// *** GET Routes - display pages ***
// Root Route
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.render('pages/index');
});

function reset() {
    let hour = new Date().getHours();
    console.log(hour);
    if (hour == 0) {
        fs.readFile('buslist.json', "utf-8", (err, jsonString) => {

            let buslist = JSON.parse(jsonString);
    
            for (i = 0; i < buslist.buslist.length; i++) {
                buslist.buslist[i].status = "Not Arrived";
                buslist.buslist[i].change = null;
                buslist.buslist[i].timestamp = null;
            };
    
            let final = JSON.stringify(buslist);
    
            fs.writeFile('buslist.json', final, err => {})
        });
    }
}
reset();
setInterval(reset, (1000*60*60)); 

//let busNum = Number(req.body.busnum);    
var action = new Date(); 
var seconds = action.getTime();
seconds = seconds/(1000*60*60*24);
var days_since = Math.trunc(seconds);
var temp = seconds - days_since;
var hour = Math.trunc(temp * 24);
temp = temp*24 - hour
var minute = Math.trunc(temp * 60)
var time = (hour-6 + ":" + minute);
var action_done = "";

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
    action_done = "Bus Added";
    let busNum = Number(req.body.busnum);    

    let newBusObj = {
        number: busNum,
        status: "Not Arrived",
        change: null,
        timestamp: time
    };

    let fullList = {"buslist":[]};


    fs.readFile('buslist.json', "utf-8", (err, jsonString) => {

        let buslist = JSON.parse(jsonString);

        for (i = 0; i < buslist.buslist.length; i++) {
            fullList.buslist.push(buslist.buslist[i])
        };

        fullList.buslist.push(newBusObj);

        fullList.buslist = fullList.buslist.sort((a, b) => {
            if (a.number < b.number) {
                return -1;
              }
        })

        let final = JSON.stringify(fullList);

        fs.writeFile('buslist.json', final, err => {})

        res.redirect('settings'); 
    });

    

});
app.get('/getbus', (req, res) => {
    let datajson = fs.readFileSync('buslist.json');
    let data = JSON.parse(datajson);
    res.send(data);
});
app.post('/delbus', (req, res) => {
    action_done = "Bus Deleted";

    let fullList = {"buslist":[]};

    if(req.body.busnum == "clear") {
        let final = JSON.stringify(fullList);

        fs.writeFile('buslist.json', final, err => {});
        res.redirect('settings');
        return;
    }

    fs.readFile('buslist.json', "utf-8", (err, jsonString) => {

        let buslist = JSON.parse(jsonString);

        for (i = 0; i < buslist.buslist.length; i++) {
            fullList.buslist.push(buslist.buslist[i])
        };

        for (i = 0; i < fullList.buslist.length; i++) {
            if(fullList.buslist[i].number == req.body.busnum) fullList.buslist.splice(i, i+1);
        }

        let final = JSON.stringify(fullList);

        fs.writeFile('buslist.json', final, err => {});
    });
    res.redirect('settings');
});
app.get('/logout', (req, res) => {
    res.redirect('/');
})

app.post('/updateStatus', (req, res) => {

    let bus = req.body;
    change = bus.newStatus;

    fs.readFile('buslist.json', "utf-8", (err, jsonString) => {

        let buslist = JSON.parse(jsonString);

        for (i = 0; i < buslist.buslist.length; i++) {
            if (buslist.buslist[i].number == bus.number) {
                buslist.buslist[i].status = bus.newStatus;
                buslist.buslist[i].timestamp = time;
            }
        };

        let final = JSON.stringify(buslist);

        fs.writeFile('buslist.json', final, err => {})

        res.redirect('buslist'); 
    });

})

app.get('/getlogs', (req, res) => {
    let status_change = {
        number: busNum,
        change: change,
        timestamp: time
    };

    

    

    
    
    
    
    let datajson = fs.readFileSync('buslist.json');
    let data = JSON.parse(datajson);
    res.send(data);

});
//google sign in
app.post('/verify', (req, res) => {
    /*
    csrf_token_cookie = this.request.cookies.get('g_csrf_token')
if  (csrf_token_cookie)
    webapp2.abort(400, 'No CSRF token in Cookie.');
csrf_token_body = this.request.get('g_csrf_token');
if  (! csrf_token_body)
    webapp2.abort(400, 'No CSRF token in post body.');
if (csrf_token_cookie != csrf_token_body)
    webapp2.abort(400, 'Failed to verify double submit cookie.');

    const {OAuth2Client} = require('google-auth-library');
    const client = new OAuth2Client('699278121565-mp5qevri37pjnueollo755hdnjbqocrm.apps.googleusercontent.com');
    async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: csrf_token_cookie,
      audience: '699278121565-mp5qevri37pjnueollo755hdnjbqocrm.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}
verify().catch(console.error);
*/
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');

const {google} = require('googleapis');
const people = google.people('v1');

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */
const keyPath = path.join(__dirname, 'oauth2.keys.json');
let keys = {redirect_uris: ['http://localhost:8080/verify']};
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web;
}

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
  keys.client_id = '699278121565-mp5qevri37pjnueollo755hdnjbqocrm.apps.googleusercontent.com',
  keys.client_secret = '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',
  keys.redirect_uris[0]
);

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({auth: oauth2Client});

/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 */
async function authenticate(scopes) {
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
    });
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            const qs = new url.URL(req.url, 'http://localhost:8080')
              .searchParams;
            res.end('Authentication successful! Please return to the console.');
            server.destroy();
            const {tokens} = await oauth2Client.getToken(qs.get('code'));
            oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
            resolve(oauth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
      });
    destroyer(server);
  });
}

async function runSample() {
  // retrieve user profile
  const res = await people.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses',
  });
  console.log(res.data);
}

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'profile',
];
authenticate(scopes)
  .then(client => runSample(client))

});

app.get('/verify', (req, res) => {
    res.redirect('/buslist');
});