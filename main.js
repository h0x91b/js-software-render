"use strict"

let white = new TGAColor(255, 255, 255, 255)
let red = new TGAColor(255, 0, 0, 255)

main()

function main() {
	let image = new TGAImage(100, 100, TGAImage.RGB)
	image.set(52, 41, red)
	
	line(13, 20, 80, 40, image, white);
	line(20, 13, 40, 80, image, red);
	line(80, 40, 13, 20, image, red);
	
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
	let derror = dy/dx
	let error = 0
	let y = y0
	
	for(let x=x0;x<x1;x++) {
		if(steep)
			image.set(y, x, color)
		else
			image.set(x, y, color)
		error += derror
		if(error>.5) {
			y += y1 > y0 ? 1 : -1
			error -= 1
		}
	}
}