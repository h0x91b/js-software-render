"use strict"

let white = new TGAColor(255, 255, 255, 255)
let red = new TGAColor(255, 0, 0, 255)

main()

function main() {
	let image = new TGAImage(100, 100, TGAImage.RGB)
	image.set(52, 41, red)
	image.flip_vertically()
	console.log('finish')
}
