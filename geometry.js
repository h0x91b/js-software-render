"use strict";
(function(win){
	class Vec3f {
		constructor(x=0., y=0., z=0.) {
			if(x instanceof Vec3f) {
				this.x = x.x
				this.y = x.y
				this.z = x.z
			} else {
				this.x = x
				this.y = y
				this.z = z
			}
		}
		
		plus(V) {
			if(!(V instanceof Vec3f))
				throw new Error('Argument must be an instance of Vec3f')
			return new Vec3f(this.x + V.x, this.y + V.y, this.z + V.z)
		}
		
		minus(V) {
			if(!(V instanceof Vec3f))
				throw new Error('Argument must be an instance of Vec3f')
			return new Vec3f(this.x - V.x, this.y - V.y, this.z - V.z)
		}
		
		multiply(f) {
			if(f instanceof Vec3f) {
				return this.x * f.x + this.y * f.y + this.z * f.z
			}
			return new Vec3f(this.x * f, this.y * f, this.z *f)
		}
		
		xor(V) {
			if(!(V instanceof Vec3f))
				throw new Error('Argument must be an instance of Vec3f')
			return new Vec3f(
				this.y*V.z - this.z*V.y,
				this.z*V.x - this.x*V.z,
				this.x*V.y - this.y*V.x
			)
		}
		
		norm() {
			return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z)
		}
		
		normalize(l=1) {
			//Vec3<t> & normalize(t l=1) { *this = (*this)*(l/norm()); return *this; }
			let v = this.multiply(l/this.norm())
			this.x = v.x
			this.y = v.y
			this.z = v.z
			return this
		}
	}
	
	class Vec2i {
		constructor(x=0, y=0) {
			this.x = x|0
			this.y = y|0
		}
		
		plus(V) {
			if(!(V instanceof Vec2i))
				throw new Error('Argument must be an instance of Vec2i')
			return new Vec2i(this.x + V.x, this.y + V.y)
		}
		
		minus(V) {
			if(!(V instanceof Vec2i))
				throw new Error('Argument must be an instance of Vec2i')
			return new Vec2i(this.x - V.x, this.y - V.y)
		}
		
		multiply(f) {
			return new Vec2i(this.x * f, this.y * f)
		}
	}
		
	win.Vec3f = Vec3f
	win.Vec2i = Vec2i
})(window)