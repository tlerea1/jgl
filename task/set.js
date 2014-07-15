/**
 * Basic Set Data Structure.
 * @constructor
 */

function Set() {
	var data = [];
	var count = 0;
	
	function find(val) {
		for (var i=0;i<data.length;i++) {
			if (data[i] === val) {
				return i;
			}
		}
		return -1;
	}
	
	this.contains = function(val) {
		return find(val) > -1;
	}
	
	this.insert = function(val) {
		if (! this.contains(val)) {
			data[count++] = val;
			return true;
		}
		return false;
	}
	
	this.remove = function(val) {
		if (this.contains(val)) {
			data.splice(find(val), 1);
			count--;
			return true;
		}
		return false;
	}
	
	this.toArray = function() {
		var tempArray = new Array(data.length);
		
		for (var i=0;i<tempArray.length;i++) {
			tempArray[i] = data[i];
		}
		
		return tempArray;
	}
}