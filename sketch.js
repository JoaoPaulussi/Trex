var trex, trex_running;
var groundImage;
var ground, invisibleGround;
var cloud,cloudsGroup,cloudImage;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var obstacleGroup,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var gameOverImage,restartImage,trex_collided;
var jumpSound,checkpointSound,dieSound;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadAnimation("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.jpg");
  restartImage = loadImage("restart.jpg");
  trex_collided = loadImage("trex_collide.jpg");
  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
}

function setup() {
  //createCanvas(600, 200);
  createCanvas(windowWidth, windowHeight);
  trex = createSprite(width/8, height-70, 20, 50);
  trex.addAnimation("correr", trex_running);
  trex.scale = 0.5;
  trex.x = 50;
  edges = createEdgeSprites();


  ground = createSprite(width/2,height-10, width, 20);
  ground.addAnimation("chao", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(width/2, height-10, width, 10);
  invisibleGround.visible = false;

  //var rand = Math.round(random(1,100));
  //console.log(rand);

  placar = 0;

  obstacleGroup = createGroup()
  cloudsGroup = createGroup()

  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  //Para adicionar inteligencia artificia    l
  //trex.setCollider("rectangle",0,0,40,trex.height);
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  trex.addAnimation("collided",trex_collided)
  //var msg = "isso é uma mensagem";
  //console.log(msg);
}

function draw() {
  background("white");
  text("pontuação: " +placar,width-150,50);
  placar = placar + Math.round(frameCount/60);

  if(gameState === PLAY){
    ground.velocityX = -(2+(3*placar)/100);
    placar = placar+Math.round(getFrameRate()/60);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if ((keyDown(32)||touches.length>0) && trex.y >= 900) {
      trex.velocityY = -10;
      jumpSound.play();
      touches = [];
    }
    if(placar>0 && placar % 100 === 0){
      checkpointSound.play();
    }
    gameOver.visible = false;
    restart.visible = false;
    trex.velocityY = trex.velocityY + 0.5;
    console.log(trex.y);
    console.log(ground.x);
    console.log(frameCount);
    criarNuvens();
    cactos();
    if(obstacleGroup.isTouching(trex)){
      dieSound.play();
      gameState = END;
      //Para colocar inteligencia artificial parte 2
      //trex.velocityY = -12;
      //jumpSound.play();
    }
  }else if(gameState === END){
    ground.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    gameOver.visible = true;
    restart.visible = true;
    trex.velocityY = 0;
    trex.changeAnimation("collided",trex_collided);
    obstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)||touches.length>0){
      console.log("reiniciar o jogo");
      reset();
      touches = [];
    }  
  }

  //trex.collide(edges[3]);
  trex.collide(invisibleGround);
  
  drawSprites();
}
function criarNuvens(){
  if(frameCount % 60 === 0){
    cloud = createSprite(width,Math.round(random(80,120)),40,10);
    cloud.addImage(cloudImage);
    //cloud.y = Math.round(random(10,60));
    cloud.velocityX = -3;
    cloud.scale = 0.7;
    cloud.depth = trex.depth;
    trex.depth = trex.depth +1;
    cloud.lifeTime = width/cloud.velocityX;
    //console.log(trex.depth);
    //console.log(cloud.depth);
    cloudsGroup.add(cloud);
  }
}
function cactos(){
  if(frameCount % 60 === 0){
    obstacle = createSprite(width,height-30,10,10);
    obstacle.velocityX = -(4+placar/100);
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }
    obstacle.scale = 0.5;
    obstacle.lifeTime = 300;
    obstacleGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  cloudsGroup.destroyEach();
  placar = 0;
  trex.changeAnimation("correr", trex_running);
  ground.velocityX = -(4+3*placar/100);
}