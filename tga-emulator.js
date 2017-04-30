"use strict";
(function(win){
	const TGA_RGB = 1
	class TGAImage {
		constructor(width, height, mode) {
			this.width = width
			this.height = height
			this.mode = mode
			this._canvas = null
			this._ctx = null
			this._createCanvas()
			this._pixel = this._ctx.createImageData(1,1)
		}
		
		_createCanvas() {
			let canvas = document.createElement('canvas')
			canvas.width = this.width
			canvas.height = this.height
			document.querySelector('#wrap').appendChild(canvas)
			this._canvas = canvas
			let ctx = canvas.getContext('2d')
			this._ctx = ctx
			ctx.fillStyle = 'rgb(0,0,0)'
			ctx.fillRect(0, 0, this.width, this.height)
		}
		
		set(x, y, color) {
			// this._ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
			// this._ctx.fillRect(x|0, y|0, 1, 1)
			
			let d  = this._pixel.data;
			d[0] = color.r;
			d[1] = color.g;
			d[2] = color.b;
			d[3] = color.a;
			this._ctx.putImageData( this._pixel, x, y );
		}
		
		get(x, y) {
			if(x > this.width || y > this.height) throw new Error('outbound')
			let imgData = this._ctx.getImageData(x, y, 1, 1);
			return new TGAColor(imgData.data[0], imgData.data[1], imgData.data[2], imgData.data[3])
		}
		
		flip_vertically() {
			let imgData = this._ctx.getImageData(0, 0, this.width, this.height)
			const bytesPerPixel = 4
			const half = this.height >> 1
			const bytesPerLine = this.width * bytesPerPixel
			for(let line=0;line<half;line++) {
				for(let b=0;b<bytesPerPixel*this.width;b++) {
					const locationOfByte1 = line*bytesPerLine+b
					const locationOfByte2 = (this.height-line-1)*bytesPerLine+b
					const byte1 = imgData.data[locationOfByte1]
					imgData.data[locationOfByte1] = imgData.data[locationOfByte2]
					imgData.data[locationOfByte2] = byte1
				}
			}
			this._ctx.putImageData(imgData, 0, 0)
		}
	
		static get RGB() {
			return TGA_RGB
		}
		
		async loadImage(src) {
			console.log('loadImage', src)
			return new Promise((resolve, reject)=>{
				let img = new Image()
				img.onload = () => {
					console.log('image loaded')
					this._ctx.drawImage(img, 0, 0, this.width, this.height)
					resolve()
				}
				img.onerror = (err, ...args) => {
					console.log('error on image load', err, args)
					reject(err)
				}
				img.src = src
			})
		}
	}
	
	class TGAColor {
		constructor(r, g, b, a) {
			this.r = Math.min(Math.max(r|0, 0), 255)
			this.g = Math.min(Math.max(g|0, 0), 255)
			this.b = Math.min(Math.max(b|0, 0), 255)
			this.a = Math.min(Math.max(a|0, 0), 255)
		}
	}
	
	win.TGAImage = TGAImage
	win.TGAColor = TGAColor
})(window)
