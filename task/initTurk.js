/**
 * 
 */
function initTurk(myscreen, task) {
	
	var uniqueId = "{{ uniqueId }}";
	var condition = "{{ condition }}";
	var counterbalance = "{{ counterbalance }}";
	var adServerLoc = "{{ adServerLoc }}"
		
	myscreen.uniqueId = uniqueId;
	myscreen.condition = condition;
	myscreen.counterbalance = counterbalance;
	myscreen.adServerLoc = adServerLoc;
	myscreen.psiTurk = PsiTurk(uniqueId, adServerLoc);
	
	var pageNames = [];
	var window.jgl_Done_ = [];
	for (var i = 0;i<task.length;i++) {
		for (var j = 0;j<task[i].length;j++) {
			pageNames.push(task[i][j].html);
			window.jgl_Done_.push(false);
		}
	}
	myscreen.psiturk.preloadPages(pageNames);
	
	return myscreen;
}