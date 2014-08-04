/**
 * 
 */
function tickScreen() {
	
	for (var i=0;i<task.length;i++) {
		task[i][tnum].callback.screenUpdate(task[i], myscreen);
	}
	
	//TODO: skipped a bunch of volume stuff
	switch (myscreen.flushMode) {
	case 0:
		jglFlush();
		break;
	case 1:
		jglFlush();
		myscreen.flushMode = -1;
		break;
	case 2:
		jglNoFlushWait();
		break;
	case 3:
		jglFlushAndWait();
		break;
	default:
		myscreen.fliptime = Infinity;
	}


	if (myscreen.checkForDroppedFrames && myscreen.flushMode >= 0) {
		var fliptime = jglGetSecs();
		

		if ((fliptime - myscreen.fliptime) > myscreen.dropThreshold*myscreen.frametime) {
			myscreen.dropcount++;
		}
		if (myscreen.fliptime != Infinity) {
			myscreen.totalflip += (fliptime - myscreen.fliptime);
			myscreen.totaltick++;
		}
		myscreen.fliptime = fliptime;
	}
	myscreen.tick++;


	if (jglGetKeys().indexOf('esc') > -1) {
		myscreen.userHitEsc = 1;
		finishExp();
	}
	

}