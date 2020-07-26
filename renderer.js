const status = document.getElementById('status')
let capture;
let mainCanvas;
let detectInterval = setInterval(detectSignal, 10)

let isDetectedWhite = false
let messages = []

let _mainSketch = function (sketch) {
    
    sketch.setup = function () {
        mainCanvas = sketch.createCanvas(40, 40)
        mainCanvas.id('mainCanvas')
        
        capture = sketch.createCapture(sketch.VIDEO)
        capture.size(320, 240)
        //capture.hide()
    }

    sketch.draw = function () {
        sketch.background(0)
        sketch.image(capture, 0, 0, 320, 240)
        if (capture.loadedmetadata) {
            let c = capture.get(140, 100, 40, 40)
            sketch.image(c, 0, 0)
        }
        sketch.filter(sketch.THRESHOLD)
    }

}

let mainSketch = new p5(_mainSketch, 'main-sketch-container')

function detectSignal () {
    mainCanvasImage = mainSketch.get(0, 0, 40, 40)
    mainCanvasImage.loadPixels()

    let pixels = mainCanvasImage.pixels
    for (let i = 0; i < pixels.length; i++) {
        if (i % 4 == 3) {
            continue
        }

        let color = pixels[i]

        if (color == 255) {
            if (!isDetectedWhite) {
                console.log("White Signal detected")
                createMessage()
            }

            isDetectedWhite = true
            return;
        }
    }

    // outside of loop, it means end of signal
    if (isDetectedWhite) {
        isDetectedWhite = false
        signalStopped()
    }
}

function createMessage () {
    let data = {
        startDate: new Date().getTime(),
        finishDate: null,
        aliveDuration: null
    }

    messages.push(data)
}

function signalStopped () {
    let lastMessage = messages.slice(-1)[0]
    
    lastMessage.finishDate = new Date().getTime()
    lastMessage.aliveDuration = lastMessage.finishDate - lastMessage.startDate

    console.log(`Signal alived for ${lastMessage.aliveDuration} milliseconds`)
    minifyAliveTime(lastMessage)
}

function minifyAliveTime (message) {
    if (message.aliveDuration >= 0 && message.aliveDuration < 300) {
        message.aliveDuration = 100
    } else if (message.aliveDuration > 300) {
        message.aliveDuration = 300
    }
}
