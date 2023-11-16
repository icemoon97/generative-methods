const WIDTH = 1000;
const HEIGHT = 600;
const DEFAULT_FRAME_RATE = 30;
const DEFAULT_LOOP_LENGTH_IN_FRAMES = 100;

const STARTING_COLOR0 = [160, 100, 50];
const STARTING_COLOR1 = [320, 100, 50];
const STARTING_BRUSH_SIZE = 1;

let brushes = [
  // Your brushes here!
  //======================================================

  //   TEMPLATE BRUSH
  {
    label: "template",
    hide: true,
    description: "A brush that does nothing",

    setup(p, settings) {},

    mouseDragged(p, { color0, color1, brushSize }) {},
  },

  // Web
  {
    label: "Web",
    hide: false,

    setup(p, settings) {
      this.points = [];
    },

    mousePressed(p, settings) {
      this.points = [];
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      let point = p.createVector(p.mouseX, p.mouseY);

      // point.add(p.random(-10, 10), p.random(-10, 10));

      this.points.push({
        pos: point,
        r: 1,
      });
    },

    draw(p, { color0, color1, brushSize }) {
      p.noFill();
      p.beginShape();
      this.points = this.points.filter((pt) => pt.r < 30);
      this.points.forEach((pt) => {
        p.stroke(0, 100, 100, 0.1);
        p.curveVertex(
          pt.pos.x + p.random(-pt.r, pt.r),
          pt.pos.y + p.random(-pt.r, pt.r)
        );
        pt.r += 0.5;
      });
      p.endShape();
    },
  },
  // Icicles
  {
    label: "Icicles",
    hide: false,

    setup(p, settings) {
      this.points = [];

      p.noStroke();
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      let current = p.createVector(p.mouseX, p.mouseY);

      if (this.prev === undefined) {
        this.prev = current;
        return;
      }

      let point = {
        pos: current.copy(),
        v: p.createVector(p.random(-2, 2), p.random(5, 15)),
      };
      this.points.push(point);

      this.prev = current;
    },

    mouseReleased(p, settings) {
      this.prev = undefined;
    },

    draw(p, { color0, color1, brushSize }) {
      this.points = this.points.filter((pt) => pt.v.mag() > 1);
      this.points.forEach((pt) => {
        let inter = pt.v.mag() / 25;
        let c = p.lerpColor(p.color(color0), p.color(color1), inter);
        p.fill(c);

        p.circle(pt.pos.x, pt.pos.y, pt.v.mag());

        pt.pos.add(pt.v);
        pt.v.mult(0.9);
      });
    },
  },
  // Flares
  {
    label: "Flares",
    hide: false,

    setup(p, settings) {
      this.points = [];

      p.noStroke();
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      let current = p.createVector(p.mouseX, p.mouseY);

      if (this.prev === undefined) {
        this.prev = current;
        return;
      }

      let point = {
        pos: current,
        v: current.copy().sub(this.prev),
        // v: p.createVector(p.random(-2, 2), p.random(5, 15)),
      };
      this.points.push(point);

      this.prev = current;
    },

    mouseReleased(p, settings) {
      this.prev = undefined;
    },

    draw(p, { color0, color1, brushSize }) {
      this.points = this.points.filter((pt) => pt.v.mag() > 1);
      this.points.forEach((pt) => {
        let inter = pt.v.mag() / 25;
        let c = p.lerpColor(p.color(color0), p.color(color1), inter);
        p.fill(c);

        p.circle(pt.pos.x, pt.pos.y, pt.v.mag());

        pt.pos.add(pt.v);
        pt.v.mult(0.9);
      });
    },
  },
  // Falling
  {
    label: "Falling",
    hide: false,
    description: "",

    setup(p, settings) {
      this.objs = [];

      p.noFill();
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      let current = p.createVector(p.mouseX, p.mouseY);

      if (this.prev === undefined) {
        this.prev = current;
        return;
      }

      let d = this.prev.copy().sub(current);

      let o = {
        pos: p.createVector(current.x, 0),
        v: p.createVector(0, current.y / 10),
        size: d.mag(),
      };
      this.objs.push(o);

      this.prev = current;
    },

    mouseReleased(p, settings) {
      this.prev = undefined;
    },

    draw(p, { color0, color1, brushSize }) {
      this.objs = this.objs.filter((o) => o.v.mag() > 1);
      this.objs.forEach((o) => {
        let alpha = 1 - Math.sqrt(o.v.mag()) / 5;
        p.stroke(0, 100, 50, alpha);
        p.rect(o.pos.x, o.pos.y, o.size, o.size);

        o.pos.add(o.v);
        o.v.mult(0.9);
      });
    },
  },
  // Basic
  {
    label: "Basic",
    hide: false,
    description: "",

    setup(p, settings) {
      p.noStroke();
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      let current = p.createVector(p.mouseX, p.mouseY);

      if (this.prev === undefined) {
        this.prev = current;
        return;
      }

      let d = this.prev.sub(current);

      let inter = Math.sqrt(d.mag()) / 10;
      let c = p.lerpColor(p.color(color0), p.color(color1), inter);
      p.fill(c);

      p.rect(current.x, current.y, d.x * 1.5, d.y * 1.5);

      this.prev = current;
    },

    mouseReleased(p, settings) {
      this.prev = undefined;
    },
  },

  //======================================================
  {
    label: "🕳",
    show: false,
    description: "Eraser",

    setup(p, settings) {
      p.background(0, 0, 0, 1);
      //       When the user clicks erase, what happens?
    },

    mouseDragged(p, settings) {
      //       When the user drags erase, what happens?
    },
  },

  //======================================================
];
