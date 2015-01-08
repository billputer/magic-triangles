$(document).ready(function init() {
  var canvas = document.getElementById('easel'),
  stage = new createjs.Stage(canvas),
  initial_triangle_size = 400,
  initial_triangle_x = 250,
  initial_triangle_y = 250,
  vertical_ratio = 0.866,
  rotation_speed = 400,
  levels = [],
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

  function remove_from_stage(child) {
    stage.removeChild(child);
  }

  function rotate(current_level_index) {
    var next_function, next_level;
    var current = levels[current_level_index];

    $.each(current, function(k, v) { stage.addChild(v); });
    $.each(current, function(k, v) {
      var direction = !v.upside_down ? 1 : -1;
      createjs.Tween.get(v)
        .to({rotation: direction * 60}, rotation_speed);
    });

    if(current_level_index + 1 == levels.length) {
      next_function = reset;
      next_level = current_level_index;
    }
    else {
      next_function = rotate;
      next_level = current_level_index + 1;
    }
    createjs.Tween.get(current[0])
                  .wait(rotation_speed * 2)
                  .call(next_function, [next_level]);
  }

  function reset(current_level_index) {
    var next_function, next_level;
    var current = levels[current_level_index];

    $.each(current, function(k, v) {
      createjs.Tween.get(v)
        .to({rotation: 0}, rotation_speed)
        .call(remove_from_stage, [v]);
    });

    if(current_level_index == 0) {
      next_function = rotate;
      next_level = current_level_index;
    }
    else {
      next_function = reset;
      next_level = current_level_index - 1;
    }

    createjs.Tween.get(current[0])
                  .wait(rotation_speed * 2)
                  .call(next_function, [next_level]);
  }

  function drawSubTriangles(x, y, size){
    var arr = [];
    var height = size * vertical_ratio;

    // top
    arr.push(createTriangle(size, x, y - (height * 4 / 3)));
    // bottom-left
    arr.push(createTriangle(size, x - size, y + (height * 2 / 3)));
    // bottom-right
    arr.push(createTriangle(size, x + size, y + (height * 2 / 3)));
    // upside-down triangles
    // top-left
    arr.push(createTriangle(size, x - size, y - (height * 2 / 3), true));
    // top-right
    arr.push(createTriangle(size, x + size, y - (height * 2 / 3), true));
    // bottom
    arr.push(createTriangle(size, x, y + (height * 4 / 3), true));
    return arr;
  }

  function setup() {
    // t1 setup
    // static triangle that never changes
    stage.addChild(createTriangle(initial_triangle_size, initial_triangle_x, initial_triangle_y));
    t1 = []
    t1.push(createTriangle(initial_triangle_size, initial_triangle_x, initial_triangle_y));

    // t2 setup
    t2 = drawSubTriangles(initial_triangle_x, initial_triangle_y, initial_triangle_size / 3);

    // levels array setup
    levels.push(t1);
    levels.push(t2);
    // levels.push(t3);
    // levels.push(t4);
    // levels.push(t5);
  }

  setup();
  // start the party
  rotate(0);
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);

})


