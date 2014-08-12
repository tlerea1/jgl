/**
 * 
 */
function writeTrace(data, tracenum, force, eventTime) {
	if (force === undefined) {
		force = 0;
	}
	if (eventTime === undefined) {
		eventTime = jglGetSecs();
	}
	
	var getlast = find(equals(myscreen.events.tracenum, tracenum));
	
	if (! isEmpty(getlast)) {
		getlast = getlast[getlast.length - 1];
	}
	
	if ((tracenum > 0)) {
		myscreen.events.tracenum[myscreen.events.n] = tracenum;
		myscreen.events.data[myscreen.events.n] = data;
		myscreen.events.ticknum[myscreen.events.n] = myscreen.tick;
		myscreen.events.time[myscreen.events.n] = eventTime;
		myscreen.events.force[myscreen.events.n] = force;
		myscreen.events.n++;
	}
	
 }