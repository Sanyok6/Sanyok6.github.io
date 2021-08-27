selectedColor = "W"

document.addEventListener('DOMContentLoaded', (event) => {
    document.body.style["background-color"] = localStorage.getItem("backgroundColor")
    color = localStorage.getItem("boardColor")
    if (color == null) {
        color = "brown"
    }
    setColor(color)
});


function changeColor(color) {
    selectedColor = color
    document.getElementById("colorChoiceW").classList.remove("colorChoiceSelected")
    document.getElementById("colorChoiceB").classList.remove("colorChoiceSelected")

    document.getElementById("colorChoice"+color).classList.add("colorChoiceSelected")
}


function selectTab(n) {
    items = document.getElementsByClassName("area")
    for (var c=0;c<=2;c++) {
        items[c].style.display = "none"
    }
    items[n].style.display = "block"
}


function placeChoiceBtns(labels) {
    html = ""
    for (x in labels) {
        html+= "<button class='moveOptionBtn' >" + labels[x] + "</button><br>"
    }
    document.getElementById("moveOptions").innerHTML = html
    document.getElementById("moveOptions").style.display = "block"
}

function hideChoiceBtns() {
    document.getElementById("moveOptions").style.display = "none"
}

document.getElementById('uploadPgnBtn').onchange = function() {
    var fileToLoad = document.getElementById("uploadPgnBtn").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById("pasteArea").value = textFromFileLoaded;
    };
  
    fileReader.readAsText(fileToLoad, "UTF-8");
}


var modal = document.getElementById("pasteModal");

document.getElementById("setupPgnBtn").onclick = function() {
    window.location.hash = document.getElementById('pasteArea').value
    modal.style.display = "none"
}

document.getElementById("pasteBtn").onclick = openPasteModal

function openPasteModal() {
    modal = document.getElementById("pasteModal");
    modal.style.display = "block";
}

document.getElementById("openSettings").onclick = function() {
    modal = document.getElementById("settingsModal");
    modal.style.display = "block";
}

document.getElementById("cosCol").onchange = function() {
    color = document.getElementById("cosCol").value
    setColor(color)
    localStorage.setItem("boardColor", color)
}

document.getElementById("bgColorInput").onchange = function() {
    color = document.getElementById("bgColorInput").value
    document.body.style['background-color'] = color
    localStorage.setItem("backgroundColor", color)
}

document.getElementById("resetSettingsBtn").onclick = function() {
    setColor("brown")
    document.body.style['background-color'] = 'black';
    localStorage.setItem("boardColor", "brown")
    localStorage.setItem("backgroundColor", "black")
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


document.getElementById("copyLink").onclick = function() { 
    var dummy = document.createElement('input'),
    text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

}