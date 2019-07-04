function OscilloscopeTuner(canvas) {
  var that = this;
  this.started = navigator.mediaDevices.getUserMedia({audio: true}).then(function() {
    that.audioContext = new AudioContext();
    that.requestAnimationFrameId = requestAnimationFrame(function tick() {
      that.requestAnimationFrameId = requestAnimationFrame(tick);
    });
  });
};

OscilloscopeTuner.prototype.dispose = function() {
  cancelAnimationFrame(this.requestAnimationFrameId);
  return this.audioContext.close();
};
