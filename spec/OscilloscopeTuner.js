describe("The oscilloscope tuner", function() {
  it("closes its AudioContext and setInterval", function(done) {
    var canvas = document.createElement("canvas");
    spyOn(window, "clearInterval").and.callThrough();
    var ot = new OscilloscopeTuner(canvas);
    ot.started.then(function() {
      expect(window.clearInterval).not.toHaveBeenCalled();
      expect(ot.audioContext.state).not.toBe("closed");
      return ot.dispose();
    }).then(function() {
      expect(ot.audioContext.state).toBe("closed");
      expect(window.clearInterval).toHaveBeenCalledWith(ot.setIntervalId);
      done();
    });
  });
});
