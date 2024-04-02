/*

FIX PERCENT CALCULATION

If target > guessed then guessed/target
ELSE guessed/target

MIGHT WORK

*/


function setup() {
  createCanvas(500, 800);

  noSlider = createGraphics(100, 100)
  noSlider.background(0)

  userBox = new Box(100, 200, "user")
  randBox = new Box(300, 200, "rand")



  timeOptions = createRadio()
  timeOptions.option("20", "20 sec")
  timeOptions.option("15", "15 sec")
  timeOptions.option("10", "10 sec")

  timeOptions.position(130, 120)
  timeOptions.selected("20")

  rslider = createSlider(0, 255, 127)
  rslider.position((width/2)-(225/2), 400)
  rslider.addClass("mySliders")
  rslider.addClass("red")


  gslider = createSlider(0, 255, 127)
  gslider.position((width/2)-(225/2), 500)
  gslider.addClass("mySliders")
  gslider.addClass("green")


  bslider = createSlider(0, 255, 127)
  bslider.position((width/2)-(225/2), 600)
  bslider.addClass("mySliders")
  bslider.addClass("blue")


  start = createButton("Start")
  start.position((width/2) - 30, height - 85)
  start.addClass("myButton")

  nGame = createButton("New Game")
  nGame.position((width/2) - 50, height - 85)
  nGame.addClass("myButton")
  nGame.hide()
 



  newRGB = false

  milliCountdown = timeOptions.value()*1000
  

}

resetDefaults=function(){
  randomR = Math.floor(Math.random()* 256)
  randomG = Math.floor(Math.random()* 256)
  randomB = Math.floor(Math.random()* 256)
  timer = false
  started = false
  ended = false
  firstEnded = true
  msPerFrame = 16.67

}


resetDefaults()

 
function draw() {
  background(240);
  main()


}
 

class Box{
  constructor(x, y, state){
    this.x = x
    this.y = y
    this.size = 100
    this.roundCorner = 15
    this.state = state // either "user" or "rand"
    this.xvel = 0
    this.yVel = 0

  }

  update_color(){
    noStroke()
    if (this.state === "user"){
      fill(rslider.value(), gslider.value(), bslider.value())
      rect(this.x, this.y, this.size, this.size, this.roundCorner)
    }else{
      if(newRGB===true){
        randomR = random(0, 256)
        randomG = random(0, 256)
        randomB = random(0, 256)
      }

      push()
      fill(randomR,randomG, randomB)
      rect(this.x, this.y, this.size, this.size, 15)
      pop()
    }
  }

} 

function showTimer(){
  if(timer==true){

    if(frameCount % 1 == 0 && milliCountdown > msPerFrame){
      milliCountdown -= msPerFrame
    }else if(milliCountdown <= msPerFrame){
      milliCountdown = 0
      ended = true
    } 
    push()
    fill(map(Math.abs(milliCountdown-(timeOptions.value()*1000)), 0, timeOptions.value()*1000, 50, 255), map(milliCountdown, 0, timeOptions.value()*1000, 0, 200), 0)
    textSize(35)
    textAlign("center")
    text(`${(Math.floor(milliCountdown/10)/100)} sec`, width/2, 145)
    pop()


  }
}



function startGame(){


  if(started==false){
    milliCountdown = timeOptions.value()*1000
    started = true
  }
  timeOptions.hide()

  
  newRGB = true
  randBox.update_color()
  newRGB=false
  rslider.value(127)
  gslider.value(127)
  bslider.value(127)
  timer = true
  start.hide()
  console.log(randomR, randomG, randomB)
}
 
function endGame(){ 
  if (firstEnded){
    // Get percents && lock slider values
    rPercent = Math.abs(((Math.abs((rslider.value()-randomR))/randomR)-1))
    gPercent = Math.abs(((Math.abs((gslider.value()-randomG))/randomR)-1))
    bPercent = Math.abs(((Math.abs((bslider.value()-randomB))/randomR)-1))
    totalPercent = Math.round(((rPercent+gPercent+bPercent)/3)*100)

    //console.log(rslider.value(), randomR, rPercent)
    //console.log(gslider.value(), randomG, gPercent)
    //console.log(bslider.value(), randomB, bPercent)



    rLock = rslider.value()
    gLock = gslider.value()
    bLock = bslider.value()
    //error
    firstEnded = false
  }
  nGame.show()
  animate()
}

function animate(){
  let wantedX = userBox.x + 30
  let wantedY = userBox.y + 30
   // move randBox to userBox


  let slope = ((-randBox.y)-(-wantedY))/(randBox.x-wantedX) // top left to bottom right
  //console.log(slope)
  // need to go down 3 and left 17
  time.sleep(1)
  if (randBox.y < wantedY || randBox.x > wantedX){
    randBox.y += 3/6
    randBox.x -= 17/6
  }else if (randBox.y == wantedY || randBox.x == wantedX){
    push()
    textSize(30)
    fill("black")
    text(totalPercent + "%", 320, 260)
    pop()
  }
 
}

function newGame(){
  randBox.y = 200
  randBox.x = 300
  timeOptions.show()
  nGame.hide()
  start.show()
  resetDefaults()
}

function main(){
  if (!started){
    push()
    textSize(25)
    textAlign("center")
    fill("black")
    text("Time Options:", width/2, 75)
    pop()
    } else{
        push()
      textSize(25)
      textAlign("center")
      fill("black")
      text("Time:", width/2, 75)
      pop()}
    userBox.update_color()
    randBox.update_color()
    start.mousePressed(startGame)
    showTimer()
    if(ended){
      endGame()
    }
    nGame.mousePressed(newGame)
}