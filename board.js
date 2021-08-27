var board = document.getElementById("board")
var position = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]]

var animating = false


function setColor(color) {
    var x = document.querySelectorAll(".light");

    for (let i = 0; i < x.length; i++) {
        x[i].style['background-color'] = "lightGray";
    } 
    
    if (color == "brown") {
        var x = document.querySelectorAll(".dark");

        for (let i = 0; i < x.length; i++) {
	        x[i].style['background-color'] = "#bf8550";
        }

        var x = document.querySelectorAll(".light");

        for (let i = 0; i < x.length; i++) {
	        x[i].style['background-color'] = "#ffdaba";
        } 
    } else {
        var x = document.querySelectorAll(".dark");

        for (let i = 0; i < x.length; i++) {
	        x[i].style['background-color'] = color;
        }
    }
}
setColor("brown")

piece_url = "https://sanyok.pythonanywhere.com/static/chess/figures/Chess_"; //t45.svg
piece_names = {"R":"rl", "N":"nl", "B":"bl", "Q":"ql", "K":"kl", "P":"pl" ,"r":"rd", "n":"nd", "b":"bd", "q":"qd", "k":"kd", "p":"pd"}

au = new Audio("https://sanyok.pythonanywhere.com/static/chess/figures/placed.mp3")

const rows = {"a":0,"b":1,"c":2,"d":3,"e":4,"f":5,"g":6,"h":7}
const cols  = {1:7,2:6,3:5,4:4,5:3,6:2,7:1,8:0}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

var figure_count = 0

function findPlace(elmnt) {
    
    var record = Math.abs(board.children[0].offsetTop - elmnt.offsetTop)
    var x = 0
    var y = 0
    
    for (i = 0; i < board.children.length; i++) {
        if (Math.abs(board.children[i].offsetTop - elmnt.offsetTop) < record) {
           record = Math.abs(board.children[i].offsetTop - elmnt.offsetTop)
           y = i
        }
    }
    
    record = Math.abs(board.children[0].children[0].offsetLeft - elmnt.offsetLeft)
    
    for (i = 0; i < board.children[0].children.length; i++) {
           if (Math.abs(board.children[0].children[i].offsetLeft - elmnt.offsetLeft) < record) {
              record = Math.abs(board.children[0].children[i].offsetLeft - elmnt.offsetLeft)
              x = i
        }
    }
    
    return [x,y]
    
}

function moveValidationFunc(x1, y1, x2, y2) {
    // default is to return true for everything
    // the programmer changes it to return false
    // for illegal moves.
    return true;
}


function dragElement(e, elmnt, defaultLegal=false) {

	if (e.buttons == 2) {beginMarkup(e); return};

    e = e || window.event;
    e.preventDefault();
    
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    var justPlaced = false
    var [old_x, old_y] = findPlace(elmnt)
    var old_cords = [elmnt.offsetLeft, elmnt.offsetTop]
    
    if (Math.abs((board.offsetTop + board.offsetHeight) - elmnt.offsetTop) < Math.abs(board.children[7].offsetTop - elmnt.offsetTop) || Math.abs((board.offsetLeft + board.offsetWidth) - elmnt.offsetLeft) < Math.abs(board.children[0].children[7].offsetLeft - elmnt.offsetLeft)) {            
        justPlaced = true
    }
    
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;        
    
    
  function elementDrag(e) {
    
    if (e.buttons !== 1) return;
    
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
   
    var [x, y] = findPlace(elmnt)

    if (!moveValidationFunc(getKeyByValue(rows, old_x), getKeyByValue(cols, old_y), getKeyByValue(rows, x), getKeyByValue(cols, y)) && !defaultLegal) {
        [elmnt.style.left, elmnt.style.top] = old_cords 
        document.onmouseup = null
        document.onmousemove = null
        return
    }

    if (Math.abs((board.offsetTop + board.offsetHeight) - elmnt.offsetTop) < Math.abs(board.children[7].offsetTop - elmnt.offsetTop) || Math.abs((board.offsetLeft + board.offsetWidth) - elmnt.offsetLeft) < Math.abs(board.children[0].children[7].offsetLeft - elmnt.offsetLeft)) {
        elmnt.remove()
        document.onmouseup = null;
        document.onmousemove = null;
        return 
    }

    au.play()

    elmnt.style.top = board.children[y].children[0].offsetTop
    elmnt.style.left = board.children[0].children[x].offsetLeft+1
    
    if (position[y][x] != 0 && position[y][x] != elmnt.id) {
        console.log(x, y, position[x][y], position)
        document.getElementById(position[y][x]).remove()
    } 

    if (justPlaced == false) {
      position[old_y][old_x]=0;
    }
    position[y][x] = elmnt.id

    document.onmouseup = null;
    document.onmousemove = null;

}
}

function pull_out(e, elmnt, f) {
   var html = '<div class="piece '+f+'" id="piece'+figure_count  +'" draggable="false" onmousedown="dragElement(event, this)" style="background-image: url(' + "'" + piece_url + piece_names[f] + "t45.svg'" + ')" oncontextmenu="return false;" ></div>'
   document.getElementById("figures").innerHTML += html
    
    const p = document.getElementById("piece"+figure_count)
    
    p.style.top = elmnt.offsetTop
    p.style.left = elmnt.offsetLeft

    dragElement(e, p, true)

     figure_count += 1;
}

function place_figure(f, r, c) {
    var html = '<div class="piece '+f+'" id="' + 'piece'+figure_count  +'" draggable="false" onmousedown="dragElement(event, this)" style="background-image: url(' + "'" + piece_url + piece_names[f] + "t45.svg'" + ')" oncontextmenu="return false;" ></div>'
   document.getElementById("figures").innerHTML += html
    
    const p = document.getElementById("piece"+figure_count)
    
    p.style.top = board.children[c].children[0].offsetTop
    p.style.left = board.children[0].children[r].offsetLeft+1

    position[c][r] = p.id

     figure_count += 1;
}

function initialSetup() {
    clearBoard()
    
    readFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") 
}


function animateMove(f, r, c, fen=null) {
    var endPosTop = board.children[cols[c]].children[rows[r]].offsetTop 
    var endPosLeft = board.children[cols[c]].children[rows[r]].offsetLeft
    
    var posX = f.offsetLeft
    var posY = f.offsetTop
    
	
	const speedX = (endPosLeft-posX)/5
	const speedY = (endPosTop-posY)/5

    var id = setInterval(function() {window.requestAnimationFrame(frame)}, 10);
    
    if (animating != false) {
        clearInterval(animating[3])
        animating[0].style.top = animating[1]+"px"
        animating[0].style.left = animating[2]+"px"
        animating = false
    }

    animating = [f, endPosTop, endPosLeft, id]
    function frame() {
        if (f.offsetTop == endPosTop && f.offsetLeft == endPosLeft) {
            animating = false
            clearInterval(id);
            if (fen !== null) {
			    readFEN(fen)
            }
        } else {
			posY += speedY
			posX += speedX
			f.style.top = posY+"px";
			f.style.left = posX+"px";
		}
	}
}


function clearBoard() {
    figure_count=0
    position = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]]
    document.getElementById("figures").innerHTML = "";
}


function readFEN(v) {
    clearBoard()

	var r = 0
	var c = 0
    var fen = ""
    v+=" "

    var x = 0
    while (v[x] != " ") {
        fen+=v[x]
        x++
    }
	
	for (m in fen) {
		if (fen[m] == "/") {
			c++
			r=0
		} else if (!isNaN(fen[m])) {
			r += Number(fen[m])
		} else {
			place_figure(fen[m], r, c)
			r++
		}
	}
}


var placedCircles = []
var placedArrows = []
var circleSize = 0
var shapesNum = 0

function setSvgSize() {
	var svg = document.getElementById("arrowsDiv")
	svg.style.top = board.offsetTop
	svg.style.left = board.offsetLeft
	svg.style.height = board.offsetHeight + "px"
	svg.style.width = board.offsetWidth + "px"
	circleSize = board.children[0].children[0].offsetWidth/2
	clearSvg()
}
window.addEventListener('resize', setSvgSize);
setSvgSize()


function findPointer(Xpos, Ypos) {
    var record = Ypos - board.children[0].offsetTop
    var x = 0
    var y = 0
    
    for (i = 0; i < board.children.length; i++) {
        if (Ypos - board.children[i].offsetTop <= record && Ypos - board.children[i].offsetTop > 0) {
           record = Ypos - board.children[i].offsetTop
           y = i
        }
    }
    record = Xpos - board.children[0].children[0].offsetLeft

    for (i = 0; i < board.children[0].children.length; i++) {
           if (Xpos - board.children[0].children[i].offsetLeft <= record && Xpos - board.children[0].children[i].offsetLeft > 0) {
              record = Xpos - board.children[0].children[i].offsetLeft
              x = i
		}
    }

    return [x, y]
}

function drawCircle(cords) {
	var x = (12.5*cords[0]+6.25)
	var y = (12.5*cords[1]+6.25)
	for (z = 0; z < placedCircles.length; z++) {
		v = placedCircles[z]
		if (v[0]==x && v[1]==y) {
			document.getElementById(v[2]).remove()
			placedCircles.splice(z, 1)
			return
		}
	}

	const circle = '<circle cx="'+x+'%" cy="'+y+'%" r="'+(circleSize-5)+'px" stroke="blue" stroke-width="10" fill="none" opacity="0.6" id="circle'+(shapesNum++)+'" />'
    document.getElementById("arrows").insertAdjacentHTML( 'beforeend', circle )
	placedCircles.push([x,y,'circle'+(shapesNum-1)])
}

function drawArrow(cords, color="blue") {
	var x1 = (12.5*cords[0]+6.25)
	var x2 = (12.5*cords[1]+6.25)
	var y1 = (12.5*cords[2]+6.25)
	var y2 = (12.5*cords[3]+6.25)
	
	x2 += Math.sign(x1-x2)*3.125
	y2 += Math.sign(y1-y2)*3.125

	for (z = 0; z < placedArrows.length; z++) {
		v = placedArrows[z]
		if (v[0]==x1 && v[1]==y1 && v[2]==x2 && v[3]==y2) {
			document.getElementById(v[4]).remove()
			placedArrows.splice(z, 1)
			return
		}
	}

	const arrow = "<line stroke='"+color+"'' stroke-width=\"9\" stroke-linecap=\"round\" marker-end=\"url(#arrow-head-"+color+")\" opacity=\"0.6\" x1='"+x1+"%' y1='"+y1+"%' x2='"+x2+"%' y2='"+y2+"%' id='arrow"+(shapesNum++)+"'></line>"
    document.getElementById("arrows").insertAdjacentHTML("beforeend", arrow)
	placedArrows.push([x1,y1,x2,y2,"arrow"+(shapesNum-1)])
}

function clearSvg() {
	placedArrows = []
	placedCircles = []
	document.getElementById("arrows").innerHTML = ""
}

function beginMarkup(e) {
	const mousePos = findPointer(e.pageX, e.pageY)
	
    document.onmousemove = continueMarkup	
	document.onmouseup = finishMarkup

	continueMarkup(e)
	function continueMarkup(newE) {
		document.getElementById("incompleteArrows").innerHTML = ""
		const newMousePos = findPointer(newE.pageX, newE.pageY)
		if (newMousePos[0] == mousePos[0] && newMousePos[1] == mousePos[1]) {
			const circle = '<circle cx="'+(12.5*mousePos[0]+6.25)+'%" cy="'+(12.5*mousePos[1]+6.25)+'%" r="'+(circleSize-5)+'px" stroke="blue" stroke-width="10" fill="none" opacity="0.3" />'
    		document.getElementById("incompleteArrows").insertAdjacentHTML( 'beforeend', circle )
		} else {
			const arrow = "<line stroke=\"blue\" stroke-width=\"9\" stroke-linecap=\"round\" marker-end=\"url(#arrow-head-blue)\" opacity=\"0.3\" x1='"+(12.5*mousePos[0]+6.25)+"%' y1='"+(12.5*mousePos[1]+6.25)+"%' x2='"+(12.5*newMousePos[0]+6.25)+"%' y2='"+(12.5*newMousePos[1]+6.25)+"%'></line>"
    		document.getElementById("incompleteArrows").insertAdjacentHTML("beforeend", arrow)
		}

	}
	function finishMarkup(finalE) {
		
		const finalMousePos = findPointer(finalE.pageX, finalE.pageY)
		if (finalMousePos[0] == mousePos[0] && finalMousePos[1] == mousePos[1]) {
			drawCircle(finalMousePos)
		} else {
			drawArrow([mousePos[0], finalMousePos[0], mousePos[1], finalMousePos[1]])
		}

		document.getElementById("incompleteArrows").innerHTML = ""
		document.onmousemove = null;
		document.onmouseup = null;
	}
}


board.onmousedown = (e) => {if (e.buttons != 2) {clearSvg(); placedCircles=[]; return}; beginMarkup(e)}

function createFEN() {
	var createdFEN = ""
	for (i=0;i<=7;i++) {
		for (v=0;v<=7;v++) {
			if (position[i][v] != 0) {
				createdFEN += document.getElementById(position[i][v]).classList[1]
			} else {
				createdFEN += "1"
			}
		}
		createdFEN += "/"
	}
	return createdFEN
}

function flipBoard() {
    v = createFEN()
    clearBoard()

	var r = 7
	var c = 7
    var fen = ""
    v+=" "

    var x = 0
    while (v[x] != " ") {
        fen+=v[x]
        x++
    }
	
	for (m in fen) {
		if (fen[m] == "/") {
			c--
			r=7
		} else if (!isNaN(fen[m])) {
	        r -= Number(fen[m])
		} else {
			place_figure(fen[m], r, c)
			r--
		}
	}
}

function moveToFEN(move, pos) {
	m0 = rows[move[0]]
	m2 = rows[move[2]]
	m1 = cols[move[1]]
	m3 = cols[move[3]]

	pos[m3][m2] = pos[m1][m0]
	console.log(m1)
	pos[m1][m0] = 0
	
	
}

