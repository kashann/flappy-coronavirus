const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
const corona = new Image();
const bg = new Image();
const fg = new Image();
const upperPipe = new Image();
const lowerPipe = new Image();
const scoreSound = new Audio('score.mp3');

corona.src = "images/coronavirus.png";
bg.src = "images/background.png";
fg.src = "images/foreground.png";
upperPipe.src = "images/upperPipe.png";
lowerPipe.src = "images/lowerPipe.png";

// some variables
var gap = 90;
var constant;
var bX = 10;
var bY = 150;
var gravity = 1.7;
var paused = false;
var score = 0;
var highscore = localStorage.getItem("high-score");
if(highscore == null) {
    highscore = 0;
}

// on key down
var events = ['keydown', 'touchstart'];
for(var i = 0; i < events.length; i++) {
    document.addEventListener(events[i], event => {
        if(event.keyCode === 27) { // esc to pause   
            paused = !paused;
            draw();
        }
        else {
            moveUp();
        }
    });
}

function moveUp() {
    bY -= 30;
    var floating = 0;
    var intervalId = setInterval(function() {
        bY -= 1;
        floating++;
        if(floating > 10){
            clearInterval(intervalId);
        }
    }, 16.66);
}

// pipe coordinates
var pipe = [];
pipe[0] = {
    x : cvs.width,
    y : 0
};

// draw images
function draw(){
    ctx.drawImage(bg, 0, 0);
    
    for(var i = 0; i < pipe.length; i++) {        
        constant = upperPipe.height + gap;
        ctx.drawImage(upperPipe, pipe[i].x, pipe[i].y);
        ctx.drawImage(lowerPipe, pipe[i].x, pipe[i].y + constant);
             
        pipe[i].x--;
        
        if(pipe[i].x == 125) {
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random() * upperPipe.height) - upperPipe.height
            }); 
        }

        // detect collision 
        if(bX + corona.width >= pipe[i].x && bX <= pipe[i].x + upperPipe.width && 
            (bY <= pipe[i].y + upperPipe.height || bY + corona.height >= pipe[i].y + constant) || 
            bY + corona.height >=  cvs.height - fg.height) {
                if (score > highscore) {
                    localStorage.setItem("high-score", score); // save the high score    
                }
                location.reload(); // reload the page
        }
        
        if(pipe[i].x == 5){
            score++;
            scoreSound.play();
        }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(corona, bX, bY);
    
    bY += gravity;
    
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, cvs.height - 45);
    ctx.fillText("High Score : " + highscore, 10, cvs.height - 20);

    if(paused) {
        Update();
    }
    
    requestAnimationFrame(draw);  
}

draw();