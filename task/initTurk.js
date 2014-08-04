/**
 * 
 */
function initTurk(task, myscreen) {
		
	myscreen.uniqueId = uniqueId;
	myscreen.condition = condition;
	myscreen.counterbalance = counterbalance;
	myscreen.adServerLoc = adServerLoc;
	myscreen.psiTurk = new PsiTurk(uniqueId, adServerLoc);
	
	var pageNames = [];
	window.jgl_Done_ = [];
	for (var i = 0;i<task.length;i++) {
		for (var j = 0;j<task[i].length;j++) {
			pageNames.push(task[i][j].html);
			window.jgl_Done_.push(false);
		}
	}
	myscreen.psiTurk.preloadPages(pageNames);
	
	initData();
	
	return myscreen;
}