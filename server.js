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

// *** GET Routes - display pages ***
// Root Route
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.render('pages/index');
});

console.log(new Date().getHours());

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

    let busNum = Number(req.body.busnum);
    
    var action = new Date(); 
    var seconds = action.getTime();
    seconds = seconds/(1000*60*60*24);
    var days_since = Math.trunc(seconds);
    var temp = seconds - days_since;
    var hour = Math.trunc(temp * 24);
    temp = temp*24 - hour
    var minute = Math.trunc(temp * 60)

    var time = (hour-6 + ":" + minute);


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

    fs.readFile('buslist.json', "utf-8", (err, jsonString) => {

        let buslist = JSON.parse(jsonString);

        var action = new Date(); 
        var seconds = action.getTime();
        seconds = seconds/(1000*60*60*24);
        var days_since = Math.trunc(seconds);
        var temp = seconds - days_since;
        var hour = Math.trunc(temp * 24);
        temp = temp*24 - hour
        var minute = Math.trunc(temp * 60)

    var time = (hour-6 + ":" + minute);

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