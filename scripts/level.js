import { setup as setupAudio, playSound } from "audio"
import { setup as setupControls, controls } from "controls"
import { settings } from "index"
import { can, ctx, canvasSetup, canvasUpdate } from "canvas"
import { ballsSetup, ballsUpdate, ballsDraw } from "ball"
import { paddleSetup, paddleUpdate, paddleDraw } from "paddle"
import { bricksSetup, bricksUpdate, bricksDraw } from "bricks"


let prevTime, delta, running
let dimensions={
  canvas:[128*2,128*3],
  paddle:[30,8],
  ball:[2],
  bricks:[32,16]//8 bricks wide level
}


export async function setup(){
  if(settings.audio) await setupAudio()

  setupControls()

  window.addEventListener("visibilitychange",()=>{
    if(document.visibilityState=="hidden") running=false
    else{
      running=true
      prevTime=performance.now()
    }
    
  })

  canvasSetup(...dimensions.canvas)
  ballsSetup(1,...dimensions.canvas.map(el=>el*.5))
  paddleSetup(dimensions.canvas[0], dimensions.canvas[1]-20)
  bricksSetup(...dimensions.bricks)//7,6

  prevTime=performance.now()
  running=true
  requestAnimationFrame(loop)
}

function loop(time){
  if(running) {
    delta=time-prevTime
    prevTime=time
    canvasUpdate()

    paddleUpdate(delta)
    ballsUpdate(delta)
    
    paddleDraw()
    bricksDraw()
    ballsDraw()
    
    requestAnimationFrame(loop)
  }
}














