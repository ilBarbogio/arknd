export let can,ctx

export function canvasSetup(width,height){
  can=document.querySelector("canvas")
  can.width=width
  can.height=height
  ctx=can.getContext("2d")

  ctx.fillStyle="black"
  ctx.fillRect(0,0,can.width,can.height)  
}
export function canvasUpdate(){
  ctx.clearRect(0,0,can.width,can.height)
}

