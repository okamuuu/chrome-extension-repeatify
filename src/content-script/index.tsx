const TIME_REGEX = /^([0-9])?:?([0-5]?[0-9]):([0-5][0-9])$/

// XXX: toTime ?
function toSeconds(formattedTime: string): number {
  const mateches = formattedTime.match(TIME_REGEX)
  if (!mateches) {
    return
    // throw new Error(`invalid time formate: ${formattedTime}`)
  }
  const [_, HH, mm, ss] = mateches
  const hours = HH ? parseInt(HH, 0) * 60 * 60 : 0
  const minutes = mm ? parseInt(mm, 0) * 60 : 0
  const seconds = ss ? parseInt(ss, 0) : 0
  return hours + minutes + seconds
}

const videoElements = document.getElementsByTagName('video')
const video = videoElements[0]

let isVideoRepeatable
let startTime, endTime

function loop() {
  if (!isVideoRepeatable) {
    return
  }
  if (video.currentTime > endTime) {
    video.currentTime = startTime
  } else if(video.currentTime < startTime) {
    video.currentTime = startTime
  }
}

video.addEventListener('timeupdate', loop)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  video.style.transform = request.flipped ? 'scale(-1, 1)' : 'scale(1, 1)';
  video.playbackRate = request.playbackRate;

  if (request.start && request.end) {
    startTime = toSeconds(request.start)
    endTime = toSeconds(request.end)
    isVideoRepeatable = endTime > startTime && video.duration > endTime
  } else {
    isVideoRepeatable = false
  }
  
  sendResponse({status: true});
  return true
});
