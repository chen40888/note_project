(function(window) {

	window.onload = _on_load;

	function _on_load() {
		_create_notes_html_from_array();
		get('hook_my_form').addEventListener('submit', _save_new_note);
	}

	function validation(body,date) {
	var date_regex = RegExp(/(0[1-9]|[12][0-9]|3[01])[ \.-](0[1-9]|1[012])[ \.-](19|20|)\d\d/),
		date_check = date_regex.test(date);
		return !(body === '' || !date_check);
	}

	function _create_notes_html_from_array() {
		var index = 0,
			notes_array = Data_Store.get_array('notes_array');

		for(index; index < notes_array.length; index++) {
			_create_note(notes_array[index]);
		}
	}

	function _create_note(note_object) {
		var note_li = window.document.createElement('li');

		note_li.className = 'note showbox' + (note_object.is_important ? ' active' : '');
		note_li.innerHTML = '<h2>' + note_object.body + '</h2><p>' + note_object.date + '</p><a class="close"><span class="glyphicon glyphicon-trash"></span></a>';
		note_li.getElementsByTagName('a')[0].addEventListener('click', _on_clicked_close_link);
		get('hook_notes_wrapper').appendChild(note_li);
	}


	function _on_clicked_close_link() {
		var $li = this.parentElement;

		fade_out_before_del($li);
		setTimeout(_after_delay, 4000);

		function _after_delay() {
			var $notes_array = Array.prototype.slice.call($li.parentElement.children), // https://stackoverflow.com/questions/7056925/how-does-array-prototype-slice-call-work
				current_index = $notes_array.indexOf($li);

			_delete_note($li, current_index);
		}
	}

	function _delete_note(li, index) {
		li.parentNode.removeChild(li);
		Data_Store.delete_from_array('notes_array', index);
	}

	function fade_out_before_del(element) {
		var op = 1,  // initial opacity
			timer = setInterval(_on_interval, 200);

		function _on_interval() {
			if (op <= 0.1){
				clearInterval(timer);
				element.style.display = 'none';
			}
			element.style.opacity = op;
			element.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op -= op * 0.3;
		}
	}

	function _save_new_note(event_object) {
		event_object.preventDefault();
		var $note_body = get('hook_note_body').value,
			$important = get('hook_is_important').checked,
		    $date =  get('hook_date').value,
			$date = new Date($date).toLocaleDateString('he-IL', {year: 'numeric', month: '2-digit' , day:'2-digit'});

		var notes_array = Data_Store.get_array('notes_array'),
			note_object = {
				body: $note_body,
				date: $date,
				is_important: $important
			},
			is_validation = validation(note_object.body,note_object.date);

		if(is_validation) _save_and_create();
		else _on_error();


		function _save_and_create() {
			notes_array.push(note_object);
			Data_Store.store('notes_array', notes_array);
			_create_note(note_object);

			get('hook_my_form').reset();
			get('print_error').innerHTML ='';
		}
	}
	function _on_error() {
		get('print_error').innerHTML = 'אנא מלא את התאריך הרצוי';
	}

})(window);
