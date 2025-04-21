import { setup as setupLevel } from "level"

export const settings={
  audio:false
}


window.addEventListener("load",()=>{
  setupLevel()
})