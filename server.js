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

// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaw4Il91xB0vD8ZIr3TAkXT1OIV785JVc",
  authDomain: "busapp-sign-in.firebaseapp.com",
  projectId: "busapp-sign-in",
  storageBucket: "busapp-sign-in.appspot.com",
  messagingSenderId: "699278121565",
  appId: "1:699278121565:web:7fa5062dd388468f0e8bb4",
  measurementId: "G-8F2SX62GJM"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

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

function reset(condition) {
    let hour = new Date().getHours();
    if (hour == 0 || condition) {
        fs.readFile('buslist.json', "utf-8", (err, jsonString) => {

            let buslist = JSON.parse(jsonString);
    
            for (i = 0; i < buslist.buslist.length; i++) {
                buslist.buslist[i].status = "Not Arrived";
                buslist.buslist[i].change = null;
                buslist.buslist[i].timestamp = null;
            };
    
            let final = JSON.stringify(buslist);
    
            fs.writeFile('buslist.json', final, err => {})

            /*let logWrite = {
                "bus" : 0,
                "description" : "All bus statuses reset",
                "timestamp" : time
            }
            fs.writeFile('logs.json', JSON.stringify(logWrite), err => {})*/

        });
    }
}
reset(false);
setInterval(reset, (1000*60*60), false);

app.get("/reset", (req, res) => {
    reset(true);
    res.redirect("/buslist");
})

//let busNum = Number(req.body.busnum);    
/*
var action = new Date(); 
var seconds = action.getTime();
seconds = seconds/(1000*60*60*24);
var days_since = Math.trunc(seconds);
var temp = seconds - days_since;
var hour = Math.trunc(temp * 24);
temp = temp*24 - hour
var minute = Math.trunc(temp * 60)
if (minute < 10) {
    minute = '0' + minute;
}
if(hour > 12){
    hour -= 12;
    var time = (hour-6 + ":" + minute + "PM");
} else {
    var time = (hour-6 + ":" + minute + "AM");
}
*/

var action = new Date(); 
var seconds = action.getTime();
seconds = seconds/(1000*60*60*24);

var days_since = Math.trunc(seconds);
var temp = seconds - days_since;
var hour = Math.trunc(temp * 24);

temp = temp*24 - hour;
var minute = Math.trunc(temp * 60);
hour -= 6
*/
var time;
function getTime() {
    var action = new Date();
    var hour = action.getHours();
    var minute = action.getMinutes();

    if (hour > 12)
    {
        //hour = hour - 6 - 12;
        hour -= 12;
    }
    time = (hour + ":" + minute);
    if (minute < 10)
    {
        time = (hour + ":0" + minute);
    }
    time = `${time} PM`;
}
getTime();
setInterval(getTime, 1000);
    
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

app.post('/updateChange', (req, res) => {

    let bus = req.body;
    change = bus.newChange;

    fs.readFile('buslist.json', "utf-8", (err, jsonString) => {

        let buslist = JSON.parse(jsonString);

        for (i = 0; i < buslist.buslist.length; i++) {
            if (buslist.buslist[i].number == bus.number) {
                buslist.buslist[i].change = bus.newChange;
            }
        };

        let final = JSON.stringify(buslist);

        fs.writeFile('buslist.json', final, err => {})

        res.redirect('buslist'); 
    });

})

app.get('/getlogs', (req, res) => {
    let status_change = {
        bus: busNum,
        description: action_done,
        timestamp: time
    };
    bus = Number(req.body.busnum);
    
    let logsList = {"logs":[]};

    fs.readFile('logs.JSON', "utf-8", (err, jsonString) => {``

        let changeList = JSON.parse(jsonString);

        for (i = 0; i < changeList.changeList.length; i++) {
            logsList.changeList.push(changeList.changeList[i])
        };

        logsList.changeList.push(status_change);

        logsList.changeList = changeList.changeList.sort((a, b) => {
            if (a.number < b.number) {
                return -1;
              }
        })

        let final = JSON.stringify(logsList);

        fs.writeFile('logs.JSON', final, err => {})

        res.redirect('logs'); 
    });
    let datajson = fs.readFileSync('logs.JSON');
    let data = JSON.parse(datajson);
    res.send(data);

});






//google sign in
app.post('/verify', (req, res) => {
    /*
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');

const {google} = require('googleapis');
const people = google.people('v1');


const keyPath = path.join(__dirname, 'oauth2.keys.json');
let keys = {redirect_uris: ['http://localhost:8080/verify']};
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web;
}


const oauth2Client = new google.auth.OAuth2(
  keys.client_id = '699278121565-mp5qevri37pjnueollo755hdnjbqocrm.apps.googleusercontent.com',
  keys.client_secret = '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',
  keys.redirect_uris[0]
);


google.options({auth: oauth2Client});

const docs = require('@googleapis/docs')
const { GoogleAuth } = require('google-auth-library');

const auth = new docs.auth.GoogleAuth({
  keyFilename: 'PATH_TO_SERVICE_ACCOUNT_KEY.json',
    
  scopes: ['https://www.googleapis.com/auth/documents']
});
var clientId = '699278121565-mp5qevri37pjnueollo755hdnjbqocrm.apps.googleusercontent.com';
var clientSecret = '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';
var redirectUrl = '/verify';

oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
	oauth2Client.credentials = {
	                refresh_token: 'your_refresh_token'
	};
	oauth2Client.refreshAccessToken(function(err, tokens){
	console.log(tokens)
	oauth2Client.credentials = {access_token : tokens.access_token}
	callback(oauth2Client);
    });

async function authenticate(scopes) {
  return new Promise((resolve, reject) => {
    
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
            oauth2Client.credentials = tokens; 
            resolve(oauth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        
        opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
      });
    destroyer(server);
  });
}

    

console.log('marker1');

async function runSample() {
    console.log('marker2');
  
  const data_1 = await people.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses',
  });
  console.log(data_1.data);
}



const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'profile',
];



authenticate(scopes)
runSample(oauth2Client)

*/
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('699278121565-mp5qevri37pjnueollo755hdnjbqocrm.apps.googleusercontent.com');
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
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



app.get('/verify', (req, res) => {
    res.redirect('/buslist');
})

});