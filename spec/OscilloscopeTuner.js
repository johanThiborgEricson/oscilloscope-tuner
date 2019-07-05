describe("The oscilloscope tuner", function() {
  it("closes its AudioContext and stops requesting animation frames", function() {
    var canvas = document.createElement("canvas");
    var ot = new OscilloscopeTuner(canvas);
    return ot.started
    .then(function() {
      expect(ot.audioContext.state).not.toBe("closed");
      var disposePromise = ot.dispose();
      spyOn(window, "requestAnimationFrame");
      return disposePromise;
    })
    .then(function() {
      expect(ot.audioContext.state).toBe("closed");
      return new Promise(function(resolve) {
        setTimeout(resolve, 100);
      });
    })
    .then(function() {
      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });
  });
  
  it("Requests animation frames repeatedly", function() {
    spyOn(window, "requestAnimationFrame").and.callThrough();
    var canvas = document.createElement("canvas");
    var ot = new OscilloscopeTuner(canvas);
    return ot.started
    .then(function() {
      return new Promise(function(resolve) {
        setTimeout(resolve, 100);
      });
    })
    .then(function() {
      expect(requestAnimationFrame.calls.count()).toBeGreaterThan(1);
    })
    .then(function() {
      return ot.dispose();
    })
    ;
  });
});
