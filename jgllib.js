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
		throw "Points2: Lengths dont match";
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
		throw "Lines2: Lengths dont match";
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
	if (x.length != y.length || size.length != 2) {
		//Error
		throw "Fill Oval: Lengths dont match";
	}
	var radius = Math.min(size[0], size[1]);
	backCtx.save();
	backCtx.transform(0, size[0], size[1],0,0,0);
	jglPoints2(x, y, radius, color);
	backCtx.restore();
}

/**
 * Makes Filled Rectangles
 * @param x an array of x coordinates of the centers
 * @param y an array of y coordinates of the centers
 * @param size [width,height] array
 * @param color color in hex format #000000
 */
function jglFillRect(x, y, size, color) {
	if (x.length != y.length || size.length != 2) {
		//Error
		throw "Fill Rect: Lengths dont match"
	}
	var upperLeft = {
			x:0,
			y:0
	};
	for (var i=0;i<x.length;i++) {
		backCtx.fillStyle = color;
		upperLeft.x = x[i] - (size[0] / 2);
		upperLeft.y = y[i] - (size[1] / 2);
		backCtx.fillRect(upperLeft.x, upperLeft.y, size[0], size[1]);
	}
}

/**
 * Draws a fixation cross onto the screen. 
 * If no params are given, cross defaults to center,
 * with lineWidth = 1, width = 10, and white.
 * @param width the width of the cross
 * @param lineWidth the width of the lines of the cross
 * @param color the color in hex format
 * @param origin the center point in [x,y]
 */
function jglFixationCross(width, lineWidth, color, origin) {
	if (arguments.length == 0) {
		width = 10;
		lineWidth = 1;
		color = "#FFFFFF";
		origin = [backCanvas.width / 2 , backCanvas.height / 2];
	}
	backCtx.lineWidth = lineWidth;
	backCtx.strokeStyle = color;
	backCtx.moveTo(origin[0] - width, origin[1]);
	backCtx.lineTo(origin[0] + width, origin[1]);
	backCtx.moveTo(origin[0], origin[1] - width);
	backCtx.lineTo(origin[0], origin[1] + width);
	backCtx.stroke();
}




