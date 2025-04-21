export class SlideControlsElement extends HTMLElement{
  static observedAttributes=["enabled"]

  constructor(){
    super()
    
    this.slideDownListener=undefined
    this.slideMoveListener=undefined
    this.slideUpListener=undefined

    this.position=0

    this.enabled=true

    this.shadow=this.attachShadow({mode:"open"})
  }

  connectedCallback(){
    this.generateHTML()

    this.cursor=this.shadow.querySelector(".cursor")
    this.container=this.shadow.querySelector(".container")
  }

  setup(){
    if(this.enabled){
      let rect=this.container.getBoundingClientRect()
      this.constraints=[rect.left,rect.right]
      this.setupListeners()
    }
  }

  generateHTML(){
    this.shadow.innerHTML=`
    <style>
      :host{
        display:block;
      }
      .container{
        position:relative;
        width:100%;
        height:4em;
        background-color:#ffffff60;
        
        .cursor{
          position:absolute;
          top:0;
          left:calc(50% - 2em);

          width:4em;
          height:4em;
          border-radius:.5em;
          background-color:gray;
        }

      }
    </style>
    <div class="container">
      <div class="cursor"></div>
    </div>
    `
  }

  setupListeners(){
    let dragging=false
    // let prevCoord=-1

    this.cursorDownListener=this.cursor.addEventListener("touchstart",ev=>{
      ev.preventDefault()
      if(!dragging){
        dragging=true
      }
    })
    this.cursorMoveListener=this.cursor.addEventListener("touchmove",ev=>{
      ev.preventDefault()
      if(dragging){
        this.position=Math.floor((ev.targetTouches[0].clientX-this.constraints[0])/(this.constraints[1]-this.constraints[0])*100)
        this.cursor.style.left=`calc(${this.position}% - 2em)`
      }
    })
    this.cursorUpListener=this.cursor.addEventListener("touchend",ev=>{
      dragging=false
    },{passive:true})

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

}