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
  console.log(
    now.slice(now.indexOf(",") + 2, now.indexOf(":") + 3) +
      " " +
      now.slice(now.indexOf("M") - 1)
  );
  time = now.slice(now.indexOf(",") + 2, now.indexOf(":") + 3) + " " +  now.slice(now.indexOf("M") - 1);

  return (
    now.slice(now.indexOf(",") + 2, now.indexOf(":") + 3) +
    " " +
    now.slice(now.indexOf("M") - 1)
  );

  // following code does not execute

  let pm = false;
  if (hour > 12) {
    //switching from military to regular time
    hour -= 12;
    pm = true;
  }
  if (minute < 10) {
    //formatting correctly
    if (pm) time = hour + ":0" + minute + " PM";
    else time = hour + ":0" + minute + " AM";
  } else {
    if (pm) time = hour + ":" + minute + " PM";
    else time = hour + ":" + minute + " PM";
  }
  console.log(time);
  return time;
}
getTime();

var action_done = "";

app.get("/buslist", function (req, res) {
  const f = require("fs");
  const readline = require("readline");
  var user_file = "buslist.txt";
  var r = readline.createInterface({
    input: f.createReadStream(user_file),
  });
  r.on("line", function (text) {
    res.send;
  });
  res.render("pages/buslist");
});

app.get("/buschanges", function (req, res) {
  res.render("pages/buschanges");
});

app.get("/logs", function (req, res) {
  res.render("pages/logs");
});

app.get("/settings", function (req, res) {
  res.render("pages/settings");
});
app.post("/addbus", (req, res) => {
  action_done = "Bus Added";
  let busNum = Number(req.body.busnum);

  let newBusObj = {
    number: busNum,
    status: "Not Arrived",
    change: null,
    timestamp: time,
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
    timestamp: time,
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
  action_done = "Bus Deleted";

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
    timestamp: time,
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
app.get("/logout", (req, res) => {
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

    let newChange = {
      bus: bus.number,
      description: bus.newStatus,
      timestamp: time,
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

    res.redirect("buslist");
  });
});

//google sign in -----------------------------------------------------