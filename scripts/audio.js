let audio={
  ctx:undefined,
  spiund:undefined,
}

export async function setup(){
  audio.ctx=new AudioContext()
  audio.sound=await getAudio(audio.ctx,"sound1.ogg")
}

async function getAudio(audioCtx,filename){
  const res=await fetch(`./${filename}`)
  const buffer=await res.arrayBuffer()
  const audioBuffer=await audioCtx.decodeAudioData(buffer)
  return audioBuffer
}
export function playSound(){
  const source=new AudioBufferSourceNode(audio.ctx,{
    buffer:audio.sound,
    playbackRate:1
  })
  source.connect(audio.ctx.destination)
  source.start(0)
}