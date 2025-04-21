export let controls, slideControls

export function setup(){
  controls=document.querySelector("keyboard-controls")
  controls.setup()

  slideControls=document.querySelector("slide-controls")
  slideControls.setup()
}