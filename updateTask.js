/**
 * 
 */
function updateTask(task, myscreen, tnum) {
	
	if (tnum == task.length) {
		return [task, myscreen, tnum];
	}
	
	//TODO: randstate line 18
	// If phase is complete
	if (task[tnum].trialnum > task[tnum].numTrials) {
		tnum++;
		myscreen = writeTrace(tnum, task[tnum - 1].phaseTrace, myscreen);
		var temp = updateTask(task, myscreen, tnum); // start next phase
		task = temp[0];
		myscreen = temp[1];
		tnum = temp[2];
		if (task[tnum - 1].usingScreen) {
			jglClose();
		}
		return [task, myscreen, tnum];
	}
	
	if (task[tnum].notYetStarted == 1) {
		myscreen.psiTurk.showPage(task[tnum].html);
		if (task[tnum].usingScreen) {
			jglOpen();
		}
		task[tnum].notYetStarted = 0;
	}
	
	if (window.jgl_Done_[tnum]) {
		tnum++;
		myscreen.writeTrace(tnum, task[tnum - 1].phaseTrace, myscreen);
		var temp = updateTask(task, myscreen, tnum);
		task = temp[0];
		myscreen = temp[1];
		tnum = temp[2];
		return [task, myscreen, tnum];
	}
	
	//If we need a new block
	if (task[tnum].blocknum == -1 || task[tnum].blockTrialnum > task[tnum].block[task[tnum].blocknum].trialn) {
		if (task[tnum].blocknum == task[tnum].numBlocks) { // If phase is done due to blocks
			tnum++;
			myscreen = writeTrace(tnum, task[tnum - 1].phaseTrace, myscreen);
			var temp = updateTask(task, myscreen, tnum); // start next phase
			task = temp[0];
			myscreen = temp[1];
			tnum = temp[2];
			return [task, myscreen, tnum];
		}
		var temp = initBlock(task[tnum], myscreen, tnum);
		task[tnum] = temp[0];
		myscreen = temp[1];
	}
	
	// Update Trial
	var temp = updateTrial(task, myscreen, tnum);
	task = temp[0];
	myscreen = temp[1];
	tnum = temp[2];
	
	//TODO: randstate
	
	return [task, myscreen, tnum];
}

function updateTrial(task, myscreen, tnum) {
	if (task[tnum].thistrial.waitingToInit) {
		var temp = initTrial(task[tnum], myscreen, tnum);
		task[tnum] = temp[0];
		myscreen = temp[1];
	}
	
	if (task[tnum].thistrial.segstart == -Infinity) {
		if (task[tnum].thistrial.waitForBacktick) {
			if (myscreen.volnum == task[tnum].thistrial.startvolnum) {
				return [task, myscreen, tnum];
			} else {
				console.log("update Task: Backtick recorded: Starting trial");
				task[tnum].thistrial.waitForBacktick = 0;
			}
		}
		
		myscreen = writeTrace(1, task[tnum].segmentTrace, myscreen, 1);
		
		if (task[tnum].timeInTicks) {
			task[tnum].thistrial.trialstart = myscreen.tick;
		} else if (task[tnum].timeInVols) {
			task[tnum].thistrial.trialstart = myscreen.volnum;
		} else {
			thistime = jglGetSecs();
			
			if (task[tnum].trialnum > 0) {
				task[tnum].timeDiscrepancy = (thistime - task[tnum].lasttrial.trialstart) - (sum(subtract(task[tnum].lasttrial.seglen, task[tnum].timeDiscrepancy)));
			}
			task[tnum].thistrial.trialstart = thistime;
		}
		
		task[tnum] = resetSegmentClock(task[tnum], myscreen);
		
		var temp = task[tnum].callback.startSegment(task[tnum], myscreen);
		task[tnum] = temp[0];
		myscreen = temp[1];
		
		if (task[tnum].getResponse[task[tnum].thistrial.thisseg] == 2) {
			myscreen.oldFlushMode = myscreen.flushMode;
			myscreen.flushMode = 1;
		}
	}
	
	var segover = 0;
	
	if (task[tnum].timeInTicks) {
		if (myscreen.tick = task[tnum].thistrial.segstart >= task[tnum].thistrial.seglen[task[tnum].thistrial.thisseg]) {
			segover = 1;
		}
	} else if (task[tnum].timeInVols) {
		if (myscreen.volnum - task[tnum].thistrial.segstart >= task[tnum].thistrial.seglen[task[tnum].thistrial.thisseg]) {
			segover = 1;
		}
	} else {
		if (jglGetSecs() - task[tnum].thistrial.segstart >= task[tnum].thistrial.seglen[task[tnum].thistrial.thisseg]) {
			if (task[tnum].synchToVol[task[tnum].thistrial.thisseg]) {
				if (task[tnum].thistrial.synchVol == -1) {
					task[tnum].thistrial.synchVol = myscreen.volnum;
				} else if (task[tnum].thistrial.synchVol < myscreen.volnum) {
					segover = 1;
					task[tnum].thistrial.seglen[task[tnum].thistrial.thisseg] = jglGetSecs - task[tnum].thistrial.segstart;
				}
			}
			segover = 1;
		}
	}
	
	var segmentExpired = 0;
	
	if (task[tnum].fudgeLastVolume) {
		if (task[tnum].trialnum == task[tnum].numTrials 
				|| (task[tnum].blocknum == task[tnum].numBlocks && task[tnum].blockTrialnum == task[tnum].block[task[tnum].blocknum].trialn)) {
			if (! task[tnum].thistrial.hasOwnProperty("fudgeLastVolume")) {
				if (task[tnum].thistrial.thisseg == task[tnum].thistrial.seglen.length) {
					segmentExpired = 0;
					if (task[tnum].synchToVol[task[tnum].thistrial.thisseg]) {
						if (task[tnum].timeInTicks) {
							if (myscreen.tick - task[tnum].thistrial.segstart >= task[tnum].thistrial.seglen[task[tnum].thistrial.thisseg]) {
								segmentExpired = 1;
							}
						} else {
							if (jglGetSecs() - task[tnum].thistrial.segstart >= task[tnum].thistrial.seglen[task[tnum].thistrial.thisseg]) {
								segmentExpired = 1;
							}
						}
					} else {
						if (task[tnum].timeInVols) {
							if ((myscreen.volnum - task[tnum].thistrial.segstart) + 1 >= task[tnum].thistrial.seglen[task[tnum].thistrial.thisseg]) {
								segmentExpried = 1;
							}
						}
					}
					
					if (segmentExpired) {
						
						//TODO: NEED TRACES FOR THIS TO WORK.....
						
						var volumeTimes = index(myscreen.events.time, and(equals(myscreen.events.data, 1), equals(myscreen.events.tracenum == 1)), true);
						
						if (! isEmpty(find(volumeTimes))) {
							task[tnum].thistrial.averageVolumeTime = mean(diff(volumeTimes));
							task[tnum].thistrial.fudgeLastVolume = volumeTimes[volumeTimes.length - 1] + task[tnum].thistrial.averageVolumeTime;
						}
					}
				}
			} else {
				if (jglGetSecs() > task[tnum].thistrial.fudgeLastVolume) {
					console.log("update Task: Used fudgeLastVolume to end last trial of task (averageVolumeTime=" + task[tnum].thistrial.averageVolumeTime + ")");
					segover = 1;
				}
			}
		}
	}
	
	if (segover) {
		if (task[tnum].getResponse[task[tnum].thistrial.thisseg] == 2) {
			myscreen.flushMode = myscreen.oldFlushMode;
		}
		
		task[tnum].thistrial.thisseg++;
		
		if (task[tnum].thistrial.thisseg == task[tnum].thistrial.seglen.length) {
			if (task[tnum].callback.hasOwnProperty("endTrial")) {
				var temp = task[tnum].callback.endTrial(task[tnum], myscreen);
				task[tnum] = temp[0];
				myscreen = temp[1];
			}
			
			//TODO: randVars line 253
			
			task[tnum].blockTrialnum++;
			task[tnum].trialnum++;
			
			task[tnum].thistrial.waitingToInit = 1;
			var temp = updateTask(task, myscreen, tnum);
			task = temp[0];
			myscreen = temp[1];
			tnum = temp[2];

			//TODO: randstate
			
			return [task, myscreen, tnum];
		}
		
		task[tnum] = resetSegmentClock(task[tnum], myscreen);
		
		myscreen = writeTrace(task[tnum].thistrial.thisseg, task[tnum].segmentTrace, myscreen, 1);
		
		var temp = task[tnum].callback.startSegment(task[tnum], myscreen);
		task[tnum] = temp[0];
		myscreen = temp[1];
		
		if (task[tnum].getResponse[task[tnum].thistrial.thisseg] == 2) {
			var temp = task[tnum].callback.screenUpdate(task[tnum], myscreen);
			task[tnum] = temp[0];
			myscreen = temp[1];
			if (task[tnum].usingScreen) {
				jglFlush();
			}
			
			myscreen.oldFlushMode = myscreen.flushMode;
			myscreen.flushMode = -1;
		}
	}
	
	if (task[tnum].getResponse[task[tnum].thistrial.thisseg]) {
		task[tnum].thistrial.mouseButton = [];
		// line 315
		
	}
	
	return [task, myscreen, tnum];
	
}

function initBlock(task, myscreen, phase) {
	
	task.blocknum++;
	
	if (task.blocknum > 0) {
		task.block[task.blocknum] = task.callback.rand(task, task.parameter, task.block[task.blocknum-1]);
	} else {
		task.block[task.blocknum] = task.callback.rand(task, task.parameter, []);
	}
	
	task.blockTrialNum = 0;
	
	if (task.callback.hasOwnProperty("startBlock")) {
		var temp = task.callback.startBlock(task, myscreen);
		task = temp[0];
		myscreen = temp[1];
	}
	
	var temp = initTrial(task, myscreen, phase);
	task = temp[0];
	myscreen = temp[1];


	return [task, myscreen];
}

function initTrial(task, myscreen, phase) {
	task.lasttrial = task.thistrial;
	task.thistrial.thisphase = phase;

	task.thistrial.thisseg = 0;
	task.thistrial.gotResponse = 0;

	task.thistrial.segstart = -Infinity;

	task.thistrial.startvolnum = myscreen.volnum;

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

	if (task.waitForBacktick && (task.blocknum == 0) && task.blockTrialnum == 0) {
		task.thistrial.waitForBacktick = 1;
		backtick = myscreen.keyboard.backtick;
		console.log("updateTask: wating for backtick: '"+ backtick + "'");
	} else {
		task.thistrial.waitForBacktick = 0;
	}

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

	return [task, myscreen];
}

function resetSegmentClock(task, myscreen) {
	task.thistrial.synchVol = -1;
	
	var usedtime = sum(index(task.thistrial.seglen, jglMakeArray(0, 1, task.thistrial.thisseg), false));
	
	if (! (task.timeInVols || task.timeInTicks)) {
		task.thistrial.segstart = task.thistrial.trialstart - task.timeDiscrepancy + usedtime;
	} else {
		task.thistrial.segstart = task.thistrial.trialstart + usedtime;
	}
	
	task.thistrial.segStartSeconds = jglGetSecs();
	return task;
}



