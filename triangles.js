$(document).ready(function init() {
  var canvas = document.getElementById('easel'),
  stage = new createjs.Stage(canvas),
  initial_triangle_size = 400,
  t2 = [];
  
  function drawTriangle(stage, size, x, y) {
    var shape = new createjs.Shape(),
    g = shape.graphics,
    horizontal_offset = size / 2,
    vertical_ratio = 0.866,
    vertical_offset = size * vertical_ratio / 3;
      
    g.setStrokeStyle(1);
    g.beginStroke("black");
    
    g.moveTo(0, -2 * vertical_offset);
    g.lineTo(-1 * horizontal_offset, vertical_offset);
    g.lineTo(horizontal_offset, vertical_offset);
    g.lineTo(0, -2 * vertical_offset);
    
    shape.x = x;
    shape.y = y;
    
    stage.addChild(shape);
    stage.update();
  
    return shape;
  }
  
  drawTriangle(stage, initial_triangle_size, 250, 250);
  t1 = drawTriangle(stage, initial_triangle_size, 250, 250);
  
  function t1_rotate() {
     createjs.Tween.get(t1).to({rotation: 60}, 500)
      .wait(500)
      .call(t2_rotate);
  }
  function t2_rotate() {
    t2.push(drawTriangle(stage, initial_triangle_size / 3, 250, 96));
    createjs.Tween.get(t2[0])
      .to({rotation: 60}, 500)
      .wait(500)
      .call(t2_reset);
  }
  function t2_reset() {
    createjs.Tween.get(t2[0])
      .to({rotation: 0}, 500)
      .call(t1_reset);
  }
  function t1_reset() {
    stage.removeChild(t2[0]);
    t2.splice(0, 1);
    createjs.Tween.get(t1)
      .wait(500)
      .to({rotation: 0}, 500)
      .wait(1000)
      .call(t1_rotate);
  }
  
  
  // start tweening
  t1_rotate();

  
  
  
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);

})


