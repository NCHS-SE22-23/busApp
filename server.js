// Load Node modules
var express = require("express");
const ejs = require("ejs");
// Initialise Express
var app = express();
// Render static files
app.use(express.static("public"));
// Set the view engine to ejs
app.set("view engine", "ejs");
// Port website will run on
app.listen(8080);

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const fs = require("fs");
const { ok } = require("assert");

var crypto = require('crypto');
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// *** GET Routes - display pages ***
// Root Route
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.render("pages/index");
});

function reset(condition) {
  let hour = new Date().getHours();
  if (hour == 0 || condition) {
    fs.readFile("buslist.json", "utf-8", (err, jsonString) => {
      let buslist = JSON.parse(jsonString);

      for (i = 0; i < buslist.buslist.length; i++) {
        buslist.buslist[i].status = "Not Arrived";
        buslist.buslist[i].change = null;
        buslist.buslist[i].timestamp = null;
      }

      let final = JSON.stringify(buslist);

      fs.writeFile("buslist.json", final, (err) => {});

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
setInterval(reset, 1000 * 60 * 60, false);

app.get("/reset", (req, res) => {
  reset(true);
  res.render("pages/buslist");
});

//let busNum = Number(req.body.busnum);

var time;
function getTime() {
  var action = new Date();
  var hour = action.getHours();
  var minute = action.getMinutes();

  let now = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });


  return (
    now.slice(now.indexOf(",") + 2, now.indexOf(":") + 3) +
    " " +
    now.slice(now.indexOf("M") - 1)
  );
}
getTime();

var action_done = "";

function verifyToken(req, res) {
  let cookies = req.cookies;
  //let c_email = cookies.slice(cookies.indexOf('=')+1, cookies.indexOf('%')) + '@' + cookies.slice(cookies.indexOf('%') + 3, cookies.indexOf(';'));
  let c_email = cookies['c_email'];
  let c_token = cookies['c_token'];

  let shasum = crypto.createHash('sha1');
  shasum.update(c_email);
  let hashedEmail = shasum.digest('hex');

  if (hashedEmail == c_token) {
    res.clearCookie('c_email');
    res.clearCookie('c_token');
    res.cookie('c_email', c_email, {maxAge: 3600000, httpOnly: true});
    res.cookie('c_token', c_token, {maxAge: 3600000, httpOnly: true})

    return true;
  }
  return false;
}

app.get("/buslist", function (req, res) {
  if (verifyToken(req, res)) {
    /*
    const f = require("fs");
    const readline = require("readline");
    var user_file = "buslist.txt";
    var r = readline.createInterface({
      input: f.createReadStream(user_file),
    });
    r.on("line", function (text) {
      res.send;
    }); */
    res.render("pages/buslist");
  }
  else {
    res.redirect('/')
  }
});

app.get("/buschanges", function (req, res) {
  if (verifyToken(req, res)) 
  res.render("pages/buschanges");
  else res.redirect('/');
});

app.get("/logs", function (req, res) {
  if (verifyToken(req, res))
  res.render("pages/logs");
  else res.redirect('/');
});

app.get("/settings", function (req, res) {
  if (verifyToken(req, res))
  res.render("pages/settings");
  else res.redirect('/');
});

app.post("/addemail"), (req, res) => {
  action_done = "Email Added";
  fs.readFile("whitelist.json", (err) => {
    fs.writeFile("whitelist.json", req.body, (err) => {});
  })}

app.post("/delemail"), (req, res) => {
  action_done = "Email Deleted";
  //delete email
  fs.readFile("whitelist.json", (err, content) => {
    var data = JSON.parse(content);
    delete data[req.body];
  });
}

app.post("/addbus", (req, res) => {
  action_done = "Bus Added";
  let busNum = Number(req.body.busnum);

  let newBusObj = {
    number: busNum,
    status: "Not Arrived",
    change: null,
    timestamp: getTime(),
  };

  let fullList = { buslist: [] };

  fs.readFile("buslist.json", "utf-8", (err, jsonString) => {
    let buslist = JSON.parse(jsonString);

    for (i = 0; i < buslist.buslist.length; i++) {
      fullList.buslist.push(buslist.buslist[i]);
    }

    fullList.buslist.push(newBusObj);

    fullList.buslist = fullList.buslist.sort((a, b) => {
      if (a.number < b.number) {
        return -1;
      }
    });

    let final = JSON.stringify(fullList);

    fs.writeFile("buslist.json", final, (err) => {});

  });

  let newChange = {
    bus: busNum,
    description: "Bus Added",
    timestamp: getTime(),
  };

  let changeList = { logs: [] };

  fs.readFile("logs.json", "utf-8", (err, jsonString) => {
    let buslist = JSON.parse(jsonString);

    for (i = 0; i < buslist.logs.length; i++) {
      changeList.logs.push(buslist.logs[i]);
    }

    changeList.logs.push(newChange);

    changeList.logs = changeList.logs.sort((a, b) => {
      if (a.number < b.number) {
        return -1;
      }
    });

    let final = JSON.stringify(changeList);

    fs.writeFile("logs.json", final, (err) => {});

    res.redirect("settings");
  });



});
app.get("/getbus", (req, res) => {
  let datajson = fs.readFileSync("buslist.json");
  let data = JSON.parse(datajson);
  res.send(data);
});

app.get("/getlogs", (req, res) => {
  let datajson = fs.readFileSync("logs.json");
  let data = JSON.parse(datajson);
  res.send(data);
});

app.post("/delbus", (req, res) => {
  let fullList = { buslist: [] };

  if (req.body.busnum == "clear") {
    let final = JSON.stringify(fullList);

    fs.writeFile("buslist.json", final, (err) => {});
    res.redirect("settings");
    return;
  }

  fs.readFile("buslist.json", "utf-8", (err, jsonString) => {
    let buslist = JSON.parse(jsonString);

    for (i = 0; i < buslist.buslist.length; i++) {
      fullList.buslist.push(buslist.buslist[i]);
    }

    for (i = 0; i < fullList.buslist.length; i++) {
      if (fullList.buslist[i].number == req.body.busnum)
        fullList.buslist.splice(i, i + 1);
    }

    let final = JSON.stringify(fullList);

    fs.writeFile("buslist.json", final, (err) => {});
  });

  let busNum = Number(req.body.busnum);
  let newChange = {
    bus: busNum,
    description: "Bus Removed",
    timestamp: getTime(),
  };

  let changeList = { logs: [] };

  fs.readFile("logs.json", "utf-8", (err, jsonString) => {
    let buslist = JSON.parse(jsonString);

    for (i = 0; i < buslist.logs.length; i++) {
      changeList.logs.push(buslist.logs[i]);
    }

    changeList.logs.push(newChange);

    changeList.logs = changeList.logs.sort((a, b) => {
      if (a.number < b.number) {
        return -1;
      }
    });

    let final = JSON.stringify(changeList);

    fs.writeFile("logs.json", final, (err) => {});

    res.redirect("settings");
  });



});
app.get('/login', (req, res) => {
    res.render('pages/login');
})
app.get("/logout", (req, res) => {
  res.clearCookie('c_email');
  res.clearCookie('c_token');
  res.redirect("/");
});

app.post("/updateStatus", (req, res) => {
  let bus = req.body;
  change = bus.newStatus;
  time = getTime();

  fs.readFile("buslist.json", "utf-8", (err, jsonString) => {
    let buslist = JSON.parse(jsonString);

        for (i = 0; i < buslist.buslist.length; i++) {
            if (buslist.buslist[i].number == bus.number || buslist.buslist[i].change == bus.number || buslist.buslist[i].number == bus.change || buslist.buslist[i].change == bus.change) {
                buslist.buslist[i].status = bus.newStatus;
                buslist.buslist[i].timestamp = time;
            }
        };

    let final = JSON.stringify(buslist);

    fs.writeFile("buslist.json", final, (err) => {});

  });


  let newChange = {
    bus: bus.number,
    description: bus.newStatus,
    timestamp: getTime(),
  };

  let changeList = { logs: [] };

  fs.readFile("logs.json", "utf-8", (err, jsonString) => {
    let buslist = JSON.parse(jsonString);

    for (i = 0; i < buslist.logs.length; i++) {
      changeList.logs.push(buslist.logs[i]);
    }

    changeList.logs.push(newChange);

    changeList.logs = changeList.logs.sort((a, b) => {
      if (a.number < b.number) {
        return -1;
      }
    });

    let final = JSON.stringify(changeList);

    fs.writeFile("logs.json", final, (err) => {});

    res.redirect("buslist");
  });



});

app.post("/updateStatusTime", (req, res) => {
  let bus = req.body;
  change = bus.newStatus;

  fs.readFile("buslist.json", "utf-8", (err, jsonString) => {
    let buslist = JSON.parse(jsonString);

        for (i = 0; i < buslist.buslist.length; i++) {
            if (buslist.buslist[i].number == bus.number || buslist.buslist[i].change == bus.number || buslist.buslist[i].number == bus.change || buslist.buslist[i].change == bus.change) {
                buslist.buslist[i].status = bus.newStatus;
                buslist.buslist[i].timestamp = "";
            }
        };

    let final = JSON.stringify(buslist);

    fs.writeFile("buslist.json", final, (err) => {});

    res.redirect("buslist");
  });
});

app.post("/updateChange", (req, res) => {
  let bus = req.body;
  change = bus.newChange;

  fs.readFile("buslist.json", "utf-8", (err, jsonString) => {
    let buslist = JSON.parse(jsonString);

        for (i = 0; i < buslist.buslist.length; i++) {
            if (buslist.buslist[i].number == bus.number) {
                if (bus.change == 0) buslist.buslist[i].change = null;
                else buslist.buslist[i].change = bus.change;
            }
        };

    let final = JSON.stringify(buslist);

    fs.writeFile("buslist.json", final, (err) => {});
  });

  let newChange = {
    bus: bus.number,
    description: bus.change,
    timestamp: getTime(),
  };

  let changeList = { logs: [] };

  fs.readFile("logs.json", "utf-8", (err, jsonString) => {
    let buslist = JSON.parse(jsonString);

    for (i = 0; i < buslist.logs.length; i++) {
      changeList.logs.push(buslist.logs[i]);
    }

    changeList.logs.push(newChange);

    changeList.logs = changeList.logs.sort((a, b) => {
      if (a.number < b.number) {
        return -1;
      }
    });

    let final = JSON.stringify(changeList);

    fs.writeFile("logs.json", final, (err) => {});

    res.redirect("buslist");
  });


});

app.get("/getlogs", (req, res) => {
  let status_change = {
    bus: busNum,
    description: action_done,
    timestamp: time,
  };
  bus = Number(req.body.busnum);

  let logsList = { logs: [] };

  fs.readFile("logs.JSON", "utf-8", (err, jsonString) => {
    ``;

    let changeList = JSON.parse(jsonString);

    for (i = 0; i < changeList.changeList.length; i++) {
      logsList.changeList.push(changeList.changeList[i]);
    }

    logsList.changeList.push(status_change);

    logsList.changeList = changeList.changeList.sort((a, b) => {
      if (a.number < b.number) {
        return -1;
      }
    });

    let final = JSON.stringify(logsList);

    fs.writeFile("logs.JSON", final, (err) => {});

    res.redirect("logs");
  });
  let datajson = fs.readFileSync("logs.JSON");
  let data = JSON.parse(datajson);
  res.send(data);
});

//google sign in -----------------------------------------------------

app.post('/auth', (req, res) => {
  const token = req.body.credential;
  const CLIENT_ID = "297838973559-tfgf8emf1mo242nlmvft5ih5np1pp7hv.apps.googleusercontent.com";
  const {OAuth2Client} = require('google-auth-library');
  const client = new OAuth2Client(CLIENT_ID);
  async function verify() {
    var shasum = crypto.createHash('sha1')
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
    let whitelist = JSON.parse(fs.readFileSync("whitelist.json", "utf-8")).users;
    for (i = 0; i < whitelist.length; i++) {
      if (whitelist[i].toLowerCase == payload.email.toLowerCase){
        res.cookie('c_email', payload.email, {maxAge: 3600000, httpOnly: true});
        shasum.update(payload.email);
        res.cookie('c_token', shasum.digest('hex'), { maxAge: 3600000, httpOnly: true })
        res.redirect('/buslist')
      }
    }
    res.send('<h1>Unauthorized</h1><br><a href="/">Return to Home</a>')

    
  }
  verify().catch(console.error);
});