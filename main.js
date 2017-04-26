"use strict"

const width = 500, height = 500

let white = new TGAColor(255, 255, 255, 255)
let red = new TGAColor(255, 0, 0, 255)
let green = new TGAColor(0, 255, 0, 255)
let model, image

main()

async function main() {
	image = new TGAImage(width, height, TGAImage.RGB)
	
	await drawModel()
	// drawTriangles()
	
	image.flip_vertically()
	
	console.log('finish')
}

function drawTriangles() {
	let t0 = [new Vec2i(10, 70), new Vec2i(50, 160), new Vec2i(70, 80)]
	let t1 = [new Vec2i(180, 50), new Vec2i(150, 1), new Vec2i(70, 180)]
	let t2 = [new Vec2i(180, 150), new Vec2i(120, 160), new Vec2i(130, 180)]
	
	triangle(t0[0], t0[1], t0[2], image, red)
	triangle(t1[0], t1[1], t1[2], image, white)
	triangle(t2[0], t2[1], t2[2], image, green)
}

async function drawModel() {
	let obj = await axios.get('obj/african_head.obj');
	model = new Model(obj.data)
	
	for(let i=0; i<model.nfaces(); i++) {
		let face = model.face(i)
		let screenCoords = Array(3)
		for(let j=0;j<3;j++) {
			let worldCoords = model.vert(face[j])
			screenCoords[j] = new Vec2i(
				(worldCoords.x+1)*width/2,
				(worldCoords.y+1)*height/2,
			)
		}
		triangle(screenCoords[0], screenCoords[1], screenCoords[2], image, new TGAColor(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255))
	}
}

function line(v0, v1, image, color) {
	if(arguments.length !== 4) throw new Error("Wrong arguments length")
	if(!(v0 instanceof Vec2i && v1 instanceof Vec2i)) throw new Error('v0 or v1 is not instanceof Vec2i')
	let [x0, y0, x1, y1] = [v0.x, v0.y, v1.x, v1.y]
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

function triangleSimple(t0, t1, t2, image, color) {
	// line(t0, t1, image, color)
	// line(t2, t1, image, color)
	// line(t0, t2, image, color)
	
	const minX = Math.min(t0.x, t1.x, t2.x)
	const maxX = Math.max(t0.x, t1.x, t2.x)
	const minY = Math.min(t0.y, t1.y, t2.y)
	const maxY = Math.max(t0.y, t1.y, t2.y)
	
	for(let x=minX;x<maxX;x++) {
		for(let y=minY;y<maxY;y++) {
			if(!isPointInsideOfTriangle(new Vec2i(x, y), t0, t1, t2)) continue
			image.set(x, y, color)
		}
	}
}

function triangle(t0, t1, t2, image, color) {
	if(t0.y==t1.y && t0.y == t2.y) return
	if(t0.y>t1.y) [t0, t1] = [t1, t0];
	if(t0.y>t2.y) [t0, t2] = [t2, t0];
	if(t1.y>t2.y) [t1, t2] = [t2, t1];
	
	let totalHeight = t2.y - t0.y
	for(let i=0;i<totalHeight;i++) {
		const secondHalf = i>t1.y-t0.y || t1.y == t0.y
		let segmentHeight = secondHalf ? t2.y - t1.y + 1 : t1.y - t0.y
		let alpha = i/totalHeight
		let beta = (i - (secondHalf ? t1.y - t0.y:0))/segmentHeight
		let A = new Vec2i(t0.x + (t2.x-t0.x) * alpha, t0.y + (t2.y-t0.y) * alpha)
		let B = secondHalf ? new Vec2i(t1.x + (t2.x-t1.x) * beta, t1.y + (t2.y-t1.y) * beta) : new Vec2i(t0.x + (t1.x-t0.x) * beta, t0.y + (t1.y-t0.y) * beta)
		line(new Vec2i(A.x, t0.y + i), new Vec2i(B.x, t0.y + i), image, color)
	}
}

function isPointInsideOfTriangle(targetPoint, p1, p2, p3) {
	let b1, b2, b3
	
	b1 = sign(targetPoint, p1, p2) < 0.
	b2 = sign(targetPoint, p2, p3) < 0.
	b3 = sign(targetPoint, p3, p1) < 0.
	
	return ((b1 == b2) && (b2 == b3))
	
	function sign(p1, p2, p3) {
		return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
	}
}