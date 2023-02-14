// settings
var dots_count = 200,
  dots_speed = 0.8,
  max_opacity = 0.7,
  max_line_length = 150,
  full_opacity_length = 1,
  line_width = 2,
  dots_radius = 4,
  color_dots = { r: 0, g: 0, b: 0, a: 1 },
  color_line = { r: 0, g: 0, b: 0, a: 1 };

window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

var canvas,
  ctx,
  mouse = {
    x: 0,
    y: 0,
  },
  dots_array = new Array();

class Dot {
  constructor(position, direction) {
    this.pos = position;
    this.dir = direction;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, dots_radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }
  update() {
    if (this.pos.x < 0 || this.pos.x > canvas.width) {
      this.dir.x = -this.dir.x;
    }
    if (this.pos.y < 0 || this.pos.y > canvas.height) {
      this.dir.y = -this.dir.y;
    }
    this.pos.x += this.dir.x * dots_speed;
    this.pos.y += this.dir.y * dots_speed;
  }
}

var updateNet = function () {
  for (let i = 0; i < dots_count; i++) {
    let firstDotPos = dots_array[i].pos;
    for (let j = i; j < dots_count; j++) {
      let secondDotPos = dots_array[j].pos;
      let dist = Math.sqrt(
        Math.pow(firstDotPos.x - secondDotPos.x, 2) +
          Math.pow(firstDotPos.y - secondDotPos.y, 2)
      );
      if (dist < max_line_length) {
        let opacity = 1 - dist / max_line_length;
        opacity *= max_opacity;
        ctx.strokeStyle =
          "rgba(" +
          color_line.r +
          "," +
          color_line.g +
          "," +
          color_line.b +
          "," +
          opacity +
          ")";
        ctx.beginPath();
        ctx.moveTo(firstDotPos.x, firstDotPos.y);
        ctx.lineTo(secondDotPos.x, secondDotPos.y);
        ctx.stroke();
      }
    }
  }
};

function start() {
  canvas.onmousemove = function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  };

  ctx.lineWidth = line_width;
  ctx.fillStyle =
    "rgba(" +
    color_dots.r +
    "," +
    color_dots.g +
    "," +
    color_dots.b +
    "," +
    color_dots.a +
    ")";

  for (let i = 0; i < dots_count; i++) {
    let position = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    };

    let angle = Math.random() * Math.PI * 2;
    let direction = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    dots_array[i] = new Dot(position, direction);
  }

  update();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots_array.forEach((el, i, arr) => {
    el.update();
    el.draw();
  });
  updateNet();
  requestAnimationFrame(update);
}

window.onload = function () {
  canvas = document.getElementById("animation");
  if (canvas.getContext) {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    ctx = canvas.getContext("2d");
    start();
  } else {
    console.log("[ERROR] Could not get canvas context");
  }
  canvas.parentElement.addEventListener("resize", () => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
  });
};
