/* globals Vue, systems, Vector2D */

(function() {
	
	let system = {
		hide: false,
		name: "Frog Queens",
		description: "they hop around, and from their hops create life",

		//=====================
		// tuning values

		hopStrength: 100,
    drag: 0.05,
    num: 1,
    childLifespan: 3,

		//=====================
		// events
		 
		setup(p, {}, activeSystems) {
      this.particles = [];
			for (var i = 0; i < this.num; i++) {
				this.createParticle(p);
			}
		},

		// Helper function
		createParticle(p) {
			// Set up a single particle
			let pt = new Vector2D(p.random(p.width), p.random(p.height));

			// Helpful: a link back to the rest of the particles
			pt.particles = this.particles
			// Helpful: a unique ID number
			pt.idNumber = this.particles.length
      
      // random color in pink range
      let dark = p.random(50, 65)
      pt.color = p.color(310, 100, dark);
      pt.leg_color = p.color(310, 100, dark - 5);
      
      pt.size = p.random(3, 4);
      
      // initial hop
      this.hop(p, pt);
      // causes some initial differation in timing
      pt.velocity.mult(p.random(0.2, 1));
      
      pt.child = false;

			this.particles.push(pt)
		},
    
    createChild(p, x, y) {
      console.log("creating child");
      let pt = new Vector2D(x, y);
      
      let dark = p.random(50, 65)
      pt.color = p.color(0, 100, dark);
      pt.leg_color = p.color(0, 100, dark - 5);
      
      pt.size = p.random(0.5, 0.8);
      
      this.childHop(p, pt);
      pt.velocity.mult(p.random(0.2, 1));
      
      pt.child = true;
      pt.lifespan = this.childLifespan;

			this.particles.push(pt);
    },
    
    // only movement
    childHop(p, pt) {
      let r = p.random(0.8 * this.hopStrength, 1.2 * this.hopStrength) * pt.size;
      pt.velocity = Vector2D.polar(r, p.random(2 * Math.PI));
    },
    
    hop(p, pt) {
      console.log("hop plus birth")
      let r = p.random(0.8 * this.hopStrength, 1.2 * this.hopStrength) * pt.size;
      pt.velocity = Vector2D.polar(r, p.random(2 * Math.PI));
      
      // birth
      for (let i = 0; i < 10; i++) {
        this.createChild(p, pt.x, pt.y);
      }
    },

		update(p, {deltaTime, time}) {
      // adjusting population
      let numParents = this.particles.filter(pt => !pt.child).length;
      
			for (var i = numParents; i < this.num; i++) {
				this.createParticle(p);
			}
      for (var i = this.num; i < numParents; i++) {
        let idx = this.particles.findIndex(pt => !pt.child);
        this.particles.splice(idx, 1);
      }
      
			this.particles = this.particles.filter(pt => !pt.child || pt.lifespan > 0);

			// apply velocity
			this.particles.forEach(pt => {
				pt.addMultiple(pt.velocity, deltaTime);
			});

			// Post movement
			this.particles.forEach(pt => {
				pt.velocity.mult(1 - this.drag);
        
        // once they slow down, hop again
        if (pt.velocity.magnitude < 5) {
          if (pt.child) {
            this.childHop(p, pt);
            pt.lifespan -= 1;
          } else {
            this.hop(p, pt);
          }
        }

        let border = pt.size * 12;
				pt.wrap(-border, -border, p.width + border, p.height + border);
			});
      
		},

		draw(p, {}) {
      // Drawing frogs
			this.particles.forEach(pt => {
        p.noStroke();
        const s = pt.size; // shorthand
        
        p.push();
        p.translate(pt.x, pt.y);
        p.rotate(pt.velocity.angle + (Math.PI / 2));
        
        // legs
        p.fill(pt.leg_color);
        p.push()
        p.rotate(0.4);
        p.ellipse(10 * s, 4 * s, 4 * s, 8 * s);
        p.pop();
        
        p.push()
        p.rotate(-0.4);
        p.ellipse(-10 * s, 4 * s, 4 * s, 8 * s);
        p.pop();
        
        // body
				p.fill(pt.color);
        p.ellipse(0, 0, 10 * s, 12 * s);
        
        // eyes
        p.fill(0, 100, 100); // white
        p.circle(-5 * s, -7 * s, 3 * s); 
        p.circle(5 * s, -7 * s, 3 * s); 
        
        p.fill(0, 100, 0); // black
        p.circle(-5 * s, -8 * s, 1.5 * s); 
        p.circle(5 * s, -8 * s, 1.5 * s); 
        
        p.pop();
			})

		}
	}

	/* 
	 * Controls for this system
	 */

	Vue.component(`controls-${system.name}`, {
		template: `<div>
      <div class="slider">
				<label>Number</label>
				<input 
					type="range" min="1" max="5" step="1"  
					v-model.number="system.num" />
			</div>
      <div class="slider">
				<label>Child lifespan</label>
				<input 
					type="range" min="1" max="10" step="1"  
					v-model.number="system.childLifespan" />
			</div>
    
			
		</div>`,
		data() {
			return {
				system
			}
		}
	})

	systems.push(system)
})();
