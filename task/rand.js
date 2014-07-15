/**
 * 
 */

function rand(task, length) {
	if (! task.hasOwnProperty("random")) {
		task.random = {};
		task.random.current = 0;
		task.random.nums = new Array(32);
		for (var i =0;i<task.random.nums.length;i++) {
			task.random.nums = Math.random();
		}
	}
	if (length === undefined) {
		if (task.random.current == task.random.nums.length) {
			task.random.nums = randomResize(task.random.nums);
		}

		return task.random.nums[task.random.current++];
	} else {
		while (task.ranndom.current + length >= task.random.nums.length) {
			task.random.nums = randomResize(task.random.nums);
		}
		var temp = new Array(length);
		for (var i=0;i<length;i++) {
			temp[i] = task.random.nums[task.random.current++];
		}
		return temp;
	}
}

function randomResize(array) {
	var tempArray = new Array(array.length * 2);
	for (var i=0;i<array.length;i++) {
		tempArray[i] = array[i];
	}
	for (var i=array.length;i<tempArray.length;i++) {
		tempArray[i] = Math.random();
	}
	return tempArray;
}