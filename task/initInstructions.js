/**
 * 
 */
function initInstructions(pages) {
//	myscreen.psiTurk.preloadPages(pages);
	var task = {};
	task.seglen = [10];
	task.usingScreen = 0;
	task.html = "instructions";
	
	task = initTask(task, function(task, myscreen){return [task, myscreen]}, function(task, myscreen){return [task, myscreen]});
	task.instructionPages = pages;
	
	return task;
}