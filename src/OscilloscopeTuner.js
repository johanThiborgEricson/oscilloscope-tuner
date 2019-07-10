function OscilloscopeTuner(streamPromise, canvas) {
  this.streamPromise = streamPromise;
  this.canvas = canvas;
};

OscilloscopeTuner.prototype.start = function() {
  var that = this;
  return this.streamPromise
  .then(function(stream) {
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
  this.pipe().draw(this.canvas);
};

OscilloscopeTuner.prototype.pipe = function() {
  var data = new Float32Array(this.analyser.frequencyBinCount);
  this.analyser.getFloatTimeDomainData(data);
  return new Line(0, 1, data);
};

OscilloscopeTuner.prototype.dispose = function() {
  cancelAnimationFrame(this.requestAnimationFrameId);
  var ac = this.audioContext;
  return ac && (ac.state != "closed")
    ? this.audioContext.close()
    : Promise.resolve(); 
};


function Line(firstX, lastX, data) {
  this.data = data;
}

Line.prototype.draw = function(canvas) {
  var canvasContext = canvas.getContext("2d");
  var w = canvas.width;
  var h = canvas.height;
  var first = true;
  for(var i = 0; i < this.data.length; i++){
    var x = w * i / (this.data.length - 1);
    var y = h * (1 - this.data[i]) / 2;
    if(first){
      first = false;
      canvasContext.moveTo(x, y);
    } else {
      canvasContext.lineTo(x, y);
    }
  }
  canvasContext.stroke();
};
