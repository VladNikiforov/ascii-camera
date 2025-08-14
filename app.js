const asciiChars = ' .:-=+*#%@'
const video = document.createElement('video')
video.autoplay = true
video.playsInline = true // important for iOS Safari

let width, height

function resizeASCII() {
  const charWidth = 6    // matches CSS font-size in px
  const charHeight = 6   // matches CSS line-height in px
  width = Math.floor(window.innerWidth / charWidth)
  height = Math.floor(window.innerHeight / charHeight)
}
resizeASCII()
window.addEventListener('resize', resizeASCII)

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream
    video.play()
    processFrame()
  })
  .catch(err => {
    document.getElementById('ascii').textContent = 'Camera access denied.'
    console.error(err)
  })

function processFrame() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height

  ctx.drawImage(video, 0, 0, width, height)
  const frame = ctx.getImageData(0, 0, width, height)
  const pixels = frame.data
  let ascii = ''

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3
      const char = asciiChars[Math.floor(avg / 256 * asciiChars.length)]
      ascii += char
    }
    ascii += '\n'
  }

  document.getElementById('ascii').textContent = ascii
  requestAnimationFrame(processFrame)
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
}
