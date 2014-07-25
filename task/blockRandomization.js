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
	
	var innersize = 1;
	var paramIndexes = [];
	var block = {};
	block.parameter = {};
	for (var paramnum = 0;paramnum<parameter.n_;paramnum++) {
		paramIndexes[paramnum] = [];
		for (var i = 0; i< parameter.totalN_ / parameter.size_[paramnum];i++) {

			if (parameter.doRandom_) {
				paramIndexes[paramnum] = paramIndexes[paramnum].concat(randPerm(task, parameter.size_[paramnum]));
			} else {
				paramIndexes[paramnum] = paramIndexes[paramnum].concat(jglMakeArray(0,1,parameter.size_[paramnum]));
			}
		}
		eval("block.parameter." + parameter.names_[paramnum] + " = index(parameter." + parameter.names_[paramnum] + ",paramIndexes[paramnum], false);");
	}
	block.trialn = parameter.totalN_;
	return block;
//	var indexes = [];
//	
//	for (var i = 0;i<parameter.n_;i++) {
//		var randperm = randPerm(task, parameter.size_[i]);
//		indexes[i] = randperm;
//	}
//	
//	block = {};
//	
//	for (var i = 0;i<parameter.n_;i++) {
//		eval("block.parameter." + parameter.names_[i] + " = parameter." + parameter.names_[i] + ""
//	}
	
//	innersize = 1;
//	var paramIndexes = [];
//	for (var paramnum = 0;paramnum<parameter.n_;paramnum++) {
//		paramIndexes[paramnum] = [];
//		for (var rownum = 0;rownum<parameter.size_[paramnum][0];rownum++) {
//			var lastcol = 0;
//			for (var paramreps = 0; paramreps< (parameter.totalN_ / parameter.size_[paramnum][1]) / innersize; paramreps++) {
//				if (parameter.doRandom_ > 0) {
//					var thisparamIndexes = randPerm(task, parameter.size_[paramnum][1]);
//				} else {
//					var thisparamIndexes = jglMakeArray(1, 1, parameter.size_[paramnum][1]);
//				}
//				
//			}
//		}
//	}
	
	
}