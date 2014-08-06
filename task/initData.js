/**
 * This function is in charge of initializing the psiData object.
 * The psiData object holds all data, responses as well as survey responses.
 * psiData has two main fields, keys and mouse. Keys holds all keyboard event data,
 * and mouse holds all mouse response data. keys fields are tasknum, phasenum, blocknum,
 * trialnum, segnum, time, and keyCode. mouse fields are: which, x, y, tasknum, phasenum, blocknum,
 * trialnum, segnum, time. When an event occurs if the segment requires a response gotResponse is set to one
 * the event is recorded in psiData, and if a trialResponse callback is set it is called. 
 */
function initData() {
	window.psiData = {};
	psiData.keys = [];
	psiData.mouse = [];
	
	$("body").focus().keydown(keyResponse);
	$("body").focus().mousedown(mouseResponse);
}

/**
 * Gathers key events and saves them in psiData.
 * checks to see for each running task if the current segment wants a response
 * if so records it.
 */
var keyResponse = function(e) {
	for (var i = 0;i<task.length;i++) { //cycle through tasks
		if (task[i][tnum].thistrial.gotResponse == 0 && task[i][tnum].getResponse[task[i][tnum].thistrial.thisseg] == 1) {
			task[i][tnum].thistrial.gotResponse = 1;
			psiData.keys[psiData.keys.length] = {};
			psiData.keys[psiData.keys.length - 1].keyCode = e.keyCode;
			psiData.keys[psiData.keys.length - 1].tasknum = i;
			psiData.keys[psiData.keys.length - 1].phasenum = tnum;
			psiData.keys[psiData.keys.length - 1].blocknum = task[i][tnum].blocknum;
			psiData.keys[psiData.keys.length - 1].trialnum = task[i][tnum].trialnum;
			psiData.keys[psiData.keys.length - 1].segnum = task[i][tnum].thistrial.thisseg;
			psiData.keys[psiData.keys.length - 1].time = jglGetSecs();
			if (task[i][tnum].callback.hasOwnProperty("trialResponse")) {
				task[i][tnum].callback.trialResponse;
			}
		}
	}
}

/**
 * Gathers mouse events and saves them in psiData.
 * checks to see for each running task if the current segment wants a response
 * if so records it.
 */
var mouseResponse = function(e) {
	for (var i = 0;i<task.length;i++) { //cycle through tasks
		if (task[i][tnum].thistrial.gotResponse == 0 && task[i][tnum].getResponse[task[i][tnum].thistrial.thisseg] == 2) {
			task[i][tnum].thistrial.gotResponse = 1;
			psiData.mouse[psiData.mouse.length] = {};
			psiData.mouse[psiData.mouse.length - 1].which = e.which;
			psiData.mouse[psiData.mouse.length - 1].x = e.pageX;
			psiData.mouse[psiData.mouse.length - 1].y = e.pageY;
			psiData.mouse[psiData.mouse.length - 1].tasknum = i;
			psiData.mouse[psiData.mouse.length - 1].phasenum = tnum;
			psiData.mouse[psiData.mouse.length - 1].blocknum = task[i][tnum].blocknum;
			psiData.mouse[psiData.mouse.length - 1].trialnum = task[i][tnum].trialnum;
			psiData.mouse[psiData.mouse.length - 1].segnum = task[i][tnum].thistrial.thisseg;
			psiData.mouse[psiData.mouse.length - 1].time = jglGetSecs();
			if (task[i][tnum].callback.hasOwnProperty("trialResponse")) {
				task[i][tnum].callback.trialResponse;
			}
		}
	}
}