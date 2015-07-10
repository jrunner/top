var adjustHeight = 50;
/**
 * @returns {Number}
 */
function getWindowWidth() {
	var windowWidth = 0;
	if (typeof (window.innerWidth) == "number") {
		windowWidth = window.innerWidth;
	} else {
		if (document.documentElement && document.documentElement.clientWidth) {
			windowWidth = document.documentElement.clientWidth;
		} else {
			if (document.body && document.body.clientWidth) {
				windowWidth = document.body.clientWidth;
			}
		}
	}
	return windowWidth;
}

function getWindowHeight() {
	var windowHeight = 0;
	if (typeof (window.innerHeight) == 'number') {
		windowHeight = window.innerHeight;

	} else {
		if (document.documentElement && document.documentElement.clientHeight) {
			windowHeight = document.documentElement.clientHeight;
		} else {
			if (document.body && document.body.clientHeight) {
				windowHeight = document.body.clientHeight;
			}
		}
	}
	return windowHeight;
}

function getWindowWidth() {
	var windowWidth = 0;
	if (typeof (window.innerWidth) == 'number') {
		windowWidth = window.innerWidth;

	} else {
		if (document.documentElement && document.documentElement.clientWidth) {
			windowWidth = document.documentElement.clientWidth;
		} else {
			if (document.body && document.body.clientWidth) {
				windowWidth = document.body.clientWidth;
			}
		}
	}
	return windowWidth;
}

function setContent() {
	if (document.getElementById) {
		var windowHeight = getWindowHeight();
		var windowWidth = getWindowWidth();
		if (windowHeight > 0) {
			var contentElement = document.getElementById('content');
			var contentHeight = contentElement.offsetHeight;
			var contentWidth = contentElement.offsetWidth;

			if (windowHeight - 90 >= 0) {
				contentElement.style.position = 'relative';
				contentElement.style.height = (windowHeight - adjustHeight) + 'px';
				contentElement.style.width = (windowWidth) + 'px';

			} else {
				contentElement.style.position = 'relative';
				contentElement.style.height = (windowHeight - adjustHeight) + 'px';
				contentElement.style.width = (windowWidth) + 'px';

			}

		}
	}
}

window.onload = function() {
	setContent();
};
window.onresize = function() {
	setContent();
};