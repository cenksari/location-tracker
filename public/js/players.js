$(() => {
	storageTool.getItem('player').then(data => {
		currentPlayer = JSON.parse(data);

		if (!currentPlayer) {
			document.location = 'index.html';
        } else {
            getPlayers();
        }
    });
});

/**
 * Get other players locations.
 */
getPlayers = () => {	
	players = [];

	database.collection('players').orderBy('lastUpdated', 'desc').get().then(snap => {
		snap.forEach(doc => {
            const player = {
                name: doc.data().name,
                callsign: doc.data().callsign,
                teamColor: doc.data().teamColor,
            };

            players.push(player);
        });

        players.forEach(p => {
            let dateTime = p.lastUpdated;

            try {
                dateTime = dateTime.toDate();
            } catch {
                dateTime = p.lastUpdated;
            }

            $('#content ul').append(`
                <li>
                    <strong>${p.name}</strong> - <span style="color: '${p.teamColor}'">${p.callsign}</span> (${dateTime})
                </li>
            `);
        });

		writeLog(`Players (${players.length}) loaded.`, 'info');
    }).catch(error => {
        writeLog(error, 'error');
    });
};
