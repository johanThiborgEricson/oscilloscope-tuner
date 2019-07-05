function OscilloscopeTuner(canvas) {

};

OscilloscopeTuner.prototype.start = function() {
  var that = this;
  return navigator.mediaDevices.getUserMedia({audio: true}).then(function() {
    that.audioContext = new AudioContext();
    that.requestAnimationFrameId = requestAnimationFrame(function tick() {
      that.requestAnimationFrameId = requestAnimationFrame(tick);
    });
  });
};

OscilloscopeTuner.prototype.dispose = function() {
  cancelAnimationFrame(this.requestAnimationFrameId);
  return this.audioContext.state != "closed" 
    ? this.audioContext.close()
    : Promise.resolve(); 
};
