/**
 * Things that need to be at the beginning of the concatenated file.
 */

//$.getScript("/scripts/jgllib.js");

/**
 * Function to make all elements of an array uppercase.
 * @returns {Array} the uppercase array
 */
function upper(array) {
	var tempArray = [];
	for (var i = 0;i<array.length;i++) {
		tempArray.push(array[i].toUpperCase());
	}
	return tempArray;
}

/**
 * Function to grab all properties of the given object.
 * @param object the object to get the fields from
 * @returns {Array} the array of field names
 */
function fields(object) {
	var tempArray = [];
	var i = 0;
	for (var field in object) {
		if (object.hasOwnProperty(field)) {
			tempArray[i++] = field;
		}
	}
	return tempArray;
}

/**
 * Function to make array of zeros of given length.
 * @param length the length of the array to make
 * @returns {Array} the zero array
 */
function zeros(length) {
	var tempArray = new Array(length);
	for (var i=0;i<tempArray.length;i++) {
		tempArray[i] = 0;
	}
	return tempArray;
}

/**
 * Function to make array of ones of given length.
 * @param length the length of the array to make.
 * @returns {Array} the ones array
 */
function ones(length) {
	var tempArray = new Array(length);
	for (var i=0;i<length;i++) {
		tempArray[i] = 1;
	}
	return tempArray;
}

/**
 * Function to pad the end of an array with the given value.
 * @param array the array to pad
 * @param endLength the final length the array should be
 * @param padVal the value to pad with
 * @returns {Array} the padded array
 */
function arrayPad(array, endLength, padVal) {
	while (array.length < endLength) {
		array.push(padVal);
	}
	return array;
}

/**
 * Function to make array of given length filled with the given value.
 * @param value the value to fill the array with
 * @param length the length the array should be
 * @returns {Array} the array that is made
 */
function fillArray(value, length) {
	var tempArray = new Array(length);
	for (var i=0;i<length;i++) {
		tempArray[i] = value;
	}
	return tempArray;
}

/**
 * Function to get the sum of an array
 * @param array the array to sum
 * @returns {Number} the sum of the array
 */
function sum(array) {
	var sum = 0;
	for (var i=0;i<array.length;i++) {
		sum += array[i];
	}
	return sum;
}

/**
 * Function to make cumulative sum array.
 * @param array the array to generate the cumulative sum from.
 * @returns {Array} the cumulative sum array
 */
function cumsum(array) {
	if (array.length == 0) {
		return [];
	}
	var sum = array[0];
	for (var i=0;i<array.length;i++) {
		sum += array[i];
		array[i] = sum;
	}
	return array;
}

/**
 * Function to determine if an array is empty
 * @param array the array
 * @returns {Boolean} true if array.length == 0 or given array is undefined
 */
function isEmpty(array) {
	if (array === undefined) {
		return true;
	}
	if ($.isArray(array)) {
		return array.length == 0;
	}
	console.log("isEmpty: used with non-array");
	return false;
}

/**
 * Function to determine if there are any non-zero values in the array.
 * @param array the array to check
 * @returns {Boolean} true if there is at least one non-zero value in array
 */
function any(array) {
	for (var i =0; i< array.length;i++) {
		if (array[i] != 0) {
			return true;
		}
	}
	return false;
}

/**
 * Function to determine the number of elements in the given array
 * @param array the array to count from
 * @returns {Number} number of defined elements in the given array
 */
function numel(array) {
	var count = 0;
	for (var i=0;i<array.length;i++) {
		if (array[i] != undefined) {
			count++;
		}
	}
	return count;
}

/**
 * 
 * @param string
 * @param array
 * @returns {Array} 
 */
function strcmp(string, array) {
	var tempArray = zeros(array.length);
	for (var i=0;i<array.length;i++) {
		if (string.localeCompare(array[i]) == 0) {
			tempArray[i] = 1;
		}
	}
	return tempArray;
}

/**
 * 
 * @param array
 * @returns {Array}
 */
function diff(array) {
	var tempArray = new Array(array.length - 1);
	for (var i = 1;i<array.length;i++) {
		tempArray[i-1] = array[i] - array[i-1];
	}
	return tempArray;
}