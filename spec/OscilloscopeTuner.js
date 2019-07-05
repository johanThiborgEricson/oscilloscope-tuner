describe("The oscilloscope tuner", function() {
  var canvas;
  var ot;
  beforeEach(function() {
    canvas = document.createElement("canvas");
    ot = new OscilloscopeTuner(canvas);
  });

  afterEach(function() {
    ot.dispose();
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
});
