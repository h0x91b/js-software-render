"use strict";
(function(win){
	class Model {
		constructor(objFileContent) {
			this.verts = []
			this.faces = []
			this.uvs = []
			this.normals = []
			
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
					let uv = [
						parseInt(tmp[1].split('/')[1]) - 1,
						parseInt(tmp[2].split('/')[1]) - 1,
						parseInt(tmp[3].split('/')[1]) - 1
					]
					let normal = [
						parseInt(tmp[1].split('/')[2]) - 1,
						parseInt(tmp[2].split('/')[2]) - 1,
						parseInt(tmp[3].split('/')[2]) - 1
					]
					this.faces.push({
						verts: face,
						uvs: uv,
						normals: normal
					})
				} else if(line.indexOf('vt  ') === 0) {
					//texture coords
					let tmp = line.split(' ')
					this.uvs.push(new Vec2f(parseFloat(tmp[2]), parseFloat(tmp[3])))
				} else if(line.indexOf('vn  ') === 0) {
					//texture coords
					let tmp = line.split(' ')
					this.normals.push(new Vec2f(parseFloat(tmp[2]), parseFloat(tmp[3])))
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
})(window);