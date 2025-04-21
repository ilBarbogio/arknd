export class KeyboardControlsElement extends HTMLElement{
  static observedAttributes=["enabled"]

  totalTo8dir=[,"w","s","sw","e",,"se",,"n","nw",,,"ne"]

  constructor(){
    super()
    
    this.downListener=undefined
    this.upListener=undefined
    this.enabled=true
    this.type=this.hasAttribute("type")
    this.doubleTapInterval=12
  }

  connectedCallback(){
    this.style.display="none"
    this.actions=[]
    this.pressed=[]
    this.justPressed=[]
    this.justDoubleTap=[]
    this.doubleTapTimer=[]
    this.keys=[]
    this.setup()
  }

  setup(){
    for(let c of this.children){
      this.actions.push(c.innerHTML)
      this.pressed.push(false)
      this.justPressed.push(false)
      this.justDoubleTap.push(false)
      this.doubleTapTimer.push(-1)
      this.keys.push(`Key${c.dataset.key.toUpperCase()}`)
    }
    if(this.enabled) this.setupListeners()
  }

  setupListeners(){
    this.downListener=window.addEventListener("keydown",ev=>{
      let i=this.keys.findIndex(el=>el==ev.code)
      if(i!=-1 && !this.pressed[i]){
        this.pressed[i]=true
        this.justPressed[i]=true
        if(this.doubleTapTimer[i]<0) this.doubleTapTimer[i]=this.doubleTapInterval
        else{
          this.justDoubleTap[i]=true
          this.doubleTapTimer[i]=-1
        }
      }
    })
    this.upListener=window.addEventListener("keyup",ev=>{
      let i=this.keys.findIndex(el=>el==ev.code)
      if(i!=-1){
        this.pressed[i]=false
      }
    })
  }

  tick(){
    for(let i=0;i<this.keys.length;i++){
      if(this.doubleTapTimer[i]>=0) this.doubleTapTimer[i]--
      else this.justDoubleTap[i]=false
      
      this.justPressed[i]=false
    }
  }

  attributeChangedCallback(name,oldValue,newValue){
    switch(name){
      case "enabled":
        this.enabled=newValue==true?true:false
        if(!this.enabled && (this.upListener || this.downListener)){
          window.removeEventListener(this.upListener)
          window.removeEventListener(this.downListener)
        }else this.setupListeners()
        break
      default: break
    }
  }

  isActionPressed(action){
    return this.pressed[this.actions.findIndex(el=>el==action)]
  }
  isActionJustPressed(action){
    return this.justPressed[this.actions.findIndex(el=>el==action)]
  }
  isActionJustDoubleTap(action){
    return this.justDoubleTap[this.actions.findIndex(el=>el==action)]
  }

  //specialized
  get8dir(){//requires four keys to be up,right,down,left
    let total=0
    for(let [i,n] of [8,4,2,1].entries()) if(this.pressed[i]) total+=n
    return this.totalTo8dir[total]
  }

}


class TouchControlsElement extends HTMLElement{
  static observedAttributes=["enabled"]

  totalTo8dir=[,"w","s","sw","e",,"se",,"n","nw",,,"ne"]

  constructor(){
    super()
    
    this.dPadDownListener=undefined
    this.dPadMoveListener=undefined
    this.dPadUpListener=undefined

    this.runRightDownListener=undefined
    this.runRightUpListener=undefined
    this.runLeftDownListener=undefined
    this.runLeftUpListener=undefined

    this.jumpDownListener=undefined
    this.jumpUpListener=undefined    

    this.btn1DownListener=undefined
    this.btn1UpListener=undefined

    this.btn2DownListener=undefined
    this.btn2UpListener=undefined

    this.enabled=true

    this.shadow=this.attachShadow({mode:"open"})
  }

  connectedCallback(){
    this.generateHTML()

    this.actions=["up","right","down","left","fire1","fire2","jump"]
    // this.dire=["e","d","s","a"]
    this.pressed=[]
    this.justPressed=[]
    this.justDoubleTap=[]
    for(let i=0;i<7;i++){
      this.pressed.push(false)
      this.justPressed.push(false)
      this.justDoubleTap.push(false)
    }
    if(this.enabled) this.setupListeners()
  }

  generateHTML(){
    this.shadow.innerHTML=`
    <style>
      :host{
        display:block;
      }
      .container{
        position:fixed;
        bottom:0;
        left:0;
        width:100vw;
        display:flex;
        justify-content:space-between;
        align-itmes:center;

        .d-pad{
          position:relative;
          width:12em;
          height:12em;
          border-radius:50%;
          background-color:white;
          opacity:.5;
          margin-left:2em;
        }

        .subpad{
          opacity:.5;
          position:absolute;
          width:3em;
          height:6em;
          border-radius:50%;
          background-color: cyan;
          top:3em;
        }
        .run-right{
          margin-left:13em;
        }
        .run-left{
          margin-left:0;
        }

        .buttons{
          position:relative;
          width:8em;
          height:12em;
          opacity:.5;

          .button{
            margin:.5em;
            width:5em;
            height:5em;
            border-radius:50%;
            background-color:white;
            oapcity:inherit;

            &.fire_1{
              position:absolute;
              right:0;
              top:0;
            }
            &.fire_2{
              position:absolute;
              right:0;
              bottom:0;
            }
            &.jump{
              position:absolute;
              left:0;
              top:3em;
              background-color:cyan;
            }
          }
        }
      }
    </style>
    <div class="container">
      <div class="d-pad"></div>
      <div class="subpad run-right"></div>
      <div class="subpad run-left"></div>

      <div class="buttons">
        <div class="button jump"></div>
        <div class="button fire_1"></div>
        <div class="button fire_2"></div>
      </div>
    </div>
    `

    this.dPad=this.shadow.querySelector(".d-pad")
    this.runRightPad=this.shadow.querySelector(".subpad.run-right")
    this.runLeftPad=this.shadow.querySelector(".subpad.run-left")
    this.btnJump=this.shadow.querySelector(".jump")
    console.log(this.btnJump)
    this.btn1=this.shadow.querySelector(".fire_1")
    this.btn2=this.shadow.querySelector(".fire_2")
  }

  setupListeners(){
    let rect=this.dPad.getBoundingClientRect()
    let center=[.5*rect.width, .5*rect.height]
    
    const getCoords=(touch)=>{
      let x=touch.clientX-rect.x
      let y=touch.clientY-rect.y
      return Math.atan2(y-center[1], x-center[0])
    }

    const getDirection=(angle)=>{
      let abs=Math.abs(angle)
      let quarter=Math.PI/8
      if(abs<quarter) return "e"
      else if(abs<3*quarter){
        if(angle<0) return "ne"
        else return "se"
      }else if(abs<5*quarter){
        if(angle<0) return "n"
        else return "s"
      }else if(angle<7*quarter){
        if(angle<0) return "nw"
        else return "sw"
      }else return "w"
    }
    const sortPressedDirection=(dir)=>{
      for(let i=0;i<4;i++) this.pressed[i]=false
      if(dir.includes("n")){
        this.pressed[0]=true
        this.justPressed[0]=true
      }

      if(dir.includes("e")){
        this.pressed[1]=true
        this.justPressed[1]=true
      }

      if(dir.includes("s")){
        this.pressed[2]=true
        this.justPressed[2]=true
      }

      if(dir.includes("w")){
        this.pressed[3]=true
        this.justPressed[3]=true
      }
    }

    this.dPadDownListener=this.dPad.addEventListener("touchstart",ev=>{
      ev.preventDefault()
      let angle=getCoords(ev.targetTouches[0])
      let dir=getDirection(angle)
      sortPressedDirection(dir)  
    })
    this.dPadMoveListener=this.dPad.addEventListener("touchmove",ev=>{
      ev.preventDefault()
      let angle=getCoords(ev.targetTouches[0])
      let dir=getDirection(angle)
      sortPressedDirection(dir,true)
    })
    this.dPadUpListener=this.dPad.addEventListener("touchend",ev=>{
      for(let i=0;i<4;i++) this.pressed[i]=false
    },{passive:true})

    this.runRightDownListener=this.runRightPad.addEventListener("touchstart",ev=>{
      ev.preventDefault()
      sortPressedDirection("e")
      this.justDoubleTap[1]=true
    })
    this.runRightUpListener=this.runRightPad.addEventListener("touchend",ev=>{
      this.pressed[1]=false
      this.justDoubleTap[1]=false
    },{passive:true})
    this.runLeftDownListener=this.runLeftPad.addEventListener("touchstart",ev=>{
      ev.preventDefault()
      sortPressedDirection("w")
      this.justDoubleTap[3]=true
    })
    this.runRightUpListener=this.runLeftPad.addEventListener("touchend",ev=>{
      this.pressed[3]=false
      this.justDoubleTap[3]=false
    },{passive:true})

    this.btn1DownListener=this.btn1.addEventListener("touchstart",ev=>{
      ev.preventDefault()
      this.pressed[4]=true
      this.justPressed[4]=true
    })
    this.btn1UpListener=this.btn1.addEventListener("touchend",ev=>{
      ev.preventDefault()
      this.pressed[4]=false
    })
    this.btn2DownListener=this.btn2.addEventListener("touchstart",ev=>{
      ev.preventDefault()
      this.pressed[5]=true
      this.justPressed[5]=true
    })
    this.btn2UpListener=this.btn2.addEventListener("touchend",ev=>{
      ev.preventDefault()
      this.pressed[5]=false
    })

    this.jumpDownListener=this.btnJump.addEventListener("touchstart",ev=>{
      ev.preventDefault()
      this.pressed[6]=true
      this.justPressed[6]=true
    })
    this.jumpUpListener=this.btnJump.addEventListener("touchstart",ev=>{
      ev.preventDefault()
      this.pressed[6]=false
    })
  }

  tick(){
    for(let i=0;i<this.actions.length;i++){
      this.justDoubleTap[i]=false
      
      this.justPressed[i]=false
    }
  }

  attributeChangedCallback(name,oldValue,newValue){
    switch(name){
      // case "enabled":
      //   this.enabled=newValue==true?true:false
      //   if(!this.enabled && (this.upListener || this.downListener)){
      //     window.removeEventListener(this.upListener)
      //     window.removeEventListener(this.downListener)
      //   }else{
      //     this.generateHTML()
      //     this.setupListeners()
      //   }
      //   break
      default: break
    }
  }

  isActionPressed(action){
    return this.pressed[this.actions.findIndex(el=>el==action)]
  }
  isActionJustPressed(action){
    return this.justPressed[this.actions.findIndex(el=>el==action)]
  }
  isActionJustDoubleTap(action){
    return this.justDoubleTap[this.actions.findIndex(el=>el==action)]
  }

  //specialized
  get8dir(){//requires four keys to be up,right,down,left
    let total=0
    for(let [i,n] of [8,4,2,1].entries()) if(this.pressed[i]) total+=n
    return this.totalTo8dir[total]
  }

}



class ControllerControlsElement extends HTMLElement{
  static observedAttributes=["enabled"]

  totalTo8dir=[,"w","s","sw","e",,"se",,"n","nw",,,"ne"]

  constructor(){
    super()
    
    this.enabled=true

    this.gamepad
    this.gamepadIndex
    this.modButton=false
  }

  connectedCallback(){
    this.actions=["up","right","down","left","fire1","fire2","jump"]
    
    this.pressed=[]
    this.justPressed=[]
    this.justDoubleTap=[]
    this.keys=[]
    for(let c of this.children){
      this.pressed.push(false)
      this.justPressed.push(false)
      this.justDoubleTap.push(false)
    }
    if(this.enabled) this.setupListeners()
  }

  setupListeners(){
    window.addEventListener("gamepadconnected",(e)=>{
      this.gamepad=e.gamepad
      this.gamepadIndex=e.gamepad.index
    })

    window.addEventListener("gamepaddisconnected",(e)=>{
      this.gamepad=undefined
      this.gamepadIndex=undefined
    })

  }

  buttonDown(i){
    if(!this.pressed[i]){
      this.pressed[i]=true
      this.justPressed[i]=true
      if(i==1 || i==3){
        if(this.modButton) this.justDoubleTap[i]=true
        else this.justDoubleTap[i]=false
      }
    }else{
      this.justPressed[i]=false
    }
  }
  buttonUp(i){
    this.pressed[i]=false
    this.justPressed[i]=false
    this.justDoubleTap[i]=false
  }

  tick(){
    if(this.gamepadIndex!==undefined){
      let gamepad=navigator.getGamepads()[this.gamepadIndex]
      for(let [i,b] of gamepad.buttons.entries()) if(b,b.pressed) console.log(i)
      if(gamepad.buttons[5].pressed) this.modButton=true
      else this.modButton=false
      if(gamepad.buttons[12].pressed) this.buttonDown(0)
      else this.buttonUp(0)
      if(gamepad.buttons[15].pressed) this.buttonDown(1)
      else this.buttonUp(1)
      if(gamepad.buttons[13].pressed) this.buttonDown(2)
      else this.buttonUp(2)
      if(gamepad.buttons[14].pressed) this.buttonDown(3)
      else this.buttonUp(3)
      if(gamepad.buttons[0].pressed) this.buttonDown(4)//fire1
      else this.buttonUp(4)
      if(gamepad.buttons[2].pressed) this.buttonDown(5)//fire2
      else this.buttonUp(5)
      if(gamepad.buttons[3].pressed) this.buttonDown(6)//jump
      else this.buttonUp(6)

      if(this.modButton){
        if(this.pressed[1]) this.justDoubleTap[1]=true
        if(this.pressed[3]) this.justDoubleTap[3]=true
      }
    }
  }

  attributeChangedCallback(name,oldValue,newValue){
    switch(name){
      // case "enabled":
      //   this.enabled=newValue==true?true:false
      //   if(!this.enabled && (this.upListener || this.downListener)){
      //     window.removeEventListener(this.upListener)
      //     window.removeEventListener(this.downListener)
      //   }else{
      //     this.generateHTML()
      //     this.setupListeners()
      //   }
      //   break
      default: break
    }
  }

  isActionPressed(action){
    return this.pressed[this.actions.findIndex(el=>el==action)]
  }
  isActionJustPressed(action){
    return this.justPressed[this.actions.findIndex(el=>el==action)]
  }
  isActionJustDoubleTap(action){
    return this.justDoubleTap[this.actions.findIndex(el=>el==action)]
  }

  //specialized
  get8dir(){//requires four keys to be up,right,down,left
    let total=0
    for(let [i,n] of [8,4,2,1].entries()) if(this.pressed[i]) total+=n
    return this.totalTo8dir[total]
  }

}