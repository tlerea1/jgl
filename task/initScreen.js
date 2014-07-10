
/**
 * @constructor
 */
function Screen() {
	this.screenWidth = screen.width; // width in pixels
	this.screenHeight = screen.height; // height in pixels
	this.ppi; // pixels per inch
	this.data = {}; // some sort of data object TODO: more notes
	this.thisPhase; // current running phase
	this.htmlPages = []; // all html pages to be used
	this.psiTurk; // psiTurk object
	this.keyboard = jglGetKeys; // pointer to keyboard status function
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
	return screen;
	
}