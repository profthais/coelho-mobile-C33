const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var ground;
var rope1, rope2, rope3;
var fruit;
var fruit_con1, fruit_con2, fruit_con3;

var bg_img, food, rabbit;

var bunny;

var button1, button2, button3;

var blink, eat, sad;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;

var blower;

var mute_btn;

function preload()
{
  bg_img = loadImage("assets/background.png");
  food = loadImage("assets/melon.png");
  rabbit = loadImage("assets/Rabbit-01.png");
  blink = loadAnimation("assets/blink_1.png", "assets/blink_2.png", "assets/blink_3.png");
  eat = loadAnimation("assets/eat_0.png", "assets/eat_1.png", "assets/eat_2.png", "assets/eat_3.png", "assets/eat_4.png");
  sad = loadAnimation("assets/sad_1.png", "assets/sad_2.png", "assets/sad_3.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  eat.looping = false;
  sad.looping = false;

  bk_song = loadSound('assets/sound1.mp3');
  sad_sound = loadSound("assets/sad.wav")
  cut_sound = loadSound('assets/rope_cut.mp3');
  eating_sound = loadSound('assets/eating_sound.mp3');
  air = loadSound('assets/air.wav');
}

function setup() 
{
  //createCanvas(500,700);
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth-80,displayHeight)
  }
  else {
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth,windowHeight);
  }

  frameRate(80);

  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  button1 = createImg("assets/cut_btn.png");
  button1.position(canW*0.2,30); //
  button1.size(50,50);
  button1.mouseClicked(drop);

  button2 = createImg("assets/cut_btn.png");
  button2.position(canW*0.53,35); //
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg("assets/cut_btn.png");
  button3.position(canW*0.60,200); //
  button3.size(50,50);
  button3.mouseClicked(drop3);

  bunny = createSprite(canW*0.50,canH-80,100,100); //
  //bunny.addImage(rabbit);
  bunny.scale = 0.2;
  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);
  bunny.changeAnimation("blinking");

  ground = new Ground(canW/2,canH,canW,20);
 
  rope1 = new Rope(6,{x: canW*0.22, y: 30}); //
  rope2 = new Rope(7,{x: canW*0.55, y: 40}); //
  rope3 = new Rope(4,{x: canW*0.62, y: 225}); //

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  textSize(50);

  var fruit_options = {
    density: 0.001,
  }

  fruit = Bodies.circle(300,300,15,fruit_options);
  Matter.Composite.add(rope1.body,fruit);

  fruit_con1 = new Link(rope1,fruit);
  fruit_con2 = new Link(rope2,fruit);
  fruit_con3 = new Link(rope3,fruit);

  blower = createImg('assets/balloon.png');
  blower.position(canW*0.01,canH*0.2); //
  blower.size(150,100);
  blower.mouseClicked(airblow);

  mute_btn = createImg('assets/mute.png');
  mute_btn.position(canW*0.7,20); //
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);
}

function draw() 
{
  background(51);
  image(bg_img,canW/2,canH/2,canW,canH);
  Engine.update(engine);
  
  ground.show();
  rope1.show();
  rope2.show();
  rope3.show();
  
  if(fruit != null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }

  if(collide(fruit,bunny) == true){
    bunny.changeAnimation("eating");
    eating_sound.play();
  }

  if(fruit!=null && fruit.position.y>=canH*0.9){
    bunny.changeAnimation('crying');
    sad_sound.play();
    fruit = null;
   }
  
  drawSprites();
}

function drop() {
  cut_sound.play();
  rope1.break();
  fruit_con1.detach();
  fruit_con1 = null;
}

function drop2() {
  cut_sound.play();
  rope2.break();
  fruit_con2.detach();
  fruit_con2 = null;
}

function drop3() {
  cut_sound.play();
  rope3.break();
  fruit_con3.detach();
  fruit_con3 = null;
}

function collide(body,sprite){
  if(body != null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);

    if(d <= 80){
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
}

function airblow()
{
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0});
  air.play();
}

function mute()
{
  if(bk_song.isPlaying())
     {
      bk_song.stop();
     }
     else{
      bk_song.play();
     }
}
