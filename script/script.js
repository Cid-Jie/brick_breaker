//commencer une partie
var buttonStart = document.getElementById('start');
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Point de départ en bas et au milieu du caneva
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 5;
var dy = -5;
var ballRadius = 10;

//paddle
var paddleHeight = 15;
var paddleWidth = 150;
var paddleX = (canvas.width-paddleWidth) / 2;

//boutons droite et gauche du clavier
var rightPressed = false;
var leftPressed = false;

//définir les informations sur les briques
var brickRowCount = 8;
var brickColumnCount = 15;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 20;
var brickOffsetTop = 60;
var brickOffsetLeft = 50;

//definition du score
var score = 0;

//definition des vies
var lives = 3;

//Tableau à deux dimensions qui va contenir les colonnes de briques (c), qui à leur tour contiendront les rangées de briques (r)
var bricks = [];
for(var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//dessin de la balle
function drawBall()
{
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

//dessin du paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

//dessin des briques
function drawBricks()
{
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                //calculs qui déterminent la position x et y de chaque brique pour chaque itération de boucle
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                //design des briques
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "orange";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//Ecouteurs d'événements pour keydown et keyup / Mouvement du paddle aux touches D et G
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

//1/ La position x de la balle est supérieure à la position x de la brique. 
//2/ La position x de la balle est inférieure à la position x de la brique plus sa largeur. 
//3/ La position y de la balle est supérieure à la position y de la brique. 
//4/ La position y de la balle est inférieure à la position y de la brique plus sa hauteur.
function collisionDetection() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                //calculs
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickColumnCount * brickRowCount) {
                        window.alert("GOOD JOB, YOU WIN !!!!");
                        document.location.reload();
                        score = 0;
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score : " + score, 8, 20);
}

function drawLives() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Lives : " + lives, canvas.width-80, 20);
}

drawBricks();
drawBall();
drawPaddle();
drawScore();
drawLives();

buttonStart.addEventListener('click', function() {
    //fonction qui dessine le jeu et appelle toutes les fonctions de dessin et de règles
    function draw() {
        //effacer le canva avant chaque image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
        drawScore();
        drawLives();

        //fais rebondir la balle aux bords et la renvoi dans l'axe inverse (-ballRadius sinon on part du centre de la balle)
        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        }else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                if(!lives) {
                //game over si la balle touche le bas de l'ecran et rechargement de la partie
                window.alert("GAME OVER ... TRY AGAIN");
                document.location.reload();
                score = 0;
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 5;
                    dy = -5; 
                    paddleX = (canvas.width-paddleWidth)/2;
                }
            }
        }

        //redescine la balle a chaque avancement
        x += dx;
        y += dy;

        //fais bouger le paddle de gauche a droite en focntion des touches enfoncées et stopper aux bords du canva
        if(rightPressed) {
            paddleX += 10;
            if (paddleX + paddleWidth > canvas.width){
                paddleX = canvas.width - paddleWidth;
            }
        }
        else if(leftPressed) {
            paddleX -= 10;
            if (paddleX < 0) {
                paddleX = 0;
            }
        }
        requestAnimationFrame(draw);
    }
    //Afficher la balle
    draw();
})

