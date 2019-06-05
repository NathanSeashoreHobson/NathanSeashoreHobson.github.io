function make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

var grid;
var cols;
var rows;
var w = 20;
var lose = false;
var numSize;
var gameMode = "medium";

var totalBees = 30;
var flagsLeft = totalBees;

function setup() {
    createCanvas(401, 401);
    cols = floor(width / w);
    rows = floor(height / w);
    grid = make2DArray(cols, rows);
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j, w);
        }
    }

    // Pick totalBees spots
    var options = [];
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            options.push([i, j]);
        }
    }


    for (var n = 0; n < totalBees; n++) {
        var index = floor(random(options.length));
        var choice = options[index];
        var i = choice[0];
        var j = choice[1];
        options.splice(index, 1);
        grid[i][j].bee = true;
    }


    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].countBees();
        }
    }
    medium();
}

function easy() {
    totalBees = 15;
    totalFlags = totalBees;
    w = 30;
    numSize = 20;
    gamemode = "easy";
    playAgain();
}

function medium() {
    totalBees = 35;
    totalFlags = totalBees;
    w = 20;
    numSize = 14;
    gameMode = "medium";
    playAgain();
}

function hard() {
    totalBees = 75;
    totalFlags = totalBees;
    w = 15;
    numSize = 10;
    gameMode = "hard";
    playAgain();
}

function playAgain() {
    lose = false;
    cols = floor(width / w);
    rows = floor(height / w);
    grid = make2DArray(cols, rows);
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j, w);
        }
    }

    // Pick totalBees spots
    var options = [];
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            options.push([i, j]);
        }
    }


    for (var n = 0; n < totalBees; n++) {
        var index = floor(random(options.length));
        var choice = options[index];
        var i = choice[0];
        var j = choice[1];
        options.splice(index, 1);
        grid[i][j].bee = true;
    }


    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].countBees();
        }
    }

}

function gameOver() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].revealed = true;
        }
    }
    lose = true;
}

function checkWin() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (!grid[i][j].revealed && !grid[i][j].bee) {
                return false;
            } else if (lose) {
                return false;
            }
        }
    }
    return true;
}

function button(txt) {
    fill("purple");
    rect(100, 100, 200, 50);
    fill(0);
    text(txt, 200, 135);
}

function mousePressed() {
    if (mouseButton === LEFT) {
        if (checkWin() || lose) {
            if (mouseX > 100 && mouseX < 300) {
                if (mouseY > 100 && mouseY < 150) {
                    playAgain()
                }
            }
        } else {
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    if (grid[i][j].contains(mouseX, mouseY) && !grid[i][j].flagged) {
                        grid[i][j].reveal();

                        if (grid[i][j].bee) {
                            gameOver();
                        }
                    }
                }
            }
        }
    } else if (mouseButton === CENTER) {
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                if (grid[i][j].contains(mouseX, mouseY) && !grid[i][j].revealed) {
                    grid[i][j].flag();
                }
            }
        }
    }
}

function draw() {
    background(255);
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }

    if (checkWin()) {
        push();
        textSize(32);
        fill(0);
        background(127);
        text('You Win!', 200, height/2);
        button('Play Again');
        pop();
    }
    if (lose) {
        push();
        textSize(32);
        fill(0);
        background(127);
        text('Game Over', 200, height/2);
        button('Play Again');
        pop();
    }
}

function Cell(i, j, w) {
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w;
    this.c = 0;
    this.neighborCount = 0;

    this.bee = false;
    this.revealed = false;
    this.flagged = false;
}

Cell.prototype.show = function() {
    stroke(0);
    noFill();
    rect(this.x, this.y, this.w, this.w);
    if (this.revealed) {
        if (this.bee) {
            fill(127);
            ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w * 0.5);
        } else {
            fill(200);
            rect(this.x, this.y, this.w, this.w);
            if (this.neighborCount > 0) {
                textSize(numSize);
                textAlign(CENTER);
                this.c = map(this.neighborCount, 1, 4, 0, 255);
                fill(255-this.c, this.c, 220);
                if (gameMode === "hard") {
                    text(this.neighborCount, this.x + this.w * 0.5, this.y + this.w - 4);
                } else {
                    text(this.neighborCount, this.x + this.w * 0.5, this.y + this.w - 6);
                }
            }
        }
    } else if (this.flagged) {
        fill(127);
        triangle(this.x+5, this.y+this.w-5, this.x+this.w-5, this.y+this.w-5, this.x+this.w/2, this.y+5);
    }
};

Cell.prototype.countBees = function() {
    if (this.bee) {
        this.neighborCount = -1;
        return;
    }
    var total = 0;
    for (var xoff = -1; xoff <= 1; xoff++) {
        var i = this.i + xoff;
        if (i < 0 || i >= cols) continue;

        for (var yoff = -1; yoff <= 1; yoff++) {
            var j = this.j + yoff;
            if (j < 0 || j >= rows) continue;

            var neighbor = grid[i][j];
            if (neighbor.bee) {
                total++;
            }
        }
    }
    this.neighborCount = total;
};

Cell.prototype.contains = function(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
};

Cell.prototype.reveal = function() {
    this.revealed = true;
    if (this.neighborCount === 0) {
        this.floodFill();
    }
};

Cell.prototype.floodFill = function() {
    for (var xoff = -1; xoff <= 1; xoff++) {
        var i = this.i + xoff;
        if (i < 0 || i >= cols) continue;

        for (var yoff = -1; yoff <= 1; yoff++) {
            var j = this.j + yoff;
            if (j < 0 || j >= rows) continue;

            var neighbor = grid[i][j];
            if (!neighbor.revealed && !neighbor.flagged) {
                neighbor.reveal();
            }
        }
    }
};

Cell.prototype.flag = function() {
    if (this.flagged) {
        this.flagged = false;
        totalFlags += 1;
    } else if (!this.flagged) {
        this.flagged = true;
        totalFlags -= 1;
    }
};