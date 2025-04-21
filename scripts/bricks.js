import { can, ctx } from "canvas"

export const bricks={
  dims:[0,0],
  coords:[],
  colors:[]
}
export const layouts={
  simple:[
    1,1,1,1, 1,1,1,1,
    1,1,1,1, 1,1,1,1,
    1,1,1,1, 1,1,1,1,
    1,1,1,1, 1,1,1,1,
    1,1,1,1, 1,1,1,1,
  ]
}
const colors=[
  "#FFFF00",
  "#FF3300",
  "#9D00FF",
  "#00FF00",
  "#FF00FF"
]

export function bricksSetup(width,height){
  bricks.dims=[width,height]
  bricks.coords=[]
  bricks.colors=[]

  let layout=layouts.simple
  let gridWidth=8//HARDCODED
  for(let [i,b] of layout.entries()){
    let x=i%gridWidth
    let y=Math.floor(i/gridWidth)
    bricks.coords.push([x*bricks.dims[0]+bricks.dims[0]*.5,y*bricks.dims[1]+bricks.dims[1]*.5])
    bricks.colors.push(colors[Math.floor(Math.random()*colors.length)])
  }
}
export function bricksUpdate(){}
export function bricksDraw(){
  for(let [i,b] of bricks.coords.entries()){
    ctx.fillStyle=bricks.colors[i]
    ctx.fillRect(
      b[0]-(bricks.dims[0]-2)/2,
      b[1]-(bricks.dims[1]-2)/2,
      ...bricks.dims.map(el=>el-2)
    )
  }
}

