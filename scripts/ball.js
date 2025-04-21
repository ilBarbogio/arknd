import { rectContinuosCollision, normalize } from "utils"
import { playSound } from "audio"
import { settings } from "index"
import { can, ctx } from "canvas"
import { paddle } from "paddle"
import { bricks } from "bricks"

export let balls=[]

const colors={
  ball:"#ff0000",
}

export function ballsSetup(n=1,x,y){
  balls=[]
  for(let i=0;i<n;i++){
    let angle=Math.random()*Math.PI*2
    // let angle=-Math.PI*.5//Math.random()*Math.PI*2
    balls.push({
      vel:[Math.cos(angle),Math.sin(angle)],
      speed:200,
      coords:[x,y]
    })
  }
}
export function ballsUpdate(delta){
  for(let ball of balls){
    let nextCoords=ball.coords.map((el,i)=>el+.001*(delta)*ball.speed*ball.vel[i])
    let coll=ballPaddleCollision(ball.coords,nextCoords)
    let point
    if(coll){
      nextCoords=coll.point
      if(coll.normal[0]*ball.vel[0]<0) ball.vel[0]*=-1
      else if(coll.normal[1]*ball.vel[1]<0){
        ball.vel[1]*=-1
        let delta=(coll.point[0]-paddle.coords[0])/(paddle.dims[0]*.5)
        ball.vel[0]+=delta*.5
      }

      ball.vel=normalize(ball.vel)
    }else{
      let brickColl=ballBricksCollision(ball.coords,nextCoords)
      if(brickColl){
        // running=false
        if(settings.audio) playSound()
        nextCoords=brickColl.point
        if(brickColl.normal[0]*ball.vel[0]<0) ball.vel[0]*=-1
        else if(brickColl.normal[1]*ball.vel[1]<0) ball.vel[1]*=-1
        
        bricks.coords=bricks.coords.slice(0,brickColl.i).concat(bricks.coords.slice(brickColl.i+1))
        bricks.colors=bricks.colors.slice(0,brickColl.i).concat(bricks.colors.slice(brickColl.i+1))
        
      }else{
        if(nextCoords[0]<0 || nextCoords[0]>can.width){
          //console.log(.01*Math.floor(100*Math.atan2(ball.vel[1],ball.vel[0])/Math.PI*180))
          //TODO here a check for too much horizontality
          ball.vel[0]*=-1
        }else if(nextCoords[1]<0 || nextCoords[1]>can.height){
          //console.log(.01*Math.floor(100*Math.atan2(ball.vel[1],ball.vel[0])/Math.PI*180))
          //TODO here a check for too much horizontality
          ball.vel[1]*=-1
        }
      }
    }

    ball.coords=point??nextCoords//.map((el,i)=>(el+ball.coords[i])*.5)
  }
}
export function ballsDraw(){
  ctx.fillStyle=colors.ball
  for(let ball of balls) ctx.fillRect(...ball.coords.map(el=>el-2),4,4)
}


export function ballPaddleCollision(prev,next){
  let deltaX=next[0]-paddle.coords[0]
  let deltaY=next[1]-paddle.coords[1]
  if(Math.abs(deltaX)<paddle.dims[0]*.5 && Math.abs(deltaY)<paddle.dims[1]*.5){
    return rectContinuosCollision(prev,next,2,paddle.coords,paddle.dims)
  }else return false

}
export function ballBricksCollision(prev,next){
  // console.log(bricks.coords.entries().length)
  for(let [i,c] of bricks.coords.entries()){
    let deltaX=Math.abs(next[0]-c[0])
    let deltaY=Math.abs(next[1]-c[1])
    if(deltaX<bricks.dims[0]*.5 && deltaY<bricks.dims[1]*.5){
      //collided!
      let coll=rectContinuosCollision(prev,next,2,c,bricks.dims)
      return {...coll,i}
    }
  }
  return undefined
}