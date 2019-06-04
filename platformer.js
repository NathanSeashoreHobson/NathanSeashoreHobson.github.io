var mainCharacter;
var backgroundImage;
var mainCharacterImageR;
var mainCharacterImageL;
var monsterImageR;
var monsterImageL;
var gravity = 9.8/25.0;
var groundOffset = 100;
var monsterArray = [];
var health = 100;
var score = 0;
var paused = false;

function setup() {
    createCanvas(650, 400);
    mainCharacter = new Character(200, 265, 70);
    backgroundImage = loadImage("./background.png");
    mainCharacterImageR = loadImage("./yoshir.png");
    mainCharacterImageL = loadImage("./yoshil.png");
    monsterImageR = loadImage("./bowserr.png");
    monsterImageL = loadImage("./bowserl.png");

    for (var i = 0; i < 3; i++) {
        var newMonster = new Character(width + i * 250, 270, 65);
        newMonster.isMonster = true;
        monsterArray.push(newMonster);
        monsterArray[i].direction = 'left';
    }

}

function draw() {
    if (health <= 0) {
        background(0);
        fill("white");
        text("GAME OVER \nSCORE " + score + " \nCLICK RESET TO PLAY AGAIN", 200, 200, 300, 100);
        return
    }


    background(0, 200, 150);
    image(backgroundImage, 0, 0, width, height);

    if (keyIsDown(LEFT_ARROW)) {
        mainCharacter.xSpeed -= 1.0;
        mainCharacter.direction = 'left';
    }

    if (keyIsDown(RIGHT_ARROW)) {
        mainCharacter.xSpeed += 1.0;
        mainCharacter.direction = 'right';
    }

    mainCharacter.update();
    mainCharacter.draw();

    fill("red");
    stroke("black");
    rect(10, 10, health * 2, 20);

    fill("white");
    textSize(20);
    text(score, width - 40, 10, 40, 20);


    var anyMonsterAlive = false;

    for (var i = 0; i < monsterArray.length; i++) {
        if (!monsterArray[i].isDead) {
            anyMonsterAlive = true;
            monsterArray[i].update();
            monsterArray[i].moveBadGuy();
            monsterArray[i].draw();
        }
    }

    if (anyMonsterAlive === false) {
        for (var i = 0; i < 3; i++) {
            var newMonster = new Character(width + i * 250, 270, 65);
            newMonster.isMonster = true;
            monsterArray.push(newMonster);
        }
    }

    if (frameCount === 4) {
        pause();
    }
}

function play() {
    loop();
    paused = false;
}

function pause() {
    noLoop();
    paused = true;
}

function reset() {
    mainCharacter.xSpeed = 0;
    mainCharacter.ySpeed = 0;
    mainCharacter.direction = 'right';
    mainCharacter.x = 200;
    mainCharacter.y = 265;
    health = 100;
    score = 0;
    for (var i = 0; i < monsterArray.length; i++) {
        if (!monsterArray[i].isDead) {
            monsterArray[i].isDead = true;
        }
    }
    if (anyMonsterAlive === false) {
        for (var i = 0; i < 3; i++) {
            var newMonster = new Character(width + i * 250, 270, 65);
            newMonster.isMonster = true;
            monsterArray.push(newMonster);
        }
    }
}

function keyPressed() {
    if (key === " " && mainCharacter.y >= height - mainCharacter.width / 2 - groundOffset) {
        mainCharacter.ySpeed -= 10;
    } else if (key === "p" && paused) {
        play();
    } else if (key === "p" && !paused) {
        pause();
    } else if (key === "r") {
        reset();
    }
}

class Character {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.ySpeed = 0;
        this.xSpeed = 0;
        this.width = width;
        this.direction = 'right';
        this.isMonster = false;
        this.isDead = false;
        this.targetX = random()*width
    }

    update() {
        if (this.y + this.width * 0.5 >= (height - groundOffset) && this.ySpeed > 0) {
            this.ySpeed = 0;
            this.y = height - this.width * 0.5 - groundOffset;
        }
        this.ySpeed += gravity;
        this.y += this.ySpeed;
        this.xSpeed *= 0.8;
        if (this.x - this.width * 0.5 < -1 * this.width) {
            this.x = this.width * -0.5;
            this.xSpeed = 0;
        } else if (this.x + this.width * 0.5 > width) {
            this.x = width - this.width * 0.5;
            this.xSpeed = 0;
        }
        this.x += this.xSpeed;
    }

    moveBadGuy(){
        var differenceX = this.targetX-this.x;
        this.xSpeed += differenceX*0.002;

        if(random() >= 0.98){
            this.targetX = random()*width;
            this.ySpeed -= 5;
        }
        if (this.xSpeed < 0) {
            this.direction = 'left';
        } else {
            this.direction = 'right';
        }

        this.isTouchingMainCharacter();
    }

    isTouchingMainCharacter(){
        if(mainCharacter.x + mainCharacter.width >= this.x &&
            mainCharacter.x <= this.x+this.width &&
            mainCharacter.y + mainCharacter.width >= this.y &&
            mainCharacter.y <= this.y+this.width)
        {
            if(mainCharacter.y - this.y < -30){
                this.isDead = true;
                mainCharacter.ySpeed = -10;
                score++;
            } else {
                health -= 0.3;
            }
        }
    }

    draw() {
        if (this.isMonster && this.direction === 'left') {
            image(monsterImageL, this.x, this.y, this.width, this.width);
        } else if (this.isMonster) {
            image(monsterImageR, this.x, this.y, this.width, this.width);
        } else if (!this.isMonster && this.direction === 'left') {
            image(mainCharacterImageL, this.x, this.y, this.width, this.width);
        } else {
            image(mainCharacterImageR, this.x, this.y, this.width, this.width);
        }
    }
}