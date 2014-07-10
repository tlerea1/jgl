/**
 * Things that need to be at the beginning of the concatenated file.
 */

//$.getScript("/scripts/jgllib.js");

function upper(array) {
	var tempArray = [];
	for (var i = 0;i<array.length;i++) {
		tempArray.push(array[i].toUpperCase());
	}
	return tempArray;
}

function fields(object) {
	var tempArray = [];
	var i = 0;
	for (var field in object) {
		if (object.hasOwnProperty(field)) {
			tempArray[i++] = field;
		}
	}
	return tempArray;
}

function zeros(length) {
	var tempArray = new Array(length);
	for (var i=0;i<tempArray.length;i++) {
		tempArray[i] = 0;
	}
	return tempArray;
}

function ones(length) {
	var tempArray = new Array(length);
	for (var i=0;i<length;i++) {
		tempArray[i] = 1;
	}
	return tempArray;
}

function arrayPad(array, endLength, padVal) {
	while (array.length < endLength) {
		array.push(padVal);
	}
	return array;
}

function fillArray(value, length) {
	var tempArray = new Array(length);
	for (var i=0;i<length;i++) {
		tempArray[i] = value;
	}
	return tempArray;
}

function sum(array) {
	var sum = 0;
	for (var i=0;i<array.length;i++) {
		sum += array[i];
	}
	return sum;
}

function cumsum(array) {
	if (array.length == 0) {
		return [];
	}
	var sum = array[0];
	for (var i=0;i<array.length;i++) {
		sum += array[i];
		array[i] = sum;
	}
	return array;
}

function isEmpty(array) {
	if (array === undefined) {
		return true;
	}
	if ($.isArray(array)) {
		return array.length == 0;
	}
	console.log("isEmpty: used with non-array");
	return false;
}

function any(array) {
	for (var i =0; i< array.length;i++) {
		if (array[i] != 0) {
			return true;
		}
	}
	return false;
}

function numel(array) {
	var count = 0;
	for (var i=0;i<array.length;i++) {
		if (array[i] != undefined) {
			count++;
		}
	}
	return count;
}

function strcmp(string, array) {
	var tempArray = zeros(array.length);
	for (var i=0;i<array.length;i++) {
		if (string.localeCompare(array[i]) == 0) {
			tempArray[i] = 1;
		}
	}
	return tempArray;
}

function diff(array) {
	var tempArray = new Array(array.length - 1);
	for (var i = 1;i<array.length;i++) {
		tempArray[i-1] = array[i] - array[i-1];
	}
	return tempArray;
}
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
	
}/**
 * @constructor
 */
function Phase() {
	this.verbose;
	this.parameter;
	this.seglen;
	this.segmin;
	this.segmax;
	this.segquant;
	this.segdur;
	this.segprob;
	this.segnames;
	this.seglenPrecompute;
	this.seglenPrecomputeSettings;
	this.writeTrace;
	this.getResponse;
	this.numBlocks;
	this.numTrials;
	this.timeInTicks;
	this.segmentTrace;
	this.responseTrace;
	this.phaseTrace;
	this.private;
	this.randVars;
	this.thisblock;
}

/**
 * @constructor
 */
function Trial() {
	this.thisseg;
}

function initTask(task, myscreen, startSegmentCallback,
		screenUpdateCallback, trialResponseCallback,
		startTrialCallback, endTrialCallback, 
		startBlockCallback, randCallback) {
	
	var knownFieldNames = ['verbose', 
	                   'parameter', 
	                   'seglen',
	                   'segmin', 
	                   'segmax', 
	                   'segquant', 
	                   'segdur',
	                   'segprob',
	                   'segnames', 
	                   'seglenPrecompute',
	                   'seglenPrecomputeSettings',
	                   'synchToVol', 
	                   'writeTrace', 
	                   'getResponse', 
	                   'numBlocks', 
	                   'numTrials', 
	                   'waitForBacktick', 
	                   'random', 
	                   'timeInTicks', 
	                   'timeInVols', 
	                   'segmentTrace', 
	                   'responseTrace', 
	                   'phaseTrace', 
	                   'parameterCode', 
	                   'private', 
	                   'randVars', 
	                   'fudgeLastVolume', 
	                   'collectEyeData',
	                   'data'
	            ];
	
	if (! task.hasOwnProperty("verbose")) {
		task.verbose = 1;
	}
	var taskFieldNames = fields(task);
	
	
	for (var i = 0; i < taskFieldNames.length;i++) {
		var upperMatch = upper(knownFieldNames).indexOf(taskFieldNames[i].toUpperCase());
		var match = knownFieldNames.indexOf(taskFieldNames[i]);
		if (upperMatch > -1 && match == -1) {
			console.error('initTask: task.' + taskFieldNames[i] + ' is miscappatilized, changing to task.' + knownFieldNames[upperMatch]);
			var value = task[taskFieldNames[i]];
			delete task[taskFieldNames[i]];
			task[knownFieldNames[upperMatch]] = value;
		} else if (upperMatch < 0) {
			console.error('initTaks: unknown task field task.' + taskFieldNames[i]);
		}
	}
	
	if (! task.hasOwnProperty("parameter")) {
		task.parameter = {};
		task.parameter.default = 1;
	}
	
	task.blocknum = 0;
	task.thistrial = new Trial();
	task.thistrial.thisseg = Infinity;
	
	if (task.hasOwnProperty("seglenPrecompute") && typeof task.seglenPrecompute === "object") {
		task = seglenPrecomputeValidate(task);
	} else {
		if (task.hasOwnProperty("seglen")) {
			if (task.hasOwnProperty("segmin") || task.hasOwnProperty("segmax")) {
				console.error("init Task: Found both seglen field and segmin/segmax. using seglen");
			}
			task.segmin = task.seglen;
			task.segmax = task.seglen;
		}
		if (! task.hasOwnProperty("segmin") || ! task.hasOwnProperty("segmax")) {
			console.error("init Task: Must specify task.segmin and task.segmax");
			throw "init Task"; // TODO: Should get input from user maybe?
		}
		
		if (! task.hasOwnProperty("segquant")) {
			task.segquant = zeros(task.segmin.length);
		} else if (task.segquant.length < task.segmin.length) {
			task.segquant = arrayPad(task.segquant, task.segmin.length, 0);
		}
		
		if (! task.hasOwnProperty("synchToVol")) {
			task.synchToVol = zeros(task.segmin.length);
		} else if (task.synchToVol.length < task.segmin.length) {
			task.synchToVol = arrayPad(task.synchToVol, task.segmin.length, 0);
		}
		
		if (! task.hasOwnProperty("segdur") || task.segdur.length < task.segmin.length) {
			task.segdur = [];
			task.segdur[task.segmin.length - 1] = [];
		} else if (task.segdur.length > task.segmin.length) {
			task.segmin = arrayPad(task.segmin, task.segdur.length, NaN);
			task.segmax = arrayPad(task.segmax, task.segdur.length, NaN);
			if (task.segquant.length < task.segmin.length) {
				task.segquant = arrayPad(task.segquant,task.segmin.length,0);
			}
			if (task.synchToVol.length < task.segmin.length) {
				task.synchToVol = arrayPad(task.synchToVol,task.segmin.length,0);
			}
		}
		
		if (! task.hasOwnProperty("segprob") || task.segprob.length < task.segmin.length) {
			task.segprob = [];
			task.segprob[task.segmin.length - 1] = [];
		}
		
		for (var i=0;i<task.segmin.length;i++) {
			if (! isEmpty(task.segdur[i])) {
				if (isEmpty(task.segprob[i])) {
					task.segprob[i] = fillArray(1 / task.segdur[i].length, task.segdur[i].length);
				} else if (task.segprob[i].length != task.segdur[i].length) {
					console.error("init Task: segprob and segdur for segment: " + i + " must have the same length");
					throw "init Task";
				} else if (Math.round(10000 * sum(task.segprob[i])) / 10000.0 != 1) {
					console.error("init Task: segprob for segment: " + i + " must add to one");
					throw "init Task";
				}
				
				task.segmin[i] = NaN;
				task.segmax[i] = NaN;
				
				task.segprob[i] = cumsum(task.segprob[i]);
				task.segprob[i] = [0].concat(task.segprob[i].slice(0, task.segprob[i].length - 1));
			} else if (! isEmpty(task.segprob[i])) {
				console.error("init Task: Non-empty segprob for empty segdur for seg: " + i);
				throw "init Task";
			} else if (isNaN(task.segmin[i])) {
				console.error("init Task: Segmin is nan without a segdur for seg: " + i);
				throw "init Task";
			}
		}
		
		for (var i = 0; i<task.segquant.length;i++) {
			if (task.segquant[i] != 0) {
				if (isEmpty(task.segdur[i])) {
					task.segdur[i] = jglMakeArray(task.segmin[i], task.segquant[i], task.segmax[i]);
					task.segprob[i] = cumsum(fillArray(1 / task.segdur[i].length, task.segdur[i].length));
					task.segprob[i] = [0].concat(task.segprob[i].slice(0,task.segprob[i].length - 1));
					task.segquant[i] = 0;
					task.segmin[i] = NaN;
					task.segmax[i] = NaN;
				}
			}
		}
		
		task.numsegs = task.segmin.length;
		
		if (task.segmin.length != task.segmax.length) {
			throw "init Task: task.segmin and task.segmax not of same length";
		}
		var difference = jQuery.map(task.segmax, function (n, i) {
			if (n - task.segmin[i] < 0)
				return 1;
			return 0;
		});
		if (any(difference)) {
			throw "init Task: task.segmin not smaller than task.segmax";
		}
		if (task.hasOwnProperty("segnames")) {
			if (numel(task.segnames) != task.numsegs) {
				console.error("init Task: task.segnames does not match the number of segments");
			} else {
				for (var i=0;i<task.segnames.length;i++) {
					// TODO: did not understand MATLAB code
				}
			}
		}
	}
	
	if (! task.hasOwnProperty("timeInTicks")) {
		task.timeInTicks = 0;
	}
	
	if (! task.hasOwnProperty("timeInVols")) {
		task.timeInVols = 0;
	}
	
	if (task.timeInTicks && task.timeInVols) {
		console.error("init Task: Time is both in ticks and vols, setting to vols");
		task.timeInTicks = 0;
	}
	//TODO :
//	var randTypes = ["block", "uniform", "calculated"];
//	
//	if (typeof task.randVars != "object") {}
//		task.randVars = {};
//	}
//	task.randVars.n_ = 0;
//	task.randVars.calculated_n_ = 0;
//	
//	if (! task.randVars.hasOwnProperty("len_")) {
//		if (task.hasOwnProperty("numTrials") && task.numTrials > -1) {
//			task.randVars.len_ = Math.max(task.numTrials, 250);
//		} else {
//			task.randVars.len_ = 250;
//		}
//	}
//	
//	var randVarNames = fields(task.randVars);
//	var originalNames = [], shortNames = [];
//	for (var i=0;i<randVarNames.length;i++) {
//		if (any(strcmp(randVarNames[i], randTypes))) {
//			var vars = {};
//			var thisRandVar = [];
//			var thisIsCell;
//			
//			if (! $.isArray(task.randVars[randVarNames[i]])) {
//				thisRandVar[1] = task.randVars[randVarNames[i]];
//				thisIsCell = false;
//			} else {
//				thisRandVar[0] = task.randVars[randVarNames[i]];
//				thisIsCell = true;
//			}
//			
//			for (var i=0;i<thisRandVar.length;i++) {
//				var varBlock = [], totalTrials = 0;
//				for (var vnum = 0;vnum<vars.n_;i++) {
//					if (thisIsCell) {
//						shortNames[shortNames.length] = vars.names_[vnum];
//					}
//				}
//			}
//		}
//	}
	
	if (! task.hasOwnProperty("getResponse")) {
		task.getResponse = [];
	}
	task.getResponse = arrayPad(task.getResponse, task.numsegs, 0);
	
	if (! task.hasOwnProperty("numBlocks")) {
		task.numBlocks = Infinity;
	}
	
	if (! task.hasOwnProperty("numTrials")) {
		task.numTrials = Infinity;
	}
	
	if (! task.hasOwnProperty("waitForBacktick")) {
		task.waitForBacktick = 0;
	}
	
	if (! task.hasOwnProperty("random")) {
		task.random = 0;
	}
	
	task.parameter.doRandom_ = task.random;
	
	task.trialnum = 1;
	task.trialnumTotal = 0;
	
	myscreen.numTasks += 1;
	task.taskID = myscreen.numTasks;
	
	if (! task.hasOwnProperty("data")) {
		task.data = {};
		task.data.events = {};
		task.data.events.mouse = [];
		task.data.events.keyboard = [];
		task.data.trace = {};
		task.data.trace.mouse = [];
		task.data.trace.keyboard = [];
	}
	
	if (! task.hasOwnProperty("callback")) {
		task.callback = {};
	}
	
	if (startSegmentCallback != undefined && jQuery.isFunction(startSegmentCallback)) {
		task.callback.startSegment = startSegmentCallback;
	}
	
	if (trialResponseCallback != undefined && jQuery.isFunction(trialResponseCallback)) {
		task.callback.trialResponse = trialResponseCallback;
	}
	
	if (screenUpdateCallback != undefined && jQuery.isFunction(screenUpdataCallback)) {
		task.callback.screenUpdate = screenUpdateCallback;
	}
	
	if (endTrialCallback != undefined && jQuery.isFunction(endTrialCallback)) {
		task.callback.endTrial = endTrialCallback;
	}
	
	if (startTrialCallback != undefined && jQuery.isFunction(startTrialCallback)) {
		task.callback.startTrial = startTrialCallback;
	}
	
	if (startBlockCallback != undefined && jQuery.isFunction(startBlockCallback)) {
		task.callback.startBlock = startBlockCallback;
	}
	
	if (randCallback != undefined && jQuery.isFunction(randCallback)) {
		task.callback.rand = randCallback;
	} else {
		//TODO: didnt get line 496
	}
	
	//TODO: skipped line 510
	
	if (task.hasOwnProperty("seglenPrecompute")) {
		if (typeof task.seglenPrecompute != "object") {
			task = seglenPrecompute(task);
		}
	} else {
		task.seglenPrecompute = false;
	}
	
	task.thistrial = {};
	task.timeDiscrepancy = 0;
	
	if (! task.hasOwnProperty("fudgeLastVolume")) {
		task.fudgeLastVolume = 0;
	}
	
	//TODO: didnt setup randstate stuff
	
}

function seglenPrecompute(task) {
	task.seglenPrecompute = {};
	if (! task.hasOwnProperty("seglenPrecomputeSettings")) {
		task.seglenPrecomputeSettings = {};
	}

	var settingsDefaults = [
	                        {key: "synchWaitBeforeTime", value: 0.1},
	                        {key: "verbose", value: 1},
	                        {key: "averageLen", value: []},
	                        {key: "numTrials", value: []},
	                        {key: "maxTries", value: 500},
	                        {key: "idealDiffFromIdeal", value: []}
	                        ];

	for (var i=0;i<settingsDefaults.length;i++) {
		var settingsName = settingsDefaults[i].key;
		var settingsDefault = settingsDefaults[i].value;
		if (! task.seglenPrecomputeSettings.hasOwnProperty(settingsName)
				|| isEmpty(task.seglenPrecomputeSettings[settingsName])) {
			task.seglenPrecomputeSettings[settingsName] = settingsDefault;
		}
	}
	
	for (var i = 0; i<settingsDefaults.length;i++) {
		settingsName = settingsDefaults[i].key;
		eval("var " + settingsName + " = task.seglenPrecomputeSettings." + settingsName + ";");
	}
	
	var synchToVol = any(task.synchToVol);
	if (synchToVol) {
		if (! task.synchToVol[task.synchToVol.length - 1]) {
			console.error("init Task, segLenPrecompute: You have not set the last segment to have synchToVol though others are");
			throw "init Task";
		}
		if (! task.seglenPrecomputeSettings.hasOwnProperty("framePeriod")) {
			console.error("init Task, segLenPrecompute: You have set seglenPrecompute, and you have synchtoVol..."); //TODO: complete line 613
			throw "init Task";
		}
		var framePeriod = task.seglenPrecomputeSettings.framePeriod;
		if (! task.hasOwnProperty("fudgeLastVolume") || isEmpty(task.fudgeLastVolume)) {
			task.fudgeLastVolume = true;
		}
	} else {
		var framePeriod = NaN;
	}
	
	if (isEmpty(averageLen)) {
		var nSegs = task.segmin.length;
		var trialLens = [];
		trialLens[0] = {};
		trialLens[0].freq = 1;
		trialLens[0].min = 0;
		trialLens[0].max = 0;
		trialLens[0].segmin = [];
		trialLens[0].segmax = [];
		trialLens[0].synchmin = [];
		trialLens[0].synchmax = [];
		for (var i=0;i<nSegs;i++) {
			if (isNaN(task.segmin[i])) {
				var newTrialLens = [];
				var segprob = diff(task.segprob[i].concat([1]));
				
			}
		}
	}
}