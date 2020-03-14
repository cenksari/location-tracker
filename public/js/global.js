$(() => {
	$('body').on("contextmenu", function(){
		return false;
	});
});

window.addEventListener('online', updateIndicator);
window.addEventListener('offline', updateIndicator);

function updateIndicator() {
	const connected = navigator.onLine;

	if (connected) {
		$('#offline-notification').remove();
		$('#content,#logs').removeClass('hidden');
	} else {
		const overlay = `
			<div id="offline-notification">
				<p>
					Internet connection offline! Please connect internet and try again.
				</p>
			</div>
		`;

		$('body').append(overlay);
		$('#content,#logs').addClass('hidden');
	}
}

/**
 * Write error message.
 * 
 * @param {string} error - Error message
 */
writeLog = (error, type) => {
	const dt = new Date();

	let hours = dt.getHours().toString();
	let minutes = dt.getMinutes().toString();
	let seconds = dt.getSeconds().toString();

	if (hours.length == 1) {
		hours = `0${hours}`;
	}

	if (minutes.length == 1) {
		minutes = `0${minutes}`;
	}

	if (seconds.length == 1) {
		seconds = `0${seconds}`;
	}

	const newDate = `${hours}:${minutes}:${seconds}`;

	if (type === 'error') {
		$('#logs span').html(`
			${errorCount + 1} - ${error} (${newDate})
		`);
	} else {
		$('#logs span').html(`
			${error} (${newDate})
		`);
	}
};

/**
 * Create a timestamp
 */
getTimeStamp = () => {
	const date = new Date();
	const timestamp = date.getTime();

	return timestamp;
};
