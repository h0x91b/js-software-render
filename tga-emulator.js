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
			this._ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
			this._ctx.fillRect(x|0, y|0, 1, 1)
		}
		
		get(x, y) {
			let imgData = this._ctx.getImageData(0, 0, this.width, this.height)
			const bytesPerPixel = 4
			const index = y * this.width * bytesPerPixel + x * bytesPerPixel
			return new TGAColor(
				imgData.data[index + 0],
				imgData.data[index + 1],
				imgData.data[index + 2],
				imgData.data[index + 3]
			)
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
