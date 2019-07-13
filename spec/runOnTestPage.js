window.addEventListener("load", function() {
  var streamPromise = navigator.mediaDevices.getUserMedia({audio: true});
  var canvas = document.createElement("canvas");
  var b = document.body
  b.insertBefore(canvas, b.firstChild);
  var ot = new OscilloscopeTuner(streamPromise, canvas);
  ot.start();
  setTimeout(function() {
    ot.dispose();
  }, 10000);
});
