var planetArray = [];
var gravity = 9.8/30.0;

var sun = {
    x: 300,
    y: 300
};

function setup() {
    createCanvas(600, 600);
    for(var i = 0;i<50;i++){
        var newPlanet = new Planet(random(0, width), random(0, height), random(10, 100));
        planetArray.push(newPlanet);
    }
}

function draw() {
    background(0);

    push();
    noFill();
    stroke('yellow');
    translate(sun.x, sun.y);
    rotate(frameCount / 30.0);
    star(0, 0, 0, 50, 150);
    pop();
    if (mouseIsPressed) {
        sun.x = mouseX;
        sun.y = mouseY;
    }

    for(var i = 0;i<planetArray.length;i++){
        planetArray[i].update();
        planetArray[i].draw();
    }
}

class Planet {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.ySpeed = 0;
        this.xSpeed = 0;
        this.width = width;
        this.red = 0;
        this.green = 0;
        this.blue = 150;
    }

    update(){
        var directionX = (sun.x-this.x)/2;
        var directionY = (sun.y-this.y)/2;
        var speed = map(this.width, 10, 100, 0.00005, 0.000005);

        for (var i = 0; i<planetArray.length; i++) {
            directionX += planetArray[i].x - this.x;
            directionY += planetArray[i].y - this.y;
        }
        this.xSpeed += directionX * speed;
        this.ySpeed += directionY * speed;

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.xSpeed >= 0) {
            this.red = map(this.xSpeed, 0, 5, 0, 255);
        } else {
            this.red = map(this.xSpeed, 0, -5, 0, 255);
        }
        if (this.ySpeed >= 0) {
            this.green = map(this.ySpeed, 0, 5, 0, 255);
        } else {
            this.green = map(this.ySpeed, 0, -5, 0, 255);
        }
    }

    draw(){
        fill(this.red, this.green, this.blue);
        ellipse(this.x, this.y, this.width, this.width)
    }
}

function star(x, y, radius1, radius2, npoints) {
    var angle = TWO_PI / npoints;
    var halfAngle = angle / 2.0;
    beginShape();
    for (var a = 0; a < TWO_PI; a += angle) {
        var sx = x + cos(a) * radius2;
        var sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}