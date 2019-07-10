function OscilloscopeTuner(streamPromise, canvas) {
  this.streamPromise = streamPromise;
  this.canvas = canvas;
};

OscilloscopeTuner.prototype.start = function() {
  var that = this;
  return navigator.mediaDevices.getUserMedia({audio: true}).then(function(stream) {
    that.initAudioContext(stream);
    that.requestAnimationFrameId = requestAnimationFrame(function tick() {
      that.tick();
      that.requestAnimationFrameId = requestAnimationFrame(tick);
    });
  });
};

OscilloscopeTuner.prototype.initAudioContext = function(stream) {
  var ac = new AudioContext();
  var source = ac.createMediaStreamSource(stream);
  var analyser = ac.createAnalyser();
  source.connect(analyser);
  this.analyser = analyser;
  this.audioContext = ac;
};

OscilloscopeTuner.prototype.tick = function() {
  var data = new Float32Array(this.analyser.frequencyBinCount);
  this.analyser.getFloatTimeDomainData(data);
  var canvasContext = this.canvas.getContext("2d");
  canvasContext.moveTo(0, data[0]);
  canvasContext.lineTo(1, data[1]);
};

OscilloscopeTuner.prototype.dispose = function() {
  cancelAnimationFrame(this.requestAnimationFrameId);
  return this.audioContext.state != "closed" 
    ? this.audioContext.close()
    : Promise.resolve(); 
};
