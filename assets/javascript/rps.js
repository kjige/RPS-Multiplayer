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
    // player 1's name
    var p1Name;
    // player 2's name
    var p2Name;
    // which player made a move
    var player;
    // what move did the player pick
    var picked;
    // flag if the player 1 already made a move
    var p1Set = true;
    // flag if the player 2 already made a move
    var p2Set = true;
    // what move did player 1 make
    var p1Pick = 0;
    // what move did player 2 make
    var p2Pick = 0;
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

    // click event listener for name submit button
    $('.submit-name').on('click', addPlayerName);
    // click event listener for players' move
    $('.btn-rps').on('click', getData);

    // captures players' names to var
    function addPlayerName() {
        // determine which player submitted name
        var a = $(this).data('player');
        // if player 1 submitted
        if (a === 1) {
            // saves player 1's name
            p1Name = $('.name-' + a).val().trim();
            // hides player 1's form after submitting name
            $('.form-1').hide();
        }
        // if player 2 submitted
        if (a === 2) {
            // saves player 2's name
            p2Name = $('.name-' + a).val().trim();
            // hides player 2's form after submitting name
            $('.form-2').hide();
        }
    }

    function resetScore() {

    }

    // determine which player made what move
    function getData() {
        var a = $(this).data('pick');
        // determines which player made this move
        player = parseInt(a.slice(-1));
        // determines what move this player made
        picked = a.slice(0, 1);
        updatePicks();
    }

    // store players' moves
    function updatePicks() {
        // check if player 1 already made a move
        if (p1Set) {
            if (player === 1) {
                // store player 1's move
                p1Pick = picked;
                // set flag to false after player 1's move
                p1Set = false;
            }
        }
        // check if player 2 already made a move
        if (p2Set) {
            if (player === 2) {
                // store player 2's move
                p2Pick = picked;
                // set flag to false after player 2's move
                p2Set = false;
            }
        }
        checkWinner();
    }

    function checkWinner() {

    }

    function updateScore() {

    }

    function updateDOM() {

    }

    function resetPicks() {

    }
});