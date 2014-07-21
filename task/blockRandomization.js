/**
 * 
 */
var blockRandomization = function(task, parameter, previousParamIndexes) {
	if (previousParamIndexes === undefined) {
		var temp = initRandomization(parameter);
		parameter = temp[0];
		if (! parameter.hasOwnProperty("doRandom_")) {
			parameter.doRandom_ = 1;
		}
		return parameter;
	}
	
	var completeRandperm = randPerm(task, parameter.totalN_);
	
	innersize = 1;
	var paramIndexes = [];
	for (var paramnum = 0;paramnum<parameter.n_;paramnum++) {
		paramIndexes[paramnum] = [];
		for (var rownum = 0;rownum<parameter.size_[paramnum][0];rownum++) {
			var lastcol = 0;
			for (var paramreps = 0; paramreps< (parameter.totalN_ / parameter.size_[paramnum][1]) / innersize; paramreps++) {
				if (parameter.doRandom_ > 0) {
					var thisparamIndexes = randPerm(task, parameter.size_[paramnum][1]);
				} else {
					var thisparamIndexes = jglMakeArray(1, 1, parameter.size_[paramnum][1]);
				}
				
			}
		}
	}
}