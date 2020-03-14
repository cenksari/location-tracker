showFullscreenLoader();

$(() => {
	storageTool.getItem('player').then(data => {
		currentPlayer = JSON.parse(data);

		if (!currentPlayer) {
			document.location = 'index.html';
		}
	});

	$('body').on('click', '#logs ul li', function() {
		const latitude = $(this).attr('data-latitude');
		const longitude = $(this).attr('data-longitude');

		map.setCenter(new google.maps.LatLng(latitude, longitude));

		map.setZoom(19);
	});

	$('body').on('click', '#logs i', function() {
		if ($('#logs').hasClass('opened')) {
			$('#logs').css('height', '78px').removeClass('opened');
		} else {
			$('#logs').css('height', '200px').addClass('opened');
		}
	});
});

/**
 * Get current player location.
 */
getLocation = () => {
	getMyLocation().then(location => {
        myLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };

		currentPlayer.location.latitude = location.coords.latitude;
		currentPlayer.location.longitude = location.coords.longitude;

		addLocationMarker(currentPlayer);

		if (firstOpening) {
			firstOpening = false;

			map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
		}

		writeLog(`${currentPlayer.name} (${currentPlayer.callsign}) updated.`, 'info');
	}).catch(error => {
		showLocationError(error);
	});
};

/**
 * Get other players locations.
 */
getOtherPlayersLocations = () => {
	players = [];

	let template = `
		<li data-latitude="${currentPlayer.location.latitude}" data-longitude="${currentPlayer.location.longitude}">
			<em style="color: ${currentPlayer.teamColor};">&bull;</em>${currentPlayer.name} (${currentPlayer.callsign})
		</li>
	`;

	const date = new Date();

	date.setHours(date.getHours() - 12);

	database.collection('players').where('lastUpdated', '>=', date).get().then(snap => {
		snap.forEach(doc => {
			if (doc.data().playerId != currentPlayer.playerId) {
				const player = {
					id: doc.id,
					name: doc.data().name,
					photo: doc.data().photo,
					token: doc.data().token,
					playerId: doc.data().playerId,
					callsign: doc.data().callsign,
					teamColor: doc.data().teamColor,
					location: {
						latitude: doc.data().location.latitude,
						longitude: doc.data().location.longitude,
					},
					lastUpdated: doc.data().lastUpdated,
				};
	
				players.push(player);
	
				addLocationMarker(player);

				template += `
					<li data-latitude="${doc.data().location.latitude}" data-longitude="${doc.data().location.longitude}">
						<em style="color: ${doc.data().teamColor};">&bull;</em>${doc.data().name} (${doc.data().callsign})
					</li>
				`;
			}

			$('#logs ul').removeClass('hidden').empty().html(template);
		});

		writeLog(`Other players (${players.length}) located.`, 'info');
    }).catch(error => {
        writeLog(error, 'error');
    });
};

/**
 * Prepare google map object.
 */
prepareMap = () => {
	map = new google.maps.Map(document.getElementById('map'),
	{
		zoom: 19,
		center: {
			lat: 41.089524,
			lng: 29.023046,
		},
		zoomControl: true,
		scrollWheel: false,
		scaleControl: false,
		rotateControl: true,
		clickableIcons: false,
		mapTypeControl: true,
		disableDefaultUI: true,
		streetViewControl: false,
		fullscreenControl: false,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_TOP,
		},
		mapTypeControlOptions: {
			mapTypeIds: [
				google.maps.MapTypeId.ROADMAP,
				google.maps.MapTypeId.SATELLITE,
			],
		},
	});

	//setMapStyles();

	getLocation();

	setInterval(() => {
		getLocation();
		getOtherPlayersLocations();
	}, 10000);

	closeFullscreenLoader();
};

/**
 * Add location marker to the map and global markers array.
 *
 * @param {object} player - Player details
 */
addLocationMarker = player => {
	const markerFound = checkLocationMarker(player);

	if (!markerFound.status) {
		const marker = new google.maps.Marker({
			map: map,
			draggable: false,
			position: {
				lat: player.location.latitude,
				lng: player.location.longitude,
			},
			playerId: player.playerId,
			playerInfo: `${player.name} (${player.callsign})`,
			icon: {
				url: `https://maps.google.com/mapfiles/ms/icons/${player.teamColor}-dot.png`,
			},
		});

		markers.push(marker);
		
		const infoWindowContent = `
			<div class="infowindow">
				<span class="name">${player.name}</span>
				<span class="callsign" style="color: ${player.teamColor}">${player.callsign}</span>
			</div>
		`;

		const infoWindow = new google.maps.InfoWindow({
			content: infoWindowContent,
		});

		marker.addListener('mouseover', function () {
			infoWindow.open(map, marker);
		});

		marker.addListener('mouseout', function () {
			infoWindow.close();
		});
	} else {
		updateLocationMarker(player);
	}
};

/**
 * Update marker location.
 * 
 * @param {object} player - Player details
 */
updateLocationMarker = player => {
	const markerFound = checkLocationMarker(player);

	if (markerFound) {	
		const marker = markerFound.marker;

		marker.setPosition(new google.maps.LatLng(player.location.latitude, player.location.longitude));

		if (currentPlayer.playerId === player.playerId) {
			updatePlayer(player.id, player).then(() => {
				storageTool.setItem('player', JSON.stringify(player)).then(() => {
					currentPlayer.lastUpdated = getTimeStamp();
					
					writeLog(`${player.name} update performed.`, 'info');
				});
			}).catch(error => {
				writeLog(`Error updating player. ${JSON.stringify(error.message)}`, 'error');
			});
		}
	}
};

/**
 * Check location marker from global markers array.
 *
 * @param {object} player - Player details
 */
checkLocationMarker = player => {
	let result = {
		index: -1,
		status: false,
		lat: 0,
		lng: 0,
		marker: undefined,
	};

	markers.forEach((m, i) => {
		if (m.playerId === player.playerId) {
			result = {
				index: i,
				status: true,
				lat: m.position.lat(),
				lng: m.position.lng(),
				marker: m,
			};
		}
	});

	return result;
};

/**
 * Remove location marker from the map and global markers array.
 *
 * @param {object} player - Player details
 */
removeLocationMarker = player => {
	const markerFound = checkLocationMarker(player);

	if (markerFound.status) {
		markers[markerFound.index].setMap(null);
		markers.splice(markerFound.index, 1);
	}
};
