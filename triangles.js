$(document).ready(function init() {
  var canvas = document.getElementById('easel'),
  stage = new createjs.Stage(canvas),
  initial_triangle_size = 400,
  initial_triangle_x = 250,
  initial_triangle_y = 250,
  vertical_ratio = 0.866,
  rotation_speed = 400,
  baseTriangle;
  
  function createTriangle(size, x, y, upside_down) {
    var shape = new createjs.Shape(),
    g = shape.graphics,
    horizontal_offset = size / 2,
    vertical_offset = size * vertical_ratio / 3;

    shape.x = x;
    shape.y = y;
    shape.size = size;
    shape.upside_down = upside_down ? true : false;

    if (upside_down) {
      vertical_offset = vertical_offset * -1;
    }

    g.setStrokeStyle(1);
    g.beginStroke("black");
    
    g.moveTo(0, -2 * vertical_offset);
    g.lineTo(-1 * horizontal_offset, vertical_offset);
    g.lineTo(horizontal_offset, vertical_offset);
    g.lineTo(0, -2 * vertical_offset);

    return shape;
  }

  function remove_from_stage(child) {
    stage.removeChild(child);
  }

  function rotate(triangles) {
    $.each(triangles, function(k, v) {
      stage.addChild(v);
      var direction = !v.upside_down ? 1 : -1;
      createjs.Tween.get(v)
        .to({rotation: direction * 60}, rotation_speed);
      if (v.hasOwnProperty("children")){
        createjs.Tween.get(v)
                      .wait(rotation_speed * 2)
                      .call(rotate, [v.children]);
      }
    });
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

  function createSubTriangles(base, x, y, size, depth){
    base.children = [];
    var height = size * vertical_ratio;

    // top
    base.children.push(createTriangle(size, x, y - (height * 4 / 3)));
    // bottom-left
    base.children.push(createTriangle(size, x - size, y + (height * 2 / 3)));
    // bottom-right
    base.children.push(createTriangle(size, x + size, y + (height * 2 / 3)));
    // upside-down triangles
    // top-left
    base.children.push(createTriangle(size, x - size, y - (height * 2 / 3), true));
    // top-right
    base.children.push(createTriangle(size, x + size, y - (height * 2 / 3), true));
    // bottom
    base.children.push(createTriangle(size, x, y + (height * 4 / 3), true));

    // do we create sub triangles of the sub-triangles?
    if (depth < 3) {
      $.each(base.children,  function(i, t) {
        createSubTriangles(t, t.x, t.y, t.size / 3, depth + 1);
      });
    }
  }

  function setup() {
    // static triangle that never changes
    stage.addChild(createTriangle(initial_triangle_size, initial_triangle_x, initial_triangle_y));
    baseTriangle = createTriangle(initial_triangle_size, initial_triangle_x, initial_triangle_y);
    createSubTriangles(baseTriangle, initial_triangle_x, initial_triangle_y, initial_triangle_size / 3, 0);
    console.log(baseTriangle);
  }

  setup();
  // start the party
  rotate([baseTriangle]);
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);

})


