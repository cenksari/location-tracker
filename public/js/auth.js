$(() => {
    firebase.auth().getRedirectResult().then(result => {
        if (result.credential) {
            const user = result.user;
            const uid = user.uid;
            const name = user.displayName;
            const email = user.email;
            const photo = user.photoURL;
            const token = result.credential.accessToken;
            
            const player = {
                uid,
                name,
                email,
                photo,
                token,
            };

            findPlayer(player);
        }
    }).catch(error => {
        writeLog(error.message, 'error');
    });

    $('body').on('click', '#signin', function() {
        firebase.auth().signInWithRedirect(provider);
    });

    $('body').on('click', '#signout', function() {
        firebase.auth().signOut().then(() => {
            storageTool.removeItem('player').then(() => {
                console.log('Player signed out!');

                document.location = 'index.html';
            });
        })
        .catch(error => {
            writeLog(error, 'error');
        });
    });
});

/**
 * Find player.
 * 
 * @param {object} player - Player details
 */
findPlayer = player => {
    database.collection('players').where('email', '==', player.email).get().then(snap => {
        const docsCount = snap.docs.length;

        if (docsCount > 0) {
            $('#logo,#content,#logs').remove();
            
            showFullscreenLoader();

            snap.forEach(doc => {
                currentPlayer = {
                    id: doc.id,
                    name: player.name,
                    photo: player.photo,
                    token: player.token,
                    playerId: doc.data().playerId,
                    callsign: doc.data().callsign,
                    teamColor: doc.data().teamColor,
                    location: {
                        latitude: myLocation.latitude,
                        longitude: myLocation.longitude,
                    },
                    lastUpdated: getTimeStamp(),
                };

                updatePlayer(doc.id, currentPlayer).then(() => {
                    writeLog(`Player ${currentPlayer.name} successfully signed in. Please wait while you're redirecting.`, 'info');

                    storageTool.setItem('player', JSON.stringify(currentPlayer)).then(() => {
                        document.location = 'map.html';
                    });
                })
                .catch(error1 => {
                    writeLog(`Error updating player. ${JSON.stringify(error1.message)}`, 'error');
                });
            });
        } else {
            writeLog(`Player ${name} is not registered. Please contact administrator to add your contact information.`, 'info');
        }
    }).catch(error2 => {
        writeLog(error2, 'error');
    });
};

/**
 * Update player.
 * 
 * @param {object} player - Player details
 */
updatePlayer = (docId, player) => {
    return new Promise((resolve, reject) => {        
        database.collection('players').doc(docId).update(
            {
                photo: player.photo,
                token: player.token,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                location: new firebase.firestore.GeoPoint(player.location.latitude, player.location.longitude),
            }
        ).then(data => {
            resolve ({
                message: data,
            });
        })
        .catch(error => {
            reject({
                message: error,
            });
        });
    });
};
