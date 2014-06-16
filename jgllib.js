/**
 * JGL - A javascript psycophysics library.
 * Modeled after mgl (MATLAB library)
 * 
 * Author - Tuvia Lerea
 * 
 */

/** Canvas to be drawn on must have id="canvas"
 * 
 */

var screen;
var backCtx;
var backCanvas;

function Screen() {	
	var c = document.getElementById("canvas");
	this.context = c.getContext("2d");
	this.height = $("#canvas").height();
	this.width = $("#canvas").width();
}

$(document).ready( function() {
	screen = new Screen();
	backCanvas = document.createElement('canvas');
	backCanvas.width = screen.width;
	backCanvas.height = screen.height;
	backCtx = backCanvas.getContext("2d");
});

function jglOpen() {

}

function jglClose() {
	
}

function jglFlush() {
	//screen.context.restore();

//	screen.context.stroke();
	screen.context.clearRect(0,0,screen.width,screen.height);
	screen.context.drawImage(backCanvas, 0, 0);
	backCtx.clearRect(0,0, backCanvas.width, backCanvas.height);

}


/**
 * Function for drawing 2D points.
 * @param x array of x coordinates
 * @param y array of y coordinates
 * @param size Size of point in pixels(diameter)
 * @param color Color of points in #hex format
 */
function jglPoints2(x, y, size, color) {
	if (x.length != y.length) {
		// Error
		return;
	}
	for (var i=0;i<x.length;i++) {
		backCtx.fillStyle=color;
		backCtx.beginPath();
		backCtx.arc(x[i], y[i], size/2, 0, 2*Math.PI);
		backCtx.fill();
		backCtx.closePath();
	}
	//screen.context.save();
}

/**
 * Function for drawing 2D Lines
 * @param x0 array of starting x coordinates
 * @param y0 array of starting y coordinates
 * @param x1 array of ending x coordinates
 * @param y1 array of ending y coordinates
 * @param size width of line in pixels
 * @param color in hex format "#000000"
 */
function jglLines2(x0, y0, x1, y1, size, color) {
	if (x0.length != y0.length || x1.length != y1.length || x0.length != x1.length) {
		//Error
		return;
	}
	for (var i=0;i<x0.length;i++) {
		backCtx.lineWidth = size;
		backCtx.strokeStyle=color;
		backCtx.moveTo(x0[i], y0[i]);
		backCtx.lineTo(x1[i], y1[i]);
	}
	//screen.context.save();
}

function jglFillOval(x, y, size, color) {
	if (x.length != y.length) {
		//Error
		return;
	}
	var radius = Math.min(size[0], size[1]);
	backCtx.save();
	backCtx.transform(0, size[0], size[1],0,0,0);
	jglPoints2(x, y, radius, color);
	backCtx.restore();
}


