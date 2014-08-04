/**
 * 
 */
function initStimulus(stimName, myscreen) {
	eval("window." + stimName + ".init = 1");
	
	if (! myscreen.hasOwnProperty("stimulusNames")) {
		myscreen.stimulusNames = [];
		myscreen.stimulusNames[0] = stimName;
	} else {
		var notFound = 1;
		for (var i = 0;i<myscreen.stimulusNames.length;i++) {
			if (myscreen.stimulusNames[i].localeCompare(stimName) == 0) {
				console.log("init Stimulus: There is already a stimulus called " + stimName + " registered");
				notFound = 0;
			}
		}
		if (notFound) {
			myscreen.stimulusNames[myscreen.stimulusNames.length] = stimName;
		}
	}
	
	return myscreen;
}