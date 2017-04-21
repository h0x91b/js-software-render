"use strict";
(function(win){
	class Vec3f {
		constructor(x=0., y=0., z=0.) {
			this.x = x
			this.y = y
			this.z = z
		}
	}
	
	class Model {
		constructor(objFileContent) {
			this.verts = []
			this.faces = []
			
			objFileContent.split('\n').forEach((line)=>{
				if(line.indexOf('v ') === 0) {
					//verticies
					//v 0.608654 -0.568839 -0.416318
					let tmp = line.split(' ')
					this.verts.push(new Vec3f(parseFloat(tmp[1]), parseFloat(tmp[2]), parseFloat(tmp[3])))
				} else if(line.indexOf('f ') === 0) {
					//faces
					//f 1193/1240/1193 1180/1227/1180 1179/1226/1179
					//verts: #1193, #1180, #1179
					let tmp = line.split(' ')
					let face = [
						parseInt(tmp[1].split('/')[0]) - 1,
						parseInt(tmp[2].split('/')[0]) - 1,
						parseInt(tmp[3].split('/')[0]) - 1
					]
					this.faces.push(face)
				}
			})
		}
		
		nverts() {
			return this.verts.length
		}
		
		nfaces() {
			return this.faces.length
		}
		
		face(index) {
			return this.faces[index]
		}
		
		vert(index) {
			return this.verts[index]
		}
	}
	
	win.Model = Model
	win.Vec3f = Vec3f
})(window);