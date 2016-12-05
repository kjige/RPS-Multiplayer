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
    var players = db.ref('Players');
    var names = db.ref('Names');
    var picks = db.ref('Picks');
    var wins = db.ref('Wins');
    var losses = db.ref('Losses');

    // player1 is present or not in game room
    var p1Present = false;
    // player2 is present or not in game room
    var p2Present = false;
    // player 1's name
    var p1Name;
    // player 2's name
    var p2Name;
    // data from RPS buttons
    var button;
    // which player made a move
    var player;
    // what move did the player pick
    var picked;
    // flag if the player 1 already made a move
    var p1Set = true;
    // flag if the player 2 already made a move
    var p2Set = true;
    // what move did player 1 make
    var p1Pick = '';
    // what move did player 2 make
    var p2Pick = '';
    // result of the match
    var result;
    // player 1 wins
    var p1Wins;
    // player 1 losses
    var p1Losses;
    // player 2 wins
    var p2Wins;
    // player 2 losses
    var p2Losses;

    whichPlayerPresent();
    // click event listener for name submit button
    $('.submit-name').on('click', addPlayerName);
    // click event listener for players' move
    $('.btn-rps').on('click', getData);

    // check which player is present in the game room
    function whichPlayerPresent() {
        players.once('value', function (snapshot) {
            p1Present = snapshot.val().player1;
            p2Present = snapshot.val().player2;
            if (p1Present) {
                hideForm1();
            }
            if (p2Present) {
                hideForm2();
            }
            if (p1Present || p2Present) {
                updateName1OnDOM();
                updateName2OnDOM();
            }
        });
    }

    function hideForm1() {
        $('.form-1').hide();
    }

    function hideForm2() {
        $('.form-2').hide();
    }

    // stores players' names
    function addPlayerName() {
        // determine which player submitted name
        player = $(this).data('player');
        // if player 1 submitted
        if (player === 1) {
            // saves player 1's name
            p1Name = $('.name-1').val().trim();
            // update firebase with player's values
            db.ref('Names/player1').set(p1Name);
            p1Present = true;
            db.ref('Players/player1').set(p1Present);
            whichPlayerPresent();
            hideForm1();
            hideForm2();
            updateName1OnDOM();
        }
        // if player 2 submitted
        if (player === 2) {
            // saves player 2's name
            p2Name = $('.name-2').val().trim();
            // update firebase with player's values
            db.ref('Names/player2').set(p2Name);
            p2Present = true;
            db.ref('Players/player2').set(p2Present);
            whichPlayerPresent();
            hideForm1();
            hideForm2();
            updateName2OnDOM();
        }
    }

    // display player1's name on DOM
    function updateName1OnDOM() {
        db.ref('Names/player1').once('value', function (snapshot) {
            p1Name = snapshot.val();
            var a = $('<h3>').html(p1Name).addClass('center-block');
            $('.player1-name').empty().append(a);
        });
    }

    // display player1's name on DOM
    function updateName2OnDOM() {
        db.ref('Names/player2').once('value', function (snapshot) {
            p2Name = snapshot.val();
            var a = $('<h3>').html(p2Name).addClass('center-block');
            $('.player2-name').empty().append(a);
        });
    }

    function resetScore() {

    }

    // determine which player made what move
    function getData() {
        var a = $(this).data('pick');
        // determines which player made this move
        button = a.slice(-1);
        // determines what move this player made
        picked = a.slice(0, 1);
        updatePicks();
    }

    // store players' moves
    function updatePicks() {
        // check if player 1 is making a move and pressing the right keys
        if (player === 1 && button === 1) {
            // store player 1's move in firebase
            db.ref('Picks/player1').set(picked);
        }
        // check if player 2 is making a move and pressing the right keys
        if (player === 2 && button === 2) {
            // store player 2's move in firebase
            db.ref('Picks/player2').set(picked);
        }
    }

    // check if both players made their moves
    function checkMoves() {
        if (db.ref('player1/Pick').exists() && db.ref('player2/Pick').exists()) {

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

    function updateDOM() {

    }

    function resetPicks() {

    }
});