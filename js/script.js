// Find all list elements on the page from student-list that do NOT have the .no-search class
var studentList = document.querySelectorAll('li.student-item:not(.no-search)');

// get the element with the .page-header class. Used to add search field
var theHeader = document.getElementsByClassName('page-header')[0];

// get the element with the .student-list class. Used to add pagination div
var theList = document.getElementsByClassName('student-list')[0];

// Show all elements that do belong <> the min and max
// while hiding all others
var showListElements = function(pageNumber) {
	// toggle active anchor
	var anchors = document.getElementsByTagName('a');
	
	// set passed value to integers...just in case
	var page = parseInt(pageNumber);
	
	// Create two variables for min and max record values
	var min = (page - 1) * 10;
	var max = page * 10;
	console.log('Min: ' + min + ', max: ' + max);
	
	// set active class for anchors
	for (var i = 0; i < anchors.length; i++) {
		
		// if the anchor is the page number passed, add the active class
		// otherwise remove active class
		i === (page - 1) ? anchors[i].classList.add('active') : anchors[i].classList.remove('active');

	}
	
	// loop through classList
	for (var i = 0; i < studentList.length; i++) {
		studentList[i].classList.add('hide-student');
		// Check if list item is between min and max
		if (i >= min && i < max) {
			studentList[i].classList.toggle('hide-student');
		}
	}
}

// dynamically create search field and search button
var createSearchField = function() {
	// create div with .student-search class
	var searchDiv = document.createElement('div');
	searchDiv.className = 'student-search';
	
	// create search field
	var searchField = document.createElement('input');
	searchField.setAttribute('placeholder', 'Search for students...');
	searchField.setAttribute('name', 'search-field');
	searchField.setAttribute('id', 'search-field');
	
	// create search button
	var searchButton = document.createElement('button');
	searchButton.innerText = 'Search';
	searchButton.addEventListener('click', searchList, false);
	
	// append search field and button to div
	searchDiv.appendChild(searchField);
	searchDiv.appendChild(searchButton);
	
	return searchDiv;
}

// dynamically create pagination links at bottom of the page
var createPaginationLinks = function(){
	studentList = document.querySelectorAll('li.student-item:not(.no-search)');
	
	// Determine page number by dividing studentList / 10 and rounding up
	var pages = Math.ceil(studentList.length / 10);
	// Log value for future troubleshooting
	console.log('Number of students: ' + studentList.length + ', pages: ' + pages);
	
	// Construct HTML elements to add
	// Create div to separate links from other sections of page
	var divList = document.createElement('div');
	//divList.className = 'page-list';
	divList.className = 'pagination';
	divList.setAttribute('id', 'pagination');
	
	// create unordered list
	var pageList = document.createElement('ul');
	
	for (var i = 1; i <= pages; i++) {
		// create each distinct page list item
		var pageListItem = document.createElement('li');
		pageListItem.className = 'page-list-item';
		
		// create anchor to handle onclick event
		var anchor = document.createElement('a');
		anchor.value = i;
		anchor.setAttribute('href', '#');
		anchor.innerText = i;
		// event listener with anonymous function to allow the calling
		// of showListElements onclick rather than on page load
		anchor.addEventListener('click', function() {
			showListElements(this.value);
		}, false);
		
		// Append anchor to pageListItem
		pageListItem.appendChild(anchor);
		
		// Append pageListItem to pageList
		pageList.appendChild(pageListItem);
		
	}
	
	// Append pageList to the div
	divList.appendChild(pageList);
	
	return divList;
}

// Called when search button is clicked
var searchList = function() {
	// grab the search field value
	var searchField = document.getElementById('search-field');
	
	// build an array of all the students with .student-details class
	var studentDetails = document.getElementsByClassName('student-details');
	
	// first check to see if the search field has a value
	if (searchField && searchField.value) {
		// normalize the searchField to lower case
		var searchFieldLC = searchField.value.toLowerCase();
		
		// iterate over the studentDetails array
		for (var i = 0; i < studentDetails.length; i++) {
			// the h3 element contains the name
			var name = studentDetails[i].querySelector('h3');
			// email is stored in the span with the .email class
			var email = studentDetails[i].querySelector('span[class="email"]');
			
			// check to see if either name or email contains the searchFieldLC value
			if (name.innerText.toLowerCase().search(searchFieldLC) > -1 || email.innerText.toLowerCase().search(searchFieldLC) > -1) {
				// remove the .no-search class to the li. name or email could be used here.
				// Chose email because .email class is less likely to change than an h3 element
				email.parentElement.parentElement.classList.remove('no-search');
			} else {
				// add the .no-search class from li.
				email.parentElement.parentElement.classList.add('no-search');
			}
		}
		// rebuild the pagination links
		buildPagination();
	} else {
		// resetting so that all students will show when search field is empty
		resetPage();
	}
}

// reset the page so all items show
var resetPage = function() {
	// instead of .no-search filter, clear out the entire .student-list items
	var studentItemList = document.getElementsByClassName('student-item');
	
	for (var i = 0; i < studentItemList.length; i++) {
		studentItemList[i].classList.remove('no-search');
	}
	
	// rebuild the pagination after removing .no-search clas
	buildPagination();
}

// create pagination links on page reset and search
var buildPagination = function() {
	var pagination = document.getElementById('pagination');
	
	if (pagination !== null) {
		theList.removeChild(pagination);
	}
	
	theList.append(createPaginationLinks());
}

// Dynamically adds search and pagination
var buildPage = function() {
	
	// reset page to show all elements
	resetPage();
	
	// add search field and button to the header
	theHeader.prepend(createSearchField());
	
	// show initial 10 students
	showListElements(1);
}

buildPage();

