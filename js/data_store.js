(function(window) {

	function store(key, value) {
		value = JSON.stringify(value);
		window.localStorage.setItem(key, value);
	}

	function get_array(key) {
		var stored_item = window.localStorage.getItem(key);
		if(!stored_item) return [];

		return JSON.parse(stored_item);

	}

	function delete_from_array(key, index_to_delete) {
		var notes_array = get_array(key);
		if(!notes_array.length) return;

		notes_array.splice(index_to_delete, 1);
		store(key, notes_array);
	}

	window.Data_Store = {
		store: store,
		get_array: get_array,
		delete_from_array: delete_from_array
	}
})(window);
