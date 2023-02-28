function viewBusEdit() {
    let viewTab = document.getElementById('viewBusses');
    let editTab = document.getElementById('editBusses');
    viewTab.style.display = "none";
    editTab.style.display = "flex";
}

function viewBusChanges() {
    let viewTab = document.getElementById('viewBusses');
    let editTab = document.getElementById('editBusses');
    viewTab.style.display = "flex";
    editTab.style.display = "none";
}

function getBusses() {
    let o = document.getElementsByClassName('busObj');
    for (let i = 0; i < o.length; i++) {
        o[i].style.display = 'none';
    }

    fetch('/getbus')
    .then(response => { 
        if(response.ok) {
            return response.json(); // not important
        }
        }).then(data => {
        if(data) { // if there is data
            let i = 0;
            while(i < data.buslist.length) {
                let div = document.createElement("div");
                div.classList.add('busObj')
                div.classList.add('flex-fill');

                div.style.backgroundColor = "rgb(255, 44, 44)";
                

                div.style.borderRadius = "30px";
                div.style.margin = "10px";

                var h = window.innerHeight;
                div.style.height = (h-180)/10+"px";

                let busNumber = data.buslist[i].number;
                div.textContent = busNumber;
                div.style.textAlign = 'center';
                div.style.fontFamily = 'Gill Sans';

                div.onclick = editChange;

                document.getElementById('editBusses').appendChild(div);  
                i++;

                function editChange() {
                    
                }
            }
        }
    }).catch(err => console.error(err));
}
getBusses();

function updateBusses() {
    let o = document.getElementsByClassName('busObj');
    fetch('/getbus')
    .then(response => { 
        if(response.ok) {
            return response.json(); // not important
        }
        }).then(data => {
        if(data) { // if there is data
            let i = 0;
            while(i < data.buslist.length) {
                let div = o[i];
                getColor();
                i++;

                function getColor() {
                    if (data.buslist[i].status == "Not Arrived") div.style.backgroundColor = "rgb(255, 44, 44)";
                    else if (data.buslist[i].status == "Arrived") div.style.backgroundColor = 'green';
                    else div.style.backgroundColor = 'grey';
                }
            }
        }
    }).catch(err => console.error(err));
}

function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // Resize the Redbar
    var newW = w/5.88;
    document.getElementById('redbar').style.width = newW+"px";
    // resize the tab bar
    document.getElementById('tabs').style.width = w-newW+"px";


    // Resize the buttons
    var buttonMargin = (newW-(newW*0.882352941176471))/2;
    var newBtnW = newW*0.882352941176471;
    let buttons = document.querySelectorAll('.flex-fill');
    let btnIcons = document.querySelectorAll("#menu-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.margin = buttonMargin+"px";

        buttons[i].style.width = newBtnW+"px";
        buttons[i].style.height = (h-(10*buttonMargin))/5+"px";
        btnIcons[i].style.margin = ((h-(10*buttonMargin))/5)*.05+"px";

        if (newBtnW > (h-(10*buttonMargin))/5) { // width is larger than height
            btnIcons[i].style.width = ((h-(10*buttonMargin))/5)*.9+"px";
            btnIcons[i].style.height = ((h-(10*buttonMargin))/5)*.9+"px";
        } else if (newBtnW < (h-(10*buttonMargin))/5) { // height is larger than width
            btnIcons[i].style.width = newBtnW*.9+"px";
            btnIcons[i].style.height = newBtnW*.9+"px";
        }
    }

    document.getElementById('main-container').style.display = "flex";
}
resize();
window.addEventListener("resize", resize);