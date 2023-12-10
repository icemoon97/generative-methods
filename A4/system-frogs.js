/* globals Vue, systems, Vector2D */

(function() {
	
	let system = {
		hide: false,
		name: "Frogs",
		description: "they hop around",

		//=====================
		// tuning values

		hopStrength: 50,
    drag: 0.05,
    num: 20,

		//=====================
		// events
		 
		setup(p, {}) {
      
			this.particles = [];
			for (var i = 0; i < this.num; i++) {
				this.createParticle(p);
			}
		},

		createParticle(p) {
			let pt = new Vector2D(p.random(p.width), p.random(p.height));

			// Helpful: a link back to the rest of the particles
			pt.particles = this.particles
			// Helpful: a unique ID number
			pt.idNumber = this.particles.length
      
      // random color in green range
      let dark = p.random(30, 45)
      pt.color = p.color(120, 100, dark);
      pt.leg_color = p.color(120, 100, dark - 3);
      
      pt.size = p.random(0.8, 2);
      
      // initial hop
      this.hop(p, pt);
      // causes some initial differation in timing
      pt.velocity.mult(p.random(0.2, 1));

			this.particles.push(pt)
		},
    
    // helper for frogs, makes them move in a random direction
    hop(p, pt) {
      let r = p.random(0.8 * this.hopStrength, 1.2 * this.hopStrength) * pt.size;
      pt.velocity = Vector2D.polar(r, p.random(2 * Math.PI));
    },

		update(p, {deltaTime, time}) {
      // adjusting population
      for (var i = this.particles.length; i < this.num; i++) {
				this.createParticle(p);
			}
      if (this.particles.length > this.num) {
        this.particles = this.particles.slice(0, this.num);
      }

			// apply velocity
			this.particles.forEach(pt => {
				pt.addMultiple(pt.velocity, deltaTime);
			});

			// Post movement
			this.particles.forEach(pt => {
				pt.velocity.mult(1 - this.drag);
        
        // once they slow down, hop again
        if (pt.velocity.magnitude < 5) {
          this.hop(p, pt);
        }

        let border = pt.size * 10;
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
					type="range" min="5" max="200" step="1"  
					v-model.number="system.num" />
			</div>
    
			<div class="slider">
				<label>Hop Strength</label>
				<input 
					type="range" min="20" max="200" step="1"  
					v-model.number="system.hopStrength" />
			</div>
      
      <div class="slider">
				<label>Drag</label>
				<input 
					type="range" min="0" max="0.5" step="0.01"  
					v-model.number="system.drag" />
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
