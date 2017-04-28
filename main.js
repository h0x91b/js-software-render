"use strict"

const width = 500, height = 500, depth = 255

let white = new TGAColor(255, 255, 255, 255)
let red = new TGAColor(255, 0, 0, 255)
let green = new TGAColor(0, 255, 0, 255)
let blue = new TGAColor(0, 0, 255, 255)
let model, image, scene, render
let lightDir = new Vec3f(0,0,-1)
let zBuffer = new Array(width * height)

main()

function main2() {
	//Scene
	scene = new TGAImage(width, height, TGAImage.RGB)
	
	line(new Vec2i(20, 34),   new Vec2i(744, 400), scene, red)
	line(new Vec2i(120, 434), new Vec2i(444, 400), scene, green)
	line(new Vec2i(330, 463), new Vec2i(594, 200), scene, blue)

	// screen line
	line(new Vec2i(10, 10), new Vec2i(790, 10), scene, white)

	scene.flip_vertically();
	
	//Render
	render = new TGAImage(width, 16, TGAImage.RGB)
	let yBuffer = new Array(width)
	for(let i=0;i<width;i++) {
		yBuffer[i] = Number.MIN_SAFE_INTEGER
	}
	
	rasterize(new Vec2i(20, 34),   new Vec2i(744, 400), render, red,   yBuffer)
	rasterize(new Vec2i(120, 434), new Vec2i(444, 400), render, green, yBuffer)
	rasterize(new Vec2i(330, 463), new Vec2i(594, 200), render, blue,  yBuffer)
	
	// 1-pixel wide image is bad for eyes, lets widen it
	for (let i=0; i<width; i++) {
		for (let j=1; j<16; j++) {
			render.set(i, j, render.get(i, 0));
		}
	}
	
	render.flip_vertically()
}

async function main() {
	image = new TGAImage(width, height, TGAImage.RGB)

	await drawModel()
	image.flip_vertically()
	// drawTriangles()
	
	render = new TGAImage(width, height, TGAImage.RGB)
	
	for (let i=0; i<width; i++) {
		for (let j=0; j<height; j++) {
			let c = zBuffer[i+j*width]
			render.set(i, j, new TGAColor(c, c, c, 255));
		}
	}
	render.flip_vertically()


	console.log('finish')
}

function rasterize(p0, p1, image, color, yBuffer) {
	if(p0.x > p1.x) {
		[p0, p1] = [p1, p0]
	}
	
	for(let x=p0.x; x<=p1.x; x++) {
		let t = (x-p0.x)/(p1.x-p0.x)
		let y = (p0.y*(1.-t) + p1.y*t + .5)|0
		if(yBuffer[x]<y) {
			yBuffer[x] = y
			image.set(x, 0, color)
		}
	}
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
	for(let i=0;i<width*height;i++) {
		zBuffer[i] = Number.MIN_SAFE_INTEGER
	}
	
	for(let i=0; i<model.nfaces(); i++) {
		let face = model.face(i)
		let screenCoords = Array(3)
		let worldCoords = Array(3)
		for(let j=0;j<3;j++) {
			let v = model.vert(face[j])
			screenCoords[j] = new Vec3f(
				(v.x+1.)*width/2.,
				(v.y+1.)*height/2.,
				(v.z+1.)*depth/2.
			).toI()
			worldCoords[j] = v
		}
		let n = new Vec3f(worldCoords[2].minus(worldCoords[0])).xor(worldCoords[1].minus(worldCoords[0]));
		n.normalize()
		let intensity = n.multiply(lightDir);
		if (intensity>0) {
			triangle(
				screenCoords[0],
				screenCoords[1],
				screenCoords[2],
				image,
				new TGAColor(intensity * 255, intensity * 255, intensity * 255, 255),
				zBuffer
			)
		}
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

function triangle(t0, t1, t2, image, color, zBuffer) {
	t0.toI(); t1.toI(); t2.toI();
	if(t0.y==t1.y && t0.y == t2.y) return
	if(t0.y>t1.y) [t0, t1] = [t1, t0];
	if(t0.y>t2.y) [t0, t2] = [t2, t0];
	if(t1.y>t2.y) [t1, t2] = [t2, t1];
	
	let totalHeight = t2.y - t0.y
	for(let i=0;i<totalHeight;i++) {
		const secondHalf = i>t1.y-t0.y || t1.y == t0.y
		let segmentHeight = secondHalf ? t2.y - t1.y : t1.y - t0.y
		let alpha = i/totalHeight
		let beta = (i - (secondHalf ? t1.y - t0.y : 0))/segmentHeight
		let A = t0.plus(t2.minus(t0).multiply(alpha)).toI()
		let B = (secondHalf ? t1.plus(t2.minus(t1).multiply(beta)) : t0.plus(t1.minus(t0).multiply(beta))).toI()
		if(A.x > B.x) {
			[A, B] = [B, A]
		}
		for(let j=A.x; j<=B.x; j++) {
			let phi = B.x === A.x ? 1. : (j-A.x)/(B.x-A.x)
			let P = A.plus( B.minus(A).multiply(phi) ).toI()
			const idx = P.y*width + P.x
			if(zBuffer[idx]<P.z) {
				zBuffer[idx] = P.z
				image.set(P.x, P.y, color)
			}
		}
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