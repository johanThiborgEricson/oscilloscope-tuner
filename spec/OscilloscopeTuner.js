describe("The oscilloscope tuner", function() {
  var canvas;
  var ot;
  var streamPromise = navigator.mediaDevices.getUserMedia({audio: true});
  beforeEach(function() {
    canvas = document.createElement("canvas");
    ot = new OscilloscopeTuner(streamPromise, canvas);
  });

  afterEach(function() {
    ot.dispose();
  });

  afterAll(function() {
    var canvas = document.createElement("canvas");
    var b = document.body
    b.insertBefore(canvas, b.firstChild);
    var ot = new OscilloscopeTuner(streamPromise, canvas);
    ot.start();
    setTimeout(function() {
      ot.dispose();
    }, 10000);
  });
  
  var promiseTimeoutSixAnimationFrames = function() {
    return new Promise(function(resolve) {
      setTimeout(resolve, 100);
    });
  };

  it("closes its AudioContext and stops requesting animation frames", function() {
    return ot.start()
    .then(function() {
      expect(ot.audioContext.state).not.toBe("closed");
      var disposePromise = ot.dispose();
      spyOn(window, "requestAnimationFrame");
      return disposePromise;
    })
    .then(function() {
      expect(ot.audioContext.state).toBe("closed");
      return promiseTimeoutSixAnimationFrames();
    })
    .then(function() {
      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });
  });
  
  it("Requests animation frames repeatedly", function() {
    spyOn(window, "requestAnimationFrame").and.callThrough();
    return ot.start()
    .then(function() {
      return promiseTimeoutSixAnimationFrames();
    })
    .then(function() {
      expect(requestAnimationFrame.calls.count()).toBeGreaterThan(1);
    })
    ;
  });

  it("doesn't close a closed audio context", function() {
    return ot.start()
    .then(function() {
      return ot.dispose();
    })
    .then(function() {
      spyOn(ot.audioContext, "close");
      return ot.dispose();
    })
    .then(function() {
      expect(ot.audioContext.close).not.toHaveBeenCalled();
    })
    ; 
  });

  it("draws the input from the microphone", function(done) {
    var context = canvas.getContext("2d");
    ot.start();
    var firstCall = false;
    var firstValue;
    spyOn(context, "lineTo").and.callFake(function(x, y){
      if(firstCall){
        firstCall = false;
        firstValue = y;
      } else if(y != firstValue){
        expect(y).not.toBe(firstValue);
        done();
      }
    });
  });

  it("draws something", function() {
    var context = canvas.getContext("2d");
    spyOn(context, "moveTo").and.callThrough();
    spyOn(context, "lineTo").and.callThrough();
    spyOn(context, "stroke").and.callThrough();
    return ot.start()
    .then(promiseTimeoutSixAnimationFrames)
    .then(function() {
      expect(context.moveTo).toHaveBeenCalled();
      expect(context.stroke).toHaveBeenCalled();
    });
  });

  it("draws data from the pipe", function() {
    var leftmostX = 0;
    var rightmostX = 1;
    var ys = [ -0.25, 0.25, 0.5];
    var line = new Line(leftmostX, rightmostX, ys);
    spyOn(ot, "pipe").and.returnValue(line);
    var context = canvas.getContext("2d");
    spyOn(context, "moveTo").and.callThrough();
    spyOn(context, "lineTo").and.callThrough();
    spyOn(context, "stroke").and.callThrough();
    ot.tick();
    var h = canvas.height;
    var w = canvas.width;
    expect(h).toBeGreaterThan(0);
    expect(w).toBeGreaterThan(0);
    expect(context.moveTo)
      .toHaveBeenCalledWith(0 * w, 0.625 * h);
    expect(context.lineTo)
      .toHaveBeenCalledWith(0.5 * w, 0.375 * h);
    expect(context.lineTo)
      .toHaveBeenCalledWith(1 * w, 0.25 * h);
  });

  it("observes left- and rightmost x", function() {
    var leftmostX = -1;
    var rightmostX = 2;
    var ys = [ 0, 0 ];
    var line = new Line(leftmostX, rightmostX, ys);
    spyOn(ot, "pipe").and.returnValue(line);
    var context = canvas.getContext("2d");
    spyOn(context, "moveTo").and.callThrough();
    spyOn(context, "lineTo").and.callThrough();
    ot.tick();
    var h = canvas.height;
    var w = canvas.width;
    expect(context.moveTo)
      .toHaveBeenCalledWith(-w, h / 2);
    expect(context.lineTo)
      .toHaveBeenCalledWith(2 * w, h / 2);
  });
});
