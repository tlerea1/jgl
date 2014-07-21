/**
 * 
 */
function initRandomization(parameter) {
	var alreadyInitialized = false;
	
	if (parameter.hasOwnProperty("n_")) {
		console.log("initRandomization: Re-initialized parameters");
		alreadyInitialized = true;
	}
	parameter.names_ = [];
	parameter.n_ = [];
	parameter.size_ = [];
	parameter.totalN_ = [];

	
	var names = fields(parameter);
	
	var n = 0;
	
	for (var i = 0; i < names.length;i++) {
		if (isEmpty(names[i].match("_$"))) {
			parameter.names_[n++] = names[i];
		}
	}
	
	parameter.n_ = parameter.names_.length;
	
	for (var i=0;i<parameter.n_;i++) {
		var paramsize = eval("size(parameter." + parameter.names_[i] + ");");
		parameter.size_[i] = paramsize;
	}
	
	parameter.totalN_ = sum(parameter.size_); //TODO: verify that this makes sense 
	
	return [parameter, alreadyInitialized];
}