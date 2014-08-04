/**
 * Function for making a survey phase. Currently, all a survey phase is 
 * is a phase that has infinite blocks and trials and does not use the screen. 
 */
function initSurvey(myscreen) {
	
	var task = {};
	task.seglen = [10];
	task.usingScreen = 0;
	task.html = "survey.html";
	
	var temp = initTask(task, myscreen, function(task, myscreen){return [task, myscreen]}, function(task, myscreen){return [task, myscreen]});
	task = temp[0];
	myscreen = temp[1];
	

	
	task.numTrials = Infinity;
	task.numBlocks = Infinity;
	
	return [task, myscreen];
}