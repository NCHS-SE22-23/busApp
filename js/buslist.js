function newBtn() {
    let div = document.createElement("div");
    div.classList.add('flex-fill');
    div.style.backgroundColor = "red";
    div.style.borderRadius = "30px";
    div.style.margin = "10px";
    div.style.flexWrap = "wrap";
    div.style.flex = "1 1 200px";


    document.getElementById('allBusses').appendChild(div);  
}

function displayBusses() {
    
}

function viewBusList() {
    let searchTab = document.getElementById('searchBusses');
    searchTab.style.display = "none";
}

function searchBusList() {

}

function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // Resize the Redbar
    var newW = w/5.88;
    document.getElementById('redbar').style.width = newW+"px";
    // resize the tab bar
    document.getElementById('tabs').style.width = w-newW+"px";
    // resize bus container
    document.getElementById('allBusses').style.width = w-newW+"px";
    document.getElementById('allBusses').style.height = h-50+"px";
    document.getElementById('allBusses').style.left = newW+"px";


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
}
resize();
window.addEventListener("resize", resize);