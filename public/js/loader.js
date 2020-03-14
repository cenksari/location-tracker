/**
 * Show fullscreen loader.
 */
showFullscreenLoader = () => {
	const overlay = `
		<div id="fullscreen-loader">
			<div class="fullscreen-loader-inside">
				<div class="fullscreen-loader-content">
					<svg class="circular" width="48" height="48">
						<circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee" />
						<circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10" stroke="#7737e6" />
					</svg>
				</div>
			</div>
		</div>
	`;

    $('body').append(overlay).addClass('noscroll');

	$('#fullscreen-loader').show();
};

/**
 * Hide fullscreen loader.
 */
closeFullscreenLoader = () => {
	$('#fullscreen-loader').remove();
	$('body').removeClass('noscroll');
};
