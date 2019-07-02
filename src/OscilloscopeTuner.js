function OscilloscopeTuner(canvas) {
  var that = this;
  this.started = navigator.mediaDevices.getUserMedia({audio: true}).then(function() {
    that.audioContext = new AudioContext();
    that.setIntervalId = setInterval(function(){}, 1000);
  });
};

OscilloscopeTuner.prototype.dispose = function() {
  clearInterval(this.setIntervalId);
  return this.audioContext.close();
};
