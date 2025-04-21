import { controls, slideControls } from "controls"
import { can, ctx } from "canvas"

export let paddle={
  dims:[0,0],
  vel:[0,0],
  speed:0,
  coords:[0,0]
}

export function paddleSetup(x,y){
  paddle={
    dims:[30,5],
    vel:[0,0],
    speed:100,
    coords:[x,y]
  }
}
export function paddleUpdate(delta){
  if(slideControls.enabled){
    let target=.01*slideControls.position*can.width
    paddle.coords[0]=target
  }{
    if(controls.isActionPressed("left")) paddle.vel[0]=-.001*delta*paddle.speed
    else if(controls.isActionPressed("right")) paddle.vel[0]=.001*delta*paddle.speed
    else paddle.vel[0]=0
    let nextCoords=paddle.coords.map((el,i)=>el+=paddle.vel[i])
    if(nextCoords[0]-paddle.dims[0]*.5<0){
      paddle.vel[0]=0
      paddle.coords[0]=paddle.dims[0]*.5
    }else if(nextCoords[0]+paddle.dims[0]*.5>can.width){
      paddle.vel[0]=0
      paddle.coords[0]=can.width-paddle.dims[0]*.5
    }else paddle.coords=nextCoords
  }
}
export function paddleDraw(){
  ctx.fillStyle="white"
  ctx.fillRect(...paddle.coords.map((el,i)=>el-paddle.dims[i]*.5),...paddle.dims)
}
