"use strict"

let white = new TGAColor(255, 255, 255, 255)
let red = new TGAColor(255, 0, 0, 255)
let model

main()

async function main(african_head) {
	let width = 500, height = 500
	let image = new TGAImage(width, height, TGAImage.RGB)
	
	let obj = await axios.get('obj/african_head.obj');
	model = new Model(obj.data)
	
	for(let i=0; i<model.nfaces(); i++) {
		let face = model.face(i)
		for(let j=0;j<3;j++) {
			let v0 = model.vert(face[j])
			let v1 = model.vert(face[(j+1)%3])
			
			let x0 = ((v0.x+1)*width/2)|0
			let y0 = ((v0.y+1)*height/2)|0
			let x1 = ((v1.x+1)*width/2)|0
			let y1 = ((v1.y+1)*height/2)|0
			
			line(x0, y0, x1, y1, image, white)
		}
	}
	
	image.flip_vertically()
	
	console.log('finish')
}

function line(x0, y0, x1, y1, image, color) {
	let steep = false
	
	if(Math.abs(x0-x1) < Math.abs(y0-y1)) {
		[x0, y0, x1, y1] = [y0, x0, y1, x1];
		steep = true
	}
	if(x0>x1) {
		[x0, x1, y0, y1] = [x1, x0, y1, y0];
	}
	
	let dx = x1-x0
	let dy = y1-y0
	let derror2 = Math.abs(dy)*2
	let error2 = 0
	let y = y0
	
	for(let x=x0;x<x1;x++) {
		if(steep)
			image.set(y, x, color)
		else
			image.set(x, y, color)
		error2 += derror2
		if(error2 > dx) {
			y += y1 > y0 ? 1 : -1
			error2 -= dx*2
		}
	}
}