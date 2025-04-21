export function rectContinuosCollision(prev,next,radius,center,sides){
  //ipotesi: next è interno al rettangolo
  let point=[0,0]
  let normal=[0,0]

  let deltaCenterX=Math.abs(prev[0]-center[0])
  if(deltaCenterX<=sides[0]*.5){//direzione verticale (preferita)
    let deltaY=next[1]-prev[1]
    if(prev[1]<center[1]){//dall'alto
      point[1]=center[1]-.5*sides[1]
      normal[1]=-1
    }else{//dal basso
      point[1]=center[1]+.5*sides[1]
      normal[1]=1
    }
    let ratio=(point[1]-prev[1])/deltaY
    point[0]=prev[0]+ratio*deltaY
  }else{//direzione orizzontale
    let deltaX=prev[0]-next[0]
    if(prev[0]<center[0]){//da sinistra
      point[0]=center[0]-.5*sides[0]
      normal[0]=-1
    }else{//da destra
      point[0]=center[0]+.5*sides[0]
      normal[0]=1
    }
    let ratio=(point[0]-prev[0])/deltaX
    point[1]=prev[1]+ratio*deltaX
  }
  return {point,normal}
}


export function normalize(v){
  let l=Math.sqrt(v[0]**2+v[1]**2)
  return v.map(el=>el/l)
}