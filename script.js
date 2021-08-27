initialSetup()

const chess = new Chess()

var moves = []
var lines_locations = []
var move_num = 0



function readPGN(pgn) {

    moves = []
    lines_locations = []
    move_num = 0

    chess.reset()

    moves = [[]]
    layer = 0
    up_vals = []

    split_pgn = pgn.split(" ")

    new_html = ""

    for (var m = 0; m < split_pgn.length; m++) {

        move = split_pgn[m]

        if (move.indexOf("(") != -1) {
            lines_locations.push([layer, moves[layer].length-1])
            up_vals.push(moves.length-layer)
            layer = moves.length
            moves.push([])
        } else if (move.indexOf(")") != -1) {
            close_amount = (move.split(")").length - 1)
            move = move.substring(0, move.length - close_amount );
            moves[layer].push(move)
            layer -= up_vals.pop() + close_amount-1
        } else if (move.indexOf(".") == -1) {
           moves[layer].push(move) 
        }

    }

}

window.addEventListener("hashchange", function() {
    console.info("hashchange event")
    displayHash()
});

window.addEventListener("DOMContentLoaded", function() {
    console.info("DOMContentLoaded event")
    displayHash();
});
  

function displayHash() {
    var hash = window.location.hash;
    if (hash.length == 0) { hash = "_index"; }
    if (hash == "_index") {
        openPasteModal()
    } else {
        console.log("Current Hash: " + hash)
        readPGN(decodeURI(hash))
    }
    return true;
}
  

readPGN("1. b3 e5 (1... d5 2. Bb2 Nf6 3. e3 Nc6 4. Bb5 e6 5. f4 Bd7 6. Nf3) (1... Nf6 2. Bb2 g6 3. Bxf6 exf6 4. c4 d6 5. Nc3 Nc6 6. Rc1 Bg7 7. g3 f5 8. Bg2) (1... Nc6 2. Bb2 e5) 2. Bb2 Nc6 (2... e4 3. e3 Nc6 4. f3 exf3 5. Nxf3) 3. e3 d5 4. Bb5 Bd7 (4... Bd6 5. f4 f6 (5... exf4 6. Bxg7 Qh4+ 7. Kf1 (7. g3 fxg3 8. hxg3 Qxh1)) 6. fxe5 fxe5 7. Nf3) 5. Bxc6 Bxc6 6. Bxe5 Nf6 7. Bb2")

function startPractice() {
    initialSetup()
    chess.reset()

    line = 0
    previous_line = 0

    document.getElementById("startPracticeBtn").style.display = "none"
    document.getElementById("colorChoiceArea").style.display = "none"

    practiceText = document.getElementById("practiceText")

    practiceText.style.display = "block"
    practiceText.innerHTML = "Play the first move..."

    function onMove(old_x, old_y, x, y) {
        chess.move(moves[line][move_num])
        correct_fens = [chess.fen()]
        chess.undo()


        lines = [previous_line]

        for (i in lines_locations) {
            if (lines_locations[i][0] == line && lines_locations[i][1] == move_num) {
                if (chess.move(moves[Number(i)+1][0])) {
                    correct_fens.push(chess.fen())
                    lines.push(Number(i)+1)
                    chess.undo()
                }
            }
        }

        move = [old_x, old_y, x, y]

        if (chess.move({"from":move[0]+move[1], "to": move[2]+move[3]})) {
            if (correct_fens.includes(chess.fen())) {
                console.log("correct")

                move_num++
                line = lines[correct_fens.indexOf(chess.fen())]

                if (previous_line != line) {
                    move_num = 1
                    previous_line = line
                }

                if (move_num >= moves[line].length) {
                    practiceText.innerHTML = "Done!"
                    practiceText.style.color = "white"
                    return true
                }

                practiceText.innerHTML = "Correct!"
                practiceText.style.color = "#30e520"
                practiceText.style["animation-name"] = "flip"

                setTimeout(function(){

                    next_moves = [line]

                    for (i in lines_locations) {
                        if (lines_locations[i][0] == line && lines_locations[i][1] == move_num) {
                            next_moves.push(Number(i)+1)
                        }
                    }

                    if (!document.getElementById("selectRandomCheckbox").checked && next_moves.length > 1) {
                        practiceText.innerHTML = "Select a continuation..."
                        practiceText.style.color = "white"
                        m = [moves[next_moves[0]][move_num]]
                        for (var x = 1; x < next_moves.length; x++) {
                            m.push(moves[next_moves[x]][0])
                        }
                        placeChoiceBtns(m)
                        options = Array.from(document.querySelectorAll(".moveOptionBtn"))
                        for (var y = 0; y < options.length; y++) {
                            options[y].addEventListener("click", function() {
                                y = options.indexOf(this)
                                line = next_moves[y]

                                if (previous_line != line) {
                                    move_num = 0
                                    previous_line = line
                                }

                                hideChoiceBtns()
                                startAnimation(moves[line][move_num]);move_num++
                            })
                        }
                    } else {
                        line = next_moves[Math.floor(Math.random() * next_moves.length)]

                        if (previous_line != line) {
                            console.log("line change")
                            move_num = 0
                            previous_line = line
                        }

                        console.log(line, move_num, moves[line][move_num])
                        startAnimation(moves[line][move_num]);move_num++
                    }

                },500);

                return true
            } else {
                practiceText.innerHTML = "Incorrect, Try again!"
                practiceText.style.color = "#f71d1d"
                practiceText.style["animation-name"] = ""
            }

            chess.undo()
        }
        moved = false
        return false
    }

    if (selectedColor == "B") {
        startAnimation(moves[line][0])
        move_num++
    }
    
    moveValidationFunc = onMove

}

function startAnimation(move) {
    chess.move(move)
    f = chess.fen()
    m = chess.undo()

    piece = position[cols[m.from[1]]][rows[m.from[0]]]
    animateMove(document.getElementById(piece), m.to[0], m.to[1], f)

    chess.move(move)

    if (move_num >= moves[line].length -1) {
        practiceText.innerHTML = "Done!"
        practiceText.style.color = "white"
    }

}
