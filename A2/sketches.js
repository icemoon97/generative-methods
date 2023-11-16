const WIDTH = 300;
const HEIGHT = 300;
const DEFAULT_FRAME_RATE = 30;
const DEFAULT_LOOP_LENGTH_IN_FRAMES = 100;

// Three useful functions for animations
function pingpong(t) {
  // Return a number from 0 to 1
  // t=0 => 0
  // t=.5 => 1
  // t=1 => 0
  return 1 - Math.abs(((t * 2) % 2) - 1);
}

function pingpongEased(t) {
  // Same as pingpong, but it eases in and out
  return 0.5 - 0.5 * Math.cos(2 * t * Math.PI);
}

function ease(t) {
  // Ease just from 0 to 1 (the first half of pingpong)
  return 0.5 - 0.5 * Math.cos(t * Math.PI);
}

// =================================================
const sketches = [
  {
    name: "Pulsing Squares",
    show: true,

    setup(p) {
      p.background(0, 0, 0);
      p.rectMode(p.CENTER);
    },

    draw(p) {
      p.background(0, 0, 0, 0.05);

      let t = p.millis() * 0.0002;

      let hue = (t * 50) % 360;
      p.strokeWeight(5);
      p.stroke(hue, 100, 20);
      p.fill(hue, 100, 50);

      let centerX = p.width / 2;
      let centerY = p.height / 2;
      let r = pingpongEased(t) * 250 + 25;

      // let circleRadius = Math.random() * 40 + 20;
      let circleRadius = 10 + r / 5;
      let x = (Math.random() - 0.5) * r + centerX;
      let y = (Math.random() - 0.5) * r + centerY;

      p.rect(x, y, circleRadius, circleRadius);
    },
  },
  {
    name: "Morphing Quadrilateral",
    show: true,

    v: [],
    dv: [],

    setup(p) {
      p.strokeWeight(3);

      // initalizing polygon positions
      const margin = 25;
      this.v.push(p.createVector(margin, margin));
      this.v.push(p.createVector(WIDTH - margin, margin));
      this.v.push(p.createVector(WIDTH - margin, HEIGHT - margin));
      this.v.push(p.createVector(margin, HEIGHT - margin));

      // random velocity for each point
      const speed = 5;
      for (let i = 0; i < this.v.length; i++) {
        this.dv.push(
          p.createVector(
            (Math.random() - 0.5) * speed,
            (Math.random() - 0.5) * speed
          )
        );
      }
    },

    draw(p) {
      p.background(0, 0, 0, 0.05);

      let t = p.millis() * 0.0001;
      p.stroke(0, 100, pingpong(t) * 100);

      p.beginShape();
      for (let i = 0; i < this.v.length; i++) {
        // applying velocity
        this.v[i].add(this.dv[i]);
        // bouncing on edge
        if (this.v[i].x < 0 || this.v[i].x > WIDTH) {
          this.dv[i].mult(-1, 1);
        }
        if (this.v[i].y < 0 || this.v[i].y > HEIGHT) {
          this.dv[i].mult(1, -1);
        }

        let point = this.v[i];
        p.vertex(point.x, point.y);
      }
      // need to add first vertex again so stroke is complete
      p.vertex(this.v[0].x, this.v[0].y);
      p.endShape();
    },
  },
  {
    name: "Growing Tree (perfect loop)",
    show: true,
    loopLength: 600,

    branch: function (p, len, theta, depth) {
      if (depth >= 9) {
        return;
      }

      // each branch is 1/2 the previous length
      len *= 0.65;

      let angles = [-theta, theta];
      angles.forEach((a) => {
        p.push();
        p.rotate(a);
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
        this.branch(p, len, theta, depth + 1);
        p.pop();
      });
    },

    setup(p) {
      p.stroke(0, 100, 100);
      p.strokeWeight(2);
    },

    draw(p) {
      p.background(0, 100, 0);

      // let t = p.millis() * 0.0001;
      let t = p.frameCount / this.loopLength;
      let initial = 10 + 100 * pingpong(t);

      let theta = (Math.PI / 180) * (60 * pingpongEased(t * 8));

      p.translate(WIDTH / 2, HEIGHT);
      p.line(0, 0, 0, -initial);
      p.translate(0, -initial);
      this.branch(p, initial, theta, 0);
    },
  },
  {
    name: "Rainbow Wave",
    show: true,

    yoff: 0.0,

    setup(p) {
      p.background(0, 100, 100);
      p.stroke(0, 100, 0);
    },

    draw(p) {
      // p.background(0, 100, 100, 0.1);

      let xoff = 0;
      let colWidth = 4;

      for (let x = 0; x <= WIDTH; x += colWidth) {
        let y = p.map(p.noise(xoff, this.yoff), 0, 1, 0, HEIGHT / 2);
        p.fill(y, 100, 50);
        p.rect(x, y, colWidth, HEIGHT - 2 * y);

        xoff += 0.02;
      }

      this.yoff += 0.04;
    },
  },
  {
    name: "Noisy Numbers",
    show: true,

    yoff: 0.0,

    setup(p) {
      p.textSize(12);
      p.textAlign(p.CENTER, p.CENTER);
    },

    draw(p) {
      p.background(0);

      let xoff = 0;
      let colWidth = 10;

      for (let x = 0; x <= WIDTH; x += colWidth) {
        for (let y = 0; y <= HEIGHT; y += colWidth) {
          let yhat = this.yoff + y / HEIGHT / 10;
          let raw = p.noise(xoff, yhat);
          let c = p.map(raw, 0, 1, 0, 100);
          p.fill(c, 100, 50);
          // rect(x, y, colWidth, colWidth);
          p.text(p.char(p.unchar("1") + p.map(raw, 0.1, 0.9, 0, 10)), x, y);
        }

        xoff += 0.01;
      }

      this.yoff += 0.005;
    },
  },
  {
    name: "hmmmm",
    description: "",
    show: true,
    loopLength: 180,

    states: ["🤨", "😶‍🌫️", "😤", "😴", "🫠", "🤓"],

    setup(p) {
      p.textAlign(p.CENTER, p.CENTER);
      p.fill(0, 100, 100);
    },

    draw(p) {
      p.background(0);

      let t = p.frameCount % this.loopLength;
      let sIndex = Math.floor(t / (this.loopLength / this.states.length));

      p.textSize(60);
      p.text(this.states[sIndex], WIDTH / 2, HEIGHT / 2);

      // drawing spiral
      p.textSize(20);
      for (let a = 0; a < 360 * 2; a += 10) {
        let angle = a - t * 12;
        angle *= Math.PI / 180; // convert to radians
        let dist = 50 + a / 5;

        // p.ellipse(Math.cos(angle) * dist + WIDTH / 2, Math.sin(angle) * dist + HEIGHT / 2, 10, 10);
        let c = p.unchar("a") + Math.floor(p.random(1, 26));
        p.text(
          p.char(c),
          Math.cos(angle) * dist + WIDTH / 2,
          Math.sin(angle) * dist + HEIGHT / 2
        );
      }
    },
  },

  // template
  {
    name: "empty sketch",
    show: false,
    description: "an empty container for you to copy",
    setup(p) {},

    draw(p) {},
  },
];
