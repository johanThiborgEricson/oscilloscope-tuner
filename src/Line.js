function Line(leftmostX, rightmostX, data) {
  this.data = data;
  this.leftmostX = leftmostX;
  this.rightmostX = rightmostX;
}

Line.prototype.draw = function(canvas) {
  var canvasContext = canvas.getContext("2d");
  var w = canvas.width;
  var h = canvas.height;
  var first = true;
  var l = this.leftmostX;
  var r = this.rightmostX;
  for(var i = 0; i < this.data.length; i++){
    // TODO: Use transforms instead
    var iNorm = i / (this.data.length - 1);
    var xNorm = (iNorm * (r - l)) + l;
    var x = w * xNorm;
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
