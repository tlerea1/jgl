/**
 * JGL - A javascript Graphics Library.
 * Modeled after mgl (MATLAB graphics library)
 * 
 * Author - Tuvia Lerea
 * 
 */

/** Canvas to be drawn on must have id="canvas"
 * 
 */


//--------------------------Setup and Globals----------------------
// Screen object, holds a bunch of info about the screen and state of the canvas
var screen;
// mouse object, tracks mouse state
var mouse;
// The main off-screen canvas/context. 
var backCtx;
var backCanvas;
// The off-screen canvas/context that is used to combine the stencil and backCanvas
var stencilCanvas;
var stencilCtx;

function Screen() {	
	var c = document.getElementById("canvas");
	this.context = c.getContext("2d"); // main on-screen context
	this.height = $("#canvas").height(); // height of screen
	this.width = $("#canvas").width(); // width of screen
	this.stencils = []; // array of all stencil canvases
	this.drawingStencil = false; // Are you drawing a stencil?
	this.useStencil = false; // is a stencil in use?
	this.stencilSelected = 0; // if so, which?
	this.viewDistance = 24; // set to a default right now
	this.ppi = 0; // Pixels / Inch, gets set when jglOpen is called
	this.degPerPix = 0; // gets set in jglOpen
	this.pixPerDeg = 0; // gets set in jglOpen
	this.usingVisualAngles = false; // Is the drawing in visualAngles?
	this.usingVisualAnglesStencil = false; // Is the stencil using visualAngles?
}

function Mouse() {
	this.buttons = []; // [left, middle, right]
	this.x = 0; // x-coordinate
	this.y = 0; // y-coordinate
}

$(document).ready( function() {
	screen = new Screen();
	mouse = new Mouse();
	backCanvas = document.getElementById("backcanvas");
	backCanvas.width = screen.width;
	backCanvas.height = screen.height;
	backCtx = backCanvas.getContext("2d");
//	stencilCanvas = document.createElement('canvas');
	stencilCanvas = document.getElementById("stencilcanvas");
	stencilCanvas.width = screen.width;
	stencilCanvas.height = screen.height;
	stencilCtx = stencilCanvas.getContext("2d");
	
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

/**
 * Sets up the jgl screen.
 * @param resolution The ppi of the screen.
 */
function jglOpen(resolution) {
	screen.ppi = resolution;
	var inPerDeg = screen.viewDistance * (Math.tan(0.0174532925));
	screen.pixPerDeg = resolution * inPerDeg;
	screen.degPerPix = 1 / screen.pixPerDeg;

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
//		screen.context.save();

		screen.context.drawImage(backCanvas, 0, 0);//-((backCanvas.width * screen.pixPerDeg) - backCanvas.width) / 2, -((backCanvas.height * screen.pixPerDeg) - backCanvas.height) / 2);//, backCanvas.width * screen.pixPerDeg, backCanvas.height * screen.pixPerDeg);
//		screen.context.translate(screen.width / 2, screen.height / 2);
//		screen.context.scale(100, 100);
//		screen.context.restore();
		if (screen.usingVisualAngles) {
			backCtx.clearRect(-backCanvas.width / 2, -backCanvas.height / 2, backCanvas.width, backCanvas.height);
		} else {
			backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
		}
	} else {
		screen.context.clearRect(0,0,screen.width,screen.height);
		stencilCtx.drawImage(screen.stencils[screen.stencilSelected], 0, 0);
		stencilCtx.save();
		stencilCtx.globalCompositeOperation = "source-in";
		stencilCtx.drawImage(backCanvas, 0, 0);
		stencilCtx.restore();
		screen.context.drawImage(stencilCanvas, 0, 0);
		if (screen.usingVisualAngles) {
			backCtx.clearRect(-backCanvas.width / 2, -backCanvas.height / 2, backCanvas.width, backCanvas.height);
			stencilCtx.clearRect(0, 0, stencilCanvas.width, stencilCanvas.height);
		} else {
			stencilCtx.clearRect(0,0, stencilCanvas.width, stencilCanvas.height);
			backCtx.clearRect(0,0,backCanvas.width, backCanvas.height);
		}
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
		backCtx.beginPath();
		backCtx.moveTo(x0[i], y0[i]);
		backCtx.lineTo(x1[i], y1[i]);
		backCtx.stroke();
	}
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
 * with lineWidth = 1, width = 10, and black.
 * @param width the width of the cross
 * @param lineWidth the width of the lines of the cross
 * @param color the color in hex format
 * @param origin the center point in [x,y]
 */
function jglFixationCross(width, lineWidth, color, origin) {
	
	if (arguments.length == 0) {
		if (screen.usingVisualAngles) {
			width = 1;
			lineWidth = 0.1;
			color = "#000000";
			origin = [0 , 0];
		} else {
			width = 20;
			lineWidth = 1;
			color = "#000000";
			origin = [backCanvas.width / 2 , backCanvas.height / 2];
		}
		
	}
	backCtx.lineWidth = lineWidth;
	backCtx.strokeStyle = color;
	backCtx.beginPath();
	backCtx.moveTo(origin[0] - width / 2, origin[1]);
	backCtx.lineTo(origin[0] + width / 2, origin[1]);
	backCtx.stroke();
	backCtx.beginPath();
	backCtx.moveTo(origin[0], origin[1] - width / 2);
	backCtx.lineTo(origin[0], origin[1] + width / 2);
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

/**
 * Function to gain access to the mouse event listener.
 * @param mouseEventCallback the mouse down callback function. 
 * This function must take an event object as a parameter.
 */
function jglOnMouseClick(mouseEventCallback) {
	$(window).mouseDown(function(event) {
		mouseEventCallback(event);
	});
}

/**
 * Function to gain access to the key down event listener.
 * @param keyDownEventCallback the key down callback Function.
 * This function must take an event object as a parameter.
 */
function jglOnKeyDown(keyDownEventCallback) {
	$(window).keyDown(function(event) {
		keyDownEventCallback(event);
	});
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
	if (screen.usingVisualAngles) {
		backCtx.save();
		backCtx.translate(screen.width / 2, screen.height / 2);
		backCtx.transform(screen.pixPerDeg,0,0,screen.pixPerDeg, 0,0);
		screen.usingVisualAnglesStencil = true;

	}
	screen.drawingStencil = true;
}

/**
 * Ends the creation of a stencil.
 */
function jglStencilCreateEnd() {
	backCtx = backCanvas.getContext("2d");
	screen.drawingStencil = false;
//	if (screen.usingVisualAngles) {
//		jglVisualAngleCoordinates();
//	}
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
	screen.useStencil = false;
}

//----------------------Coordinate Functions---------------------------

/**
 * Function for changing to visual Angle Coordinates.
 * If this function is called while drawing a stencil, 
 * it does not effect the normal canvas. 
 */
function jglVisualAngleCoordinates() {
	if ((screen.usingVisualAngles && ! screen.drawingStencil) || 
			(screen.usingVisualAnglesStencil && screen.drawingStencil)) {
		//Error
		throw "VisualCoordinates: Already using visual coordinates";
	}
	backCtx.save();
	backCtx.translate(screen.width / 2, screen.height / 2);
	backCtx.transform(screen.pixPerDeg,0,0,screen.pixPerDeg, 0,0);
	if (! screen.drawingStencil) {
		screen.usingVisualAngles = true;
	} else {
		screen.usingVisualAnglesStencil = true;
	}
}

/**
 * Function for changing to screen coordinates.
 * If this function is called while drawing a stencil,
 * it does not effect the normal canvas.
 */
function jglScreenCoordinates() {
	if ((! screen.usingVisualAngles && ! screen.drawingStencil) || 
			(screen.drawingStencil && ! screen.usingVisualAnglesStencil)) {
		// Error
		throw "ScreenCoordinates: Already using screen coordinates";
	}
	backCtx.restore();
	if (! screen.drawingStencil) {
		screen.usingVisualAngles = false;
	} else {
		screen.usingVisualAnglesStencil = false;
	}
}

//--------------------------Texture Functions-----------------------------------

function jglMakeArray(low, step, high) {
	if (low < high) {
		var size = (high - low) / step;
		var array = new Array(size);
		array[0] = low;
		for (var i=1;i<array.length;i++) {
			array[i] = array[i-1] + step;
		}
		return array;
	} else if (low > high) {
		var size = (low - high) / step;
		var array = new Array(size);
		array[0] = low;
		for (var i=1;i<array.length;i++) {
			array[i] = array[i-1] - step;
		}
		return array;
	}
	return null;
}

function jglCreateTexture(array) {
	if (! $.isArray(array)) {
		return;
	}
	var image;
	if ( ! $.isArray(array[0])) {
		// 1D array passed in
		image = backCtx.createImageData(array.length, array.length);
		var counter = 0;
		for (var i=0;i<image.data.length;i += 4) {
			image.data[i + 0] = array[counter];
			image.data[i + 1] = array[counter];
			image.data[i + 2] = array[counter];
			image.data[i + 3] = 255;
			counter++;
			if (counter == array.length) {
				counter = 0;
			}
		}
		return image;
		
	} else if (! $.isArray(array[0][0])) {
		// 2D array passed in
		image = backCtx.createImageData(array.length, array.length);
		var row = 0;
		var col = 0;
		for (var i=0;i<image.data.length;i += 4) {
			image.data[i + 0] = array[row][col];
			image.data[i + 1] = array[row][col];
			image.data[i + 2] = array[row][col];
			image.data[i + 3] = 255;
			col++;
			if (col == array[row].length) {
				col = 0;
				row++;
			}
		}
		return image;
	
	} else {
		// TODO: All of the 3D stuff
		// 3D array passed in
		if (array[0][0].length == 3) {
			// RGB
			
		} else if(array[0][0].length == 4) {
			//RGB and Alpha
			
		} else {
			//Error
			
		}
	}
}

function jglBltTexture(texture, xpos, ypos, rotation) {
	var xcenter, ycenter;

	if (xpos === undefined) {
		if (screen.usingVisualAngles) {
			xpos = -texture.width * screen.degPerPix/2;
			xcenter = 0;
		} else {
			xpos = screen.width / 2 - texture.width/2;
			xcenter = screen.width / 2;
		}
	} else {
		xcenter = xpos;
		if (screen.usingVisualAngles) {
			xpos = xpos - (texture.width * screen.degPerPix) / 2;
		} else {
			xpos = xpos - texture.width / 2;
		}
	}
	if (ypos === undefined) {
		if (screen.usingVisualAngles) {
			ypos = texture.height * screen.degPerPix / 2;
			ycenter = 0;
		} else {
			ypos = screen.height / 2 - texture.height / 2
			ycenter = screen.height / 2;
		}
	} else {
		ycenter = ypos;
		if (screen.usingVisualAngles) {
			ypos = ypos + (texture.height * screen.degPerPix) / 2;
		} else {
			ypos = ypos - texture.height / 2;
		}
	}
	if (rotation === undefined) {
		rotation = 0;
	}
	var xtopLeft = (backCanvas.width / 2) + (xpos * screen.pixPerDeg);
	var ytopLeft = (backCanvas.height / 2) - (ypos * screen.pixPerDeg);
	
	if (rotation != 0) {
		var texCanvas = document.createElement('canvas');
		texCanvas.width = screen.width;
		texCanvas.height = screen.height;
		var texCtx = texCanvas.getContext("2d");
		if (screen.usingVisualAngles) {
			texCtx.putImageData(texture, xtopLeft, ytopLeft);
			backCtx.save();
			backCtx.translate(backCanvas.width / 2, backCanvas.height / 2);
			backCtx.rotate(rotation * 0.0174532925);
			backCtx.drawImage(texCanvas, -backCanvas.width / 2, -backCanvas.height / 2);
			backCtx.restore();
		} else {
			texCtx.putImageData(texture, xpos, ypos);

		backCtx.save();
		backCtx.translate(xcenter, ycenter);
		backCtx.rotate(rotation * 0.0174532925);
		backCtx.drawImage(texCanvas, -xcenter, -ycenter);
		backCtx.restore();
		}
		return;
	} else {
		if (screen.usingVisualAngles) {
			backCtx.putImageData(texture, xtopLeft, ytopLeft);
		} else {
			backCtx.putImageData(texture, xpos, ypos);
		}
	}

}



