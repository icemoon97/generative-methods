/* globals Vue, WIDTH, HEIGHT, p5 */

const WIDTH = 800;
const HEIGHT = 500;
let systems = [];

function drawBackground(p, {}) {
	p.background(50);
}

document.addEventListener("DOMContentLoaded", (event) => {
	console.log("DOM fully loaded and parsed");

	new Vue({
		template: `
    <div id="app">
      <div class="canvas-holder">
        <div ref="p5"></div>
        <div class="tools">
					<label><input type="checkbox" v-model="settings.drawDebugInfo" />Draw Debug</label>

          <div class="system-select">
            <button v-for="system in displaySystems" :class="{active:system.isActive}" @click="toggleSystem(system)">
              {{system.name}}
            </button>
          </div>

					<!-- show controls for the current active systems -->
					<div class="system-controls-panel">
						<div v-for="system in activeSystems" class="system-controls">
							<div class="system-controls-title">
								<label>{{system.name}}</label>
								<label>Controls</label>
							</div>
							<div>
								<component :is="'controls-' + system.name" />
							</div>
						</div>
					</div>

        </div>
      </div>
    </div>`,

		mounted() {
			// Create the P5 element
			new p5(p => {
				// Save p to the Vue element, so we have access in other methods
				this.p = p
					// We have a new "p" object representing the sketch
				p.frameRate(30)

				p.setup = () => {
					p.createCanvas(WIDTH,HEIGHT)
					p.colorMode(p.HSL)
					p.ellipseMode(p.RADIUS)

					// Add mousePos and mouseVelocity
					p.mousePos = new Vector2D()
					p.mouseVelocity = new Vector2D()

					console.log("Setting up starting systems", this.activeSystems.map(a => a.name))
					this.activeSystems.forEach(s => s.setup(p, this.settings, this.activeSystems))
				}

				

				p.draw = () => {
					this.settings.time = p.millis()*.001
					let dt = p.constrain(p.deltaTime*.001, .01, 1) // dont' simulate more than a second at a time
					this.settings.deltaTime = dt

					drawBackground(p, this.settings)
					
					// Calculate current mouse pos and velocity
					p.mousePos.setTo(p.mouseX, p.mouseY)
					p.mouseVelocity.lerpTo({x:p.movedX/dt,y:p.movedY/dt}, .2)


					if (!this.isPaused) {
						this.activeSystems.forEach(s => s.update(p, this.settings))
					}
					this.activeSystems.forEach(s => s.draw(p, this.settings))
				}


				p.mousePressed = () => {
					this.activeSystems.forEach(s => s.mousePressed?.())
				}
				p.mouseReleased = () => {
				 	this.activeSystems.forEach(s => s.mouseReleased?.())
				}
				p.mouseDragged = () => {
					this.activeSystems.forEach(s => s.mouseDragged?.())
				}
				p.mouseClicked = () => {
					this.activeSystems.forEach(s => s.mouseClicked?.())
				}

				p.keyTyped = (ev) => {
					// Control pausing
					if (ev.key === " ")
						this.isPaused = !this.isPaused;

					this.activeSystems.forEach(s => s.keyTyped?.(ev.key));
				}

			}, this.$refs.p5)

		},

		computed: {
			displaySystems() {
				return this.systems.filter(sys => !sys.hide)
			},
			activeSystems() {
				return this.systems.filter(sys => sys.isActive)
			}
		},

		methods: {
			toggleSystem(sys) {
				sys.isActive = !sys.isActive
				if (sys.isActive) {
					console.log("activate system: ", sys.name, " - ", sys.description)
					sys.setup(this.p, this.settings, this.activeSystems)
				}
				// Save to local storage so it persists between reloads
				localStorage.setItem("active-" + sys.name, sys.isActive)
			}
		},

		data() {

			// Set all systems to inactive or the last value
			systems.forEach(sys => {
				let val = localStorage.getItem("active-" + sys.name)
				val = val === null?true:JSON.parse(val)
				
				Vue.set(sys, "isActive", val)
			})

			return {
				settings: {
					drawDebugInfo: true,
					deltaTime:0.1,
					time:0
				},
				isPaused: false,
				systems,
			}
		}, 

		el: "#app"
	})
})