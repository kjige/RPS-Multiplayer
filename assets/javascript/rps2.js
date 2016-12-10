$(document).ready(function () {
    // setup firebase
    var config = {
        apiKey: "AIzaSyDQlT9EqcpBM1DNglo2Wb6AVCjZ0mPGe5o",
        authDomain: "rps-multiplayer-87233.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-87233.firebaseio.com",
        storageBucket: "rps-multiplayer-87233.appspot.com",
        messagingSenderId: "396369385554"
    };
    firebase.initializeApp(config);

    var db = firebase.database();
    var con = db.ref().push().key;

    var name = ''; // player's name
    var button; // data from RPS buttons
    var player = 0; // user is this player number
    var opponent = 0;
    var picked = 0; // what move did the player pick
    var opponentPicked = 0;
    var p1Set = true; // flag if the player 1 already made a move
    var p2Set = true; // flag if the player 2 already made a move
    var p1Pick = ''; // what move did player 1 make
    var p2Pick = ''; // what move did player 2 make
    var result; // result of the match
    var p1Wins; // player 1 wins
    var p1Losses; // player 1 losses
    var p2Wins; // player 2 wins
    var p2Losses; // player 2 losses
    var wins = 0;
    var loss = 0;

    var connection = db.ref('.info/connected'); // check client's connection status to firebase

    // when player disconnects, remove player and name from those lists
    connection.on('value', function (snapshot) {
        db.ref('Disconnected').onDisconnect().set(true);
        db.ref('Disconnected').on('value', function (snapshot) {
            if (snapshot.val() === true) {
                db.ref('Names/player' + opponent).remove();
                db.ref('Picks/player' + opponent).remove();
                db.ref('Wins/player' + opponent).remove();
                db.ref('Losses/player' + opponent).remove();
                db.ref('Disconnected').set(false);
                db.ref('Messages').remove();
            }
        });
    });

    // listen for player's moves
    db.ref('Picks/player' + player).on('value', function (snapshot) {
        if (snapshot.val() !== null) {
            picked = snapshot.val();
            checkMoves();
        }
    });

    // listen for opponent's moves
    db.ref('Picks/player' + opponent).on('value', function (snapshot) {
        if (snapshot.val() !== null) {
            opponentPicked = snapshot.val();
            checkMoves();
        }
    });

    // listen for player 1's name
    db.ref('Names/player1').on('value', function (snapshot) {
        if (snapshot.val()) {
            updateName1OnDOM();
        }
    });

    // listen for player 2's name
    db.ref('Names/player2').on('value', function (snapshot) {
        if (snapshot.val()) {
            updateName2OnDOM();
        }
    });

    // click event listener for name submit button
    $(document).on('click', '.submit-name', addPlayer);

    // click event listener for players' move
    function clickForRPS() {
        $(document).off('click', '.btn-rps').on('click', '.btn-rps', savePlayerMove);
    }

    // hide player 1's form
    function hideForm1() {
        $('.form-1').hide();
    }

    // hide player 2's form
    function hideForm2() {
        $('.form-2').hide();
    }

    function addPlayer() {
        player = $(this).data('player'); // determine which player submitted name
        if (player === 1) {
            opponent = 2;
        } else if (player === 2) {
            opponent = 1;
        }
        console.log('player' + player);
        console.log('opponent' + opponent);
        name = $('.name-' + player).val().trim(); // store player's name from input box
        db.ref('Names/player' + player).set(name); // update firebase with player's values
        db.ref('Players/' + name).set('player' + player); // mark player as present in firebase
        db.ref('Wins/player' + player).set(0); // reset wins to 0
        db.ref('Losses/player' + player).set(0); // reset losses to 0
        db.ref('Picks/player' + player).set(''); // reset picks
        hideForm1();
        hideForm2();
        updateName1OnDOM();
        updateName2OnDOM();
        clickForRPS();
    }

    updateName1OnDOM();
    updateName2OnDOM();
    // display player1's name on DOM
    function updateName1OnDOM() {
        db.ref('Names/player1').once('value', function (snapshot) {
            name = snapshot.val();
            if (name !== null) {
                var a = $('<h3>').html(name).addClass('center-block');
                $('.player1-name').empty().append(a);
            }
        });
    }

    // display player2's name on DOM
    function updateName2OnDOM() {
        db.ref('Names/player2').once('value', function (snapshot) {
            name = snapshot.val();
            if (name !== null) {
                var a = $('<h3>').html(name).addClass('center-block');
                $('.player2-name').empty().append(a);
            }
        });
    }

    function resetScore() {

    }

    // save player's move
    function savePlayerMove() {
        clickForRPS();
        picked = $(this).data('pick');
        db.ref('Picks/player' + player).set(picked); // store player's move in firebase
        // console.log(picked);
        db.ref('Picks/player' + opponent).on('value', function (snapshot) {
            if (snapshot.val() !== null) {
                opponentPicked = snapshot.val();
                checkMoves();
            }
        });
    }

    // check if both players made their moves
    function checkMoves() {
        // console.log('checkMoves1');
        if (picked.length !== null) {
            // console.log('checkMoves3');
            if (opponentPicked.length !== null) {
                // console.log('checkMoves2');
                checkWinner();
            }
        }
    }

    function checkWinner() {
        console.log('running checkWinner');
        if (picked === opponentPicked) {
            result = 'tie';
            updateScore();
        } else if (picked === 'rock' && opponentPicked === 'scissors') {
            wins++;
            console.log('picked+1');
            updateScore();
        } else if (picked === 'paper' && opponentPicked === 'rock') {
            wins++;
            console.log('picked+1');
            updateScore();
        } else if (picked === 'scissors' && opponentPicked === 'paper') {
            wins++;
            console.log('picked+1');
            updateScore();
        } else if (opponentPicked === 'rock' && picked === 'scissors') {
            loss++;
            console.log('opponentpicked+1');
            updateScore();
        } else if (opponentPicked === 'paper' && picked === 'rock') {
            loss++;
            console.log('opponentpicked+1');
            updateScore();
        } else if (opponentPicked === 'scissors' && picked === 'paper') {
            loss++;
            console.log('opponentpicked+1');
            updateScore();
        }
    }

    function updateScore() {
        db.ref('Wins/player' + player).set(wins);
        // console.log('wins' + wins);
        db.ref('Losses/player' + player).set(loss);
        // console.log('losses' + loss);
        // console.log('player' + player);
        db.ref('Picks/player' + player).set('');
        picked = '';
        opponentPicked = '';
    }

    db.ref('Wins/player1').on('value', function (snapshot) {
        // p1Wins = snapshot.val();
        // console.log('Wins/player' + player);
        if (snapshot.val() !== null) {
            // console.log('snapshot' + snapshot.val());
            $('.p1-wins').html(snapshot.val());
        }
    });

    db.ref('Wins/player2').on('value', function (snapshot) {
        // p2Wins = snapshot.val();
        // console.log('Wins/player' + opponent);
        if (snapshot.val() !== null) {
            // console.log('snapshot' + snapshot.val());
            $('.p2-wins').html(snapshot.val());
        }
    });

    db.ref('Losses/player1').on('value', function (snapshot) {
        // p1Losses = snapshot.val();
        // console.log('Losses/player' + player);
        if (snapshot.val() !== null) {
            // console.log('snapshot' + snapshot.val());
            $('.p1-losses').html(snapshot.val());
        }
    });

    db.ref('Losses/player2').on('value', function (snapshot) {
        // p2Losses = snapshot.val();
        // console.log('Losses/player' + opponent);
        if (snapshot.val() !== null) {
            // console.log('snapshot' + snapshot.val());
            $('.p2-losses').html(snapshot.val());
        }
    });

    function resetPicks() {

    }
    $('#submit-msg').off('click').on('click', submitMsg);
    $("#submit-msg").keyup(function (event) {
        if (event.keyCode === 13) {
            submitMsg();
        }
    });

    function submitMsg() {
        var msg = $('.msg').val().trim();
        db.ref('Names/player' + player).once('value', function (snapshot) {
            db.ref('Messages').push().set(snapshot.val() + '\: ' + msg);
        });
        $('.msg').val('');
    }

    db.ref('Messages').on('child_added', function (snapshot) {
        console.log(snapshot.val());
        var e = snapshot.val();
        // for (var key in snapshot.val()) {
        // var a = $('<div>').html(e);
        // var ts = firebase.database.ServerValue.TIMESTAMP;
        // console.log(firebase.database.ServerValue.TIMESTAMP);
        var nt = new Date();
        var hours = nt.getHours();
        var mins = nt.getMinutes();
        var secs = nt.getSeconds();
        var time = '\(' + hours + ':' + mins + ':' + secs + '\) ' + e;
        // console.log(time);
        $('.msg-window').append($('<div>').html(time));
        // }
    });
});