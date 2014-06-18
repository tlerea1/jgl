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


//--------------------------Setup and Globals----------------------
var screen;
var mouse;
var backCtx;
var backCanvas;
var stencilCanvas;
var stencilCtx;

function Screen() {	
	var c = document.getElementById("canvas");
//	var div = document.createElement("div");
//	div.setAttribute("width", "1in");
	this.context = c.getContext("2d");
	this.height = $("#canvas").height();
	this.width = $("#canvas").width();
	this.stencils = [];
	this.useStencil = false;
	this.stencilSelected = 0;
//	this.screenWidth = (window.screen.width / window.devicePixelRatio) * (1/ 96.0);
//	this.screenHeight = (window.screen.height / window.devicePixelRatio) * (1/ 96.0);
//	this.viewDistance = java.awt.Toolkit.getDefaultToolkit().getScreenResolution();
//	this.viewDistance = document.size.ppi();
}

function Mouse() {
	this.buttons = [];
	this.x = 0;
	this.y = 0;
}

$(document).ready( function() {
	screen = new Screen();
	mouse = new Mouse();
	backCanvas = document.createElement('canvas');
	backCanvas.width = screen.width;
	backCanvas.height = screen.height;
	backCtx = backCanvas.getContext("2d");
	stencilCanvas = document.createElement('canvas');
	stencilCanvas.width = screen.width;
	stencilCanvas.height = screen.height;
	stencilCtx = stencilCanvas.getContext("2d");
	$("body").append("<div id=\"inchBox\" style=\"width: 1in\"></div>");
	screen.viewDistance = $("#inchBox").width();
	
	// The following three events track the mouse
	// while it is inside the window.
	// The mouse.buttons array is a logical array, 1 means pressed
	$(window).mousemove(function(event){
		mouse.x = event.pageX;
		mouse.y = event.pageY;
	});
	$(window).mousedown(function(event){
		var button = event.which;
		mouse.buttons[button - 1] = 1;
	});
	$(window).mouseup(function(event) {
		var button = event.which;
		mouse.buttons[button - 1] = 0;
	});
});

//----------------------Main Screen Functions--------------------

function jglOpen() {

}

function jglClose() {
	
}

/**
 * Draws the off-screen canvas to the on-screen one. 
 * Operates in discrete frames, meaning that each draw
 * draws all the elements to the screen at once. If a stencil
 * is selected works with the backCanvas and stencilCanvas to maintain
 * discrete frames, read Stencil Comment for more information.
 */
function jglFlush() {
	//screen.context.restore();

//	screen.context.stroke();
	if (! screen.useStencil) {
		screen.context.clearRect(0,0,screen.width,screen.height);
		screen.context.drawImage(backCanvas, 0, 0);
		backCtx.clearRect(0,0, backCanvas.width, backCanvas.height);
	} else {
		screen.context.clearRect(0,0,screen.width,screen.height);
		stencilCtx.drawImage(screen.stencils[screen.stencilSelected], 0, 0);
		stencilCtx.save();
		stencilCtx.globalCompositeOperation = "source-in";
		stencilCtx.drawImage(backCanvas, 0, 0);
		stencilCtx.restore();
		screen.context.drawImage(stencilCanvas, 0, 0);
		stencilCtx.clearRect(0,0, stencilCanvas.width, stencilCanvas.height);
	}

}


//-------------------Drawing Different Shapes-------------------

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
	backCtx.stroke();
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

/**
 * Function for drawing a polygon.
 * The x and y params lay out a set of points.
 * @param x the x coordinates
 * @param y the y coordinates
 * @param color the color, in hex format #000000
 */
function jglPolygon(x, y, color) {
	if (x.length != y.length || x.length < 3) {
		// Error, need at least three points to
		// make a polygon.
		throw "Polygon arrays not same length";
	}
	backCtx.fillStyle = color;
	backCtx.strokeStyle = color;
	backCtx.beginPath();
	backCtx.moveTo(x[0], y[0]);
	for (var i=1;i<x.length;i++) {
		backCtx.lineTo(x[i], y[i]);
	}
	backCtx.closePath();
	backCtx.fill();
//	backCtx.stroke();
}


//----------------Timing Functions

/**
 * Gets the current seconds since Jan 1st 1970.
 * @return Returns the seconds value;
 */
function jglGetSecs() {
	var d = new Date();
	return d.getTime() / 1000;
}

/**
 * Waits the given number of seconds.
 * @param secs the number of seconds to wait.
 */
function jglWaitSecs(secs) {
	var first, second;
	first = new Date();
	var current = first.getTime();
	do {
		second = new Date();
	} while (Date.now() < current + (secs * 1000));
}

//-----------------------Text Functions------------------------

function jglTextSet(fontName, fontSize, fontColor, fontBold, fontItalic) {
	var fontString = "";
	if (fontBold == 1) {
		fontString = fontString.concat("bold ");
	}
	
	if (fontItalic == 1) {
		fontString = fontString.concat("italic ");
	}
	
//	if (fontUnderline == 1) {
//		fontString = fontString.concat("underline ");
//	}
//	
//	if (fontStrikeThrough == 1) {
//		fontString = fontString.concat("line-through ");
//	} 
	fontString = fontString.concat(fontSize, "px ", fontName);
	backCtx.font = fontString;
	backCtx.fillStyle = fontColor;
}

/**
 * Draws the given text starting at (x, y)
 * @param text the text to be drawn
 * @param x the x coordinate of the beginning of the text
 * @param y the y coordinate of the beginning of the text
 */
function jglTextDraw(text, x, y) {
	backCtx.fillText(text, x, y);
}


//------------------------Keyboard and Mouse functions ---------------------

/**
 * A function for getting information about the mouse.
 * @return A Mouse object, contains x, y, and buttons 
 * fields. buttons is a logical array, 1 means that button
 * is pressed.
 */
function jglGetMouse() {
	return mouse;
}



//-----------------------Stencil Functions----------------------------
/*
 * A Note on how stencils work:
 * Stencils must be used in the following flow:
 * createBegin(i)
 * Drawing functions...
 * createEnd
 * select(i)
 * drawing functions...
 * flush
 * 
 * Stencils work by creating a new off-screen canvas on which to draw.
 * The drawing functions called between createBegin and createEnd draw
 * to that off-screen canvas, not the main off-screen canvas. When 
 * createEnd is called, all following draw functions draw to the normal
 * off-screen canvas. When select is called screen.useStencil is set to 
 * true and the stencilNumber is remembered. The big change happens in
 * flush. If a stencil is being used, flush behaves quite differently. 
 * flush first draws the stencil to a third off-screen canvas, stencilCanvas,
 * then draws the backCanvas to stencilCanvas with stencil mode enabled, 
 * and then finally draws stencilCanvas to the on-screen canvas. This is 
 * done so that only the final image is ever drawn to the screen, and it
 * is drawn all at once. This makes sure that flush ensures discrete frames.
 *  
 */

/**
 * Starts the creation of a stencil with the given number.
 * @param stencilNumber the number of the stencil about to be created.
 */
function jglStencilCreateBegin(stencilNumber) {
	var canvas = document.createElement('canvas');
	canvas.width = screen.width;
	canvas.height = screen.height;
	screen.stencils[stencilNumber] = canvas;
	backCtx = canvas.getContext("2d");
}

/**
 * Ends the creation of a stencil.
 */
function jglStencilCreateEnd() {
	backCtx = backCanvas.getContext("2d");
}

/**
 * Selects the stencil with the given number.
 * @param stencilNumber the number of the stencil to select.
 * @throw Number too large if the number given is greater than the number of stencils.
 * @throw No stencil if the number does not correspond to a stencil.
 */
function jglStencilSelect(stencilNumber) {
	if (stencilNumber >= screen.stencils.length) {
		//Error
		throw "StencilSelect: Number too large";
	}
	if (screen.stencils[stencilNumber] == null) {
		// TODO: Not sure if javaScript works like that, need to check
		throw "StencilSelect: No Stencil with that number";
	}
	
	screen.useStencil = true;
	screen.stencilSelected = stencilNumber;
}

/**
 * Deselects the selected stencil, this will cause flush to act as normal.
 */
function jglStencilDeselect() {
	screen.usStencil = false;
}



