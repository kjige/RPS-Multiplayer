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
    // var players = db.ref('Players');
    // var names = db.ref('Names');
    // var picks = db.ref('Picks');
    // var wins = db.ref('Wins');
    // var losses = db.ref('Losses');

    // var p1Present = false; // player1 is present or not in game room
    // var p2Present = false; // player2 is present or not in game room

    var name = ''; // player's name
    var button; // data from RPS buttons
    var player = 0; // user is this player number
    var picked; // what move did the player pick
    var p1Set = true; // flag if the player 1 already made a move
    var p2Set = true; // flag if the player 2 already made a move
    var p1Pick = ''; // what move did player 1 make
    var p2Pick = ''; // what move did player 2 make
    var result; // result of the match
    var p1Wins; // player 1 wins
    var p1Losses; // player 1 losses
    var p2Wins; // player 2 wins
    var p2Losses; // player 2 losses

    var connection = db.ref('.info/connected'); // check client's connection status to firebase

    // when player disconnects, remove player and name from those lists
    connection.on('value', function (snapshot) {
        if (!snapshot.val()) {
            db.ref('Names/player' + player).set(0);
            db.ref('Players/' + name).remove();
        }
    });
    // db.ref('Names/' + name).onDisconnect().remove();

    // listen for players' moves
    db.ref('Picks/player1').on('value', function (snapshot) {
        p1Pick = snapshot.val();
    });
    db.ref('Picks/player1').on('value', function (snapshot) {
        p1Pick = snapshot.val();
    });

    // checkPlayerPresentFirebase();
    // click event listener for name submit button
    $(document).on('click', '.submit-name', addPlayer);
    // click event listener for players' move
    $(document).on('click', '.btn-rps', savePlayerMove);

    // check firebase for which player is present in room
    function checkPlayerPresentFirebase() {
        players.once('value', function (snapshot) {
            p1Present = snapshot.val().player1;
            p2Present = snapshot.val().player2;
        });
        // checkPresentPlayer();
    }

    // check which player is present in the game room
    function checkPresentPlayer() {
        if (p1Present === true) {
            hideForm1();
            updateName1OnDOM();
        } else if (p2Present === true) {
            hideForm2();
            updateName2OnDOM();
        }
    }

    function hideForm1() {
        $('.form-1').hide();
    }

    function hideForm2() {
        $('.form-2').hide();
    }


    function addPlayer() {
        player = $(this).data('player'); // determine which player submitted name
        name = $('.name-' + player).val().trim(); // store player's name from input box
        db.ref('Names/player' + player).set(name); // update firebase with player's values
        db.ref('Players/' + name).set('player' + player); // mark player as present in firebase
        db.ref('Wins/player' + player).set(0); // reset wins to 0
        db.ref('Losses/player' + player).set(0); // reset losses to 0
        db.ref('Picks/player' + player).set(''); // reset picks
        // checkPresentPlayer();
        hideForm1();
        hideForm2();
        updateName1OnDOM();
        updateName2OnDOM();
    }

    // display player1's name on DOM
    function updateName1OnDOM() {
        db.ref('Names/player1').once('value', function (snapshot) {
            name = snapshot.val();
            var a = $('<h3>').html(name).addClass('center-block');
            $('.player1-name').empty().append(a);
        });
    }

    db.ref('Names/player1').on('value', function (snapshot) {
        if (snapshot.val().length > 0) {
            updateName1OnDOM();
        }
    });

    db.ref('Names/player2').on('value', function (snapshot) {
        if (snapshot.val().length > 0) {
            updateName2OnDOM();
        }
    });

    // display player2's name on DOM
    function updateName2OnDOM() {
        db.ref('Names/player2').once('value', function (snapshot) {
            name = snapshot.val();
            var a = $('<h3>').html(name).addClass('center-block');
            $('.player2-name').empty().append(a);
        });
    }

    function resetScore() {

    }

    // save player's move
    function savePlayerMove() {
        picked = $(this).data('pick');
        db.ref('Picks/player' + player).set(picked); // store player's move in firebase
        checkMoves();
    }

    // check if both players made their moves
    function checkMoves() {
        p1Pick = db.ref('Picks/player1');
        p2Pick = db.ref('Picks/player2');
        if (p1Pick.length > 0 && p2Pick.length > 0) {
            checkWinner();
        }
    }

    function checkWinner() {
        if (p1Pick === p2Pick) {
            result = 'tie';
        }
        if (p1Pick === 'r' && p2Pick === 'p') {}
    }

    function updateScore() {

    }

    function resetPicks() {

    }
});