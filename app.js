const asciiChars = ' .:-=+*#%@'
const video = document.createElement('video')
video.autoplay = true
video.playsInline = true

const asciiOutput = document.getElementById('asciiOutput')

const cols = 120
const rows = 60

const tempCanvas = document.createElement('canvas')
tempCanvas.width = cols
tempCanvas.height = rows
const tempCtx = tempCanvas.getContext('2d')

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream
    video.play()
    requestAnimationFrame(drawASCII)
  })
  .catch(console.error)

let lastTime = 0
function drawASCII(timestamp) {
  if (timestamp - lastTime < 50) {
    requestAnimationFrame(drawASCII)
    return
  }
  lastTime = timestamp

  tempCtx.drawImage(video, 0, 0, cols, rows)
  const frame = tempCtx.getImageData(0, 0, cols, rows).data

  let asciiFrame = ''
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4
      const avg = (frame[i] + frame[i + 1] + frame[i + 2]) / 3
      const char = asciiChars[Math.floor((avg / 256) * asciiChars.length)]
      asciiFrame += char
    }
    asciiFrame += '\n'
  }

  asciiOutput.textContent = asciiFrame
  requestAnimationFrame(drawASCII)
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
}
