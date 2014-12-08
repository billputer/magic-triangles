$(document).ready(function init() {
  var canvas = document.getElementById('easel'),
  stage = new createjs.Stage(canvas),
  initial_triangle_size = 400,
  initial_triangle_x = 250,
  initial_triangle_y = 250,
  vertical_ratio = 0.866,
  t1, t2, t3, t4, t5;
  
  function createTriangle(size, x, y, upside_down) {
    var shape = new createjs.Shape(),
    g = shape.graphics,
    horizontal_offset = size / 2,
    vertical_offset = size * vertical_ratio / 3;

    shape.x = x;
    shape.y = y;
    shape.upside_down = upside_down ? true : false;

    g.setStrokeStyle(1);
    g.beginStroke("black");
    
    if (shape.upside_down) {
      g.moveTo(0, 2 * vertical_offset);
      g.lineTo(-1 * horizontal_offset, -1 * vertical_offset);
      g.lineTo(horizontal_offset, -1 * vertical_offset);
      g.lineTo(0, 2 * vertical_offset);
    }
    else {
      g.moveTo(0, -2 * vertical_offset);
      g.lineTo(-1 * horizontal_offset, vertical_offset);
      g.lineTo(horizontal_offset, vertical_offset);
      g.lineTo(0, -2 * vertical_offset);
    }
    return shape;
  }
  
  // t1 setup
  // static triangle that never changes
  stage.addChild(createTriangle(initial_triangle_size, initial_triangle_x, initial_triangle_y));
  t1 = []
  t1.push(createTriangle(initial_triangle_size, initial_triangle_x, initial_triangle_y));

  // t2 setup
  t2 = [];
  var t2_size = initial_triangle_size / 3;
  var t2_height = initial_triangle_size * vertical_ratio / 3;
  // top
  t2.push(createTriangle(t2_size, initial_triangle_x, initial_triangle_y - (t2_height * 4 / 3)));
  // bottom-left
  t2.push(createTriangle(t2_size, initial_triangle_x - t2_size, initial_triangle_y + (t2_height * 2 / 3)));
  // bottom-right
  t2.push(createTriangle(t2_size, initial_triangle_x + t2_size, initial_triangle_y + (t2_height * 2 / 3)));
  // upside-down triangles
  // top-left
  t2.push(createTriangle(t2_size, initial_triangle_x - t2_size, initial_triangle_y - (t2_height * 2 / 3), true));
  // top-right
  t2.push(createTriangle(t2_size, initial_triangle_x + t2_size, initial_triangle_y - (t2_height * 2 / 3), true));
  // bottom
  t2.push(createTriangle(t2_size, initial_triangle_x, initial_triangle_y + (t2_height * 4 / 3), true));

  function remove_from_stage(child) {
    stage.removeChild(child);
  }

  function t1_rotate() {
    $.each(t1, function(k, v) { stage.addChild(v); });
    createjs.Tween.get(t1[0]).to({rotation: 60}, 500)
      .wait(500)
      .call(t2_rotate);
  }
  function t2_rotate() {
    $.each(t2, function(k, v) { stage.addChild(v); });
    $.each(t2, function(k, v) {
      var direction = !v.upside_down ? 1 : -1;
      createjs.Tween.get(v)
        .to({rotation: direction * 60}, 500);
    });
    createjs.Tween.get(t2[0]).wait(1000).call(t2_reset);
  }
  function t2_reset() {
    $.each(t2, function(k, v) {
      createjs.Tween.get(v)
        .to({rotation: 0}, 500)
        .call(remove_from_stage, [v]);
    });
    createjs.Tween.get(t2[0]).wait(1000).call(t1_reset);
  }
  function t1_reset() {
    createjs.Tween.get(t1[0])
      .to({rotation: 0}, 500)
      .wait(1000)
      .call(t1_rotate);
  }
  
  
  // start the party
  t1_rotate();
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);

})


