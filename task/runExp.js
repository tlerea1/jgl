/**
 * 
 */
function finishExp() {
	clearIntAndTimeouts();
	$("body").unbind("keydown", keyResponse);
	$("body").unbind("mousedown", mouseResponse);
	myscreen.psiTurk.completeHIT();
	
}

function clearIntAndTimeouts() {
	for (var i=0;i<window.segTimeout.length;i++) {
		if (window.segTimeout.length) {
			clearTimeout(window.segTimeout[i]);
		}
	}
	if (window.drawInterval) {
		clearInterval(window.drawInterval);
	}
}

function nextPhase() {
	clearIntAndTimeouts();
	tnum++;
	for (var i=0;i<window.task.length;i++) {
		startPhase(task[i]);
	}
}

var startPhase = function(task) {
	if (tnum == task.length) {
		finishExp();
		return;
	}
	
	myscreen.psiTurk.showPage(task[tnum].html);
	if (task[tnum].usingScreen) {
		if (! jglIsOpen()) {
			jglOpen(myscreen.ppi);
		}
		if (! window.drawInterval) {
			window.drawInterval = setInterval(tickScreen, 17);
		}
	}
	
	initBlock(task[tnum]);
	startBlock(task);
}

var startBlock = function(task) {
	if (task[tnum].blocknum == task[tnum].numBlocks) { // If phase is done due to blocks
		nextPhase();
		return;
	}
	initTrial(task[tnum]);
	startTrial(task);
}

var startTrial = function(task) {
	if (task[tnum].blockTrialnum == task[tnum].block[task[tnum].blocknum].trialn) {
		initBlock(task[tnum]);
		startBlock(task);
		return;
	}
	if (task[tnum].trialnum == task[tnum].numTrials) {
		nextPhase();
		return;
	}
	
	startSeg(task);
}

var startSeg = function(task) {
	if (task[tnum].thistrial.thisseg == task[tnum].thistrial.seglen.length - 1) {
		if (task[tnum].callback.hasOwnProperty("endTrial")) {
			var temp = task[tnum].callback.endTrial(task[tnum], myscreen);
			task[tnum] = temp[0];
			myscreen = temp[1];
		}
		
		//TODO: randVars line 253
		
		task[tnum].blockTrialnum++;
		task[tnum].trialnum++;
		
//		task[tnum].thistrial.waitingToInit = 1;
		initTrial(task[tnum]);
		startTrial(task);
		return;
		//TODO: randstate
		
	}
	
	task[tnum].thistrial.thisseg++;
	
	if (task[tnum].callback.hasOwnProperty("startSegment")) {
		var temp = task[tnum].callback.startSegment(task[tnum], myscreen);
		task[tnum] = temp[0];
		myscreen = temp[1];
	}
	myscreen = writeTrace(1, task[tnum].segmentTrace, myscreen, 1);
	thistime = jglGetSecs();

	task[tnum].thistrial.trialstart = thistime;
	if (isFinite(task[tnum].thistrial.seglen[task[tnum].thistrial.thisseg])) {
		window.segTimeout[task[tnum].taskID] = setTimeout(startSeg, task[tnum].thistrial.seglen[task[tnum].thistrial.thisseg] * 1000, task);
	}
	return;
}

function initBlock(task) {
	
	task.blocknum++;
	
	if (task.blocknum > 0) {
		task.block[task.blocknum] = task.callback.rand(task, task.parameter, task.block[task.blocknum-1]);
	} else {
		task.block[task.blocknum] = task.callback.rand(task, task.parameter, []);
	}
	
	task.blockTrialnum = 0;
	
	if (task.callback.hasOwnProperty("startBlock")) {
		var temp = task.callback.startBlock(task, myscreen);
		task = temp[0];
		myscreen = temp[1];
	}
}

function initTrial(task) {
	task.lasttrial = task.thistrial;
	task.thistrial.thisphase = tnum;

	task.thistrial.thisseg = -1;
	task.thistrial.gotResponse = 0;

	task.thistrial.segstart = -Infinity;

	if (task.seglenPrecompute === false) {
		var temp = getTaskSeglen(task);
		var seglen = temp[0];
		task = temp[1];

		task.thistrial.seglen = seglen;
	} else {
		for (var i = 0;i<task.seglenPrecompute.nFields;i++) {
			fieldName = task.seglenPrecompute.fieldNames[i];

			fieldRow = (task.trialnum % task.seglenPrecompute[fieldName].nTrials)// + 1

			task.thistrial[fieldName] = task.seglenPrecompute[fieldName].vals[fieldRow];
		}

		fieldRow = Math.min(task.seglenPrecompute.seglen.nTrials, task.trialnum);
		task.thistrial.seglen = task.seglenPrecompute.seglen.vals[fieldRow];
	}

//	if (task.waitForBacktick && (task.blocknum == 0) && task.blockTrialnum == 0) {
//		task.thistrial.waitForBacktick = 1;
//		backtick = myscreen.keyboard.backtick;
//		console.log("updateTask: wating for backtick: '"+ backtick + "'");
//	} else {
		task.thistrial.waitForBacktick = 0;
//	}

	task.thistrial.buttonState = [0,0];

	for (var i =0;i<task.parameter.n_;i++) {
		eval("task.thistrial." + task.parameter.names_[i] + " = task.block[task.blocknum].parameter." + task.parameter.names_[i] + "[task.blockTrialnum];");
	}

	//TODO: randvars line 507

	if (task.callback.hasOwnProperty("startTrial")) {
		var temp = task.callback.startTrial(task, myscreen);
		task = temp[0];
		myscreen = temp[1];
	}

	task.thistrial.waitingToInit = 0;
}