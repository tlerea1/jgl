
/**
 * Screen object for myscreen.
 * @constructor
 */
function Screen() {
	this.screenWidth = screen.width; // width in pixels
	this.screenHeight = screen.height; // height in pixels
	this.ppi; // pixels per inch
	this.data = {}; // some sort of data object TODO: more notes
	this.events = {};
	this.thisPhase; // current running phase
	this.htmlPages = []; // all html pages to be used
	this.psiTurk; // psiTurk object
	this.keyboard = {};
	this.keyboard.state = jglGetKeys; // pointer to keyboard status function
	this.keyboard.backtick = '`';
	this.mouse = jglGetMouse; // pointer to mouse status function
	this.assignmentID; // assignmentID given by turk
	this.hitID; // hitID given by turk
	this.workerID; // workerID given by turk
	this.startTime = jglGetSecs(); // start time, used for random state
	this.numTasks = 0; // number of tasks
}

/**
 * Private function to get URL parameters
 * @returns an array of the params from the URL
 */
function getURLParams() {
	var args = location.search;
	if (args.length > 0) {
		args = args.substring(1);
		return args.split('&');
	} else {
		return [];
	}
}

/**
 * Setups up screen object
 * @returns the setup screen object
 */
function initScreen() {
	var screen = new Screen();
	var params = getURLParams();
	if (! isEmpty(params)) {
		screen.assignmentID = params[0].substring(params[0].indexOf('='));
		screen.hitID = params[1].substring(params[1].indexOf('='));
		screen.workerID = params[2].substring(params[2].indexOf('='));
	} else {
		console.error("init Screen: could not get assignmentID, hitID, or workerID");
	}
	
	screen.userHitEsc = 0;
	
	var size = 4096;
	
//	screen.events.n = 0;
//	screen.events.tracenum = zeros(size);
//	screen.events.data = zeros(size);
//	screen.events.ticknum = zeros(size);
//	screen.events.volnum = zeros(size);
//	screen.events.time = zeros(size);
//	screen.events.force = zeros(size);
//	
//	screen.traceNames = [];
//	screen.traceNames[0] = 'volume';
//	screen.traceNames[1] = 'segmentTime';
//	screen.traceNames[2] = 'responseTime';
//	screen.traceNames[3] = 'taskPhase';
//	screen.traceNames[4] = 'fixationTask';
//	
//	screen.numTraces = 5;
	
	screen.tick = 0;
	screen.totaltick = 0;
	screen.totalflip = 0;
//	screen.volnum = 0;
	screen.intick = 0;
	screen.fliptime = Infinity;
	screen.dropcount = 0;
	screen.checkForDroppedFrames = 1;
	screen.dropThreshold = 1.05;
	screen.ppi = 127;
	screen.flushMode = 0;
	
	screen.framesPerSecond = jglGetParam('frameRate');
	screen.frametime = 1 / screen.framesPerSecond;
	
	window.segTimeout = [];
	window.drawInterval = null;
	window.tnum = 0;
	
	return screen;
	
}