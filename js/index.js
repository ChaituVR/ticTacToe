$(document).ready(function() {
    controller.init();
});
var player1 = "Player - 1";
var player2 = "Computer";
var defualtBoard = ["", "", "", "", "", "", "", "", ""];
var winningModes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                            [0, 4, 8],
                            [2, 4, 6]
];

var model = {
    userSelection: "",
    computerSelection: "",
    currentTurn: "",
    currentBoardState: defualtBoard,
    WonBy: null,
    WoninRow: null
};

var initialmodel =JSON.parse(JSON.stringify(model));

var controller = {
    init: function() {
        this.newGameState();
    },
    newGameState: function() {
        // model=initialmodel;
        // model.userSelection = "a";
        // model.computerSelection = "a";
        // model.currentBoardState = defualtBoard;
        model= initialmodel;
        view.removeAllClicks();
        view.loadUserClicks();
        view.loadOptionsClicks();
        view.changeToNewGame();
        view.showCurrentTurn("");

    },
    getWinningScenarios:function(board) {
        var subarr = [],
            mainArr = [];
        //for vertical
        for (var k in winningModes) {
            var p = winningModes[k];
            mainArr.push([board[p[0]], board[p[1]], board[p[2]]]);
        }

        return mainArr;
    },
    startGame: function() {
        if (model.userSelection != "a") {
            view.removeStartOptions();
            controller.mainGame();
        } else {
            view.showErrorMsg('Please select one option');
        }
    },
    updateUserSelection: function(currentValue) {
        model.userSelection = currentValue;
        console.log(model.userSelection);
        currentValue == "o" ? model.computerSelection = "x" : model.computerSelection = "o";
        currentValue == "x" ? model.currentTurn = player1 : model.currentTurn = player2;
    },
    alternateCurrentTurn: function() {
        model.currentTurn == player2 ? model.currentTurn = player1 : model.currentTurn = player2;
    },
    getCurrentTurn: function() {
        return model.currentTurn
    },
    allValuesSame: function(mainarray, player) {
        var Won = false,
            previous = true;
        mainarray.forEach(function(element) {
            if (element === player) {
                if (previous === true) {
                    previous = true;
                    Won = true;
                }
            } else {
                previous = false;
                Won = false;
            }
        });
        return Won;
    },
    checkForplayerOne: function(currentBoard, computerCheck) {
        var board = this.getWinningScenarios(currentBoard);
        for (var a = 0; a < board.length; a++) {
            if (this.allValuesSame(board[a], 0)) {
                if (computerCheck === undefined) {
                    model.WoninRow = a;
                }
                return true;
            }
        }
    },
    checkForplayerTwo: function(currentBoard, computerCheck) {
        var board = this.getWinningScenarios(currentBoard);
        for (var a = 0; a < board.length; a++) {
            if (this.allValuesSame(board[a], 1)) {
                if (computerCheck === undefined) {
                    model.WoninRow = a;
                }
                return true;
            }
        }
    },
    winningStatus: function() {
        if (this.checkForplayerOne(model.currentBoardState)) {
            model.WonBy = player1;
            view.showWinningStatus(model.WonBy + " Won!!!", model.WoninRow)
        } else if (this.checkForplayerTwo(model.currentBoardState)) {
            model.WonBy = player2;
            view.showWinningStatus(model.WonBy + " Won!!!", model.WoninRow)
        }
    },
    computerCheckForWinning(currentBoardStateforComputer) {
        if (this.checkForplayerOne(currentBoardStateforComputer, true)) {
            return "playerOne";

        } else if (this.checkForplayerTwo(currentBoardStateforComputer, true)) {
            return "playerTwo";

        }
    },
    mainGame() {
        if (controller.getCurrentTurn() == player2) {
            controller.playComputer();
        }
    },
    getEmptyPlaces(board) {
        var curr_board = JSON.parse(JSON.stringify(board));
        var temp = [];
        for (var i in curr_board) {
            if (curr_board[i] === "") {
                temp.push(parseInt(i));
            }
        }
        return temp;
    },
    playComputer() {
        var empty = controller.getEmptyPlaces(model.currentBoardState);
        if (empty.length == 9) {
            var random = empty[Math.floor(Math.random() * empty.length)];
            $(".inputBox:eq(" + random + ")").trigger('click');
        } else {
            var computerGenerated = this.minmax(empty);
            $(".inputBox:eq(" + computerGenerated + ")").trigger('click');
        }
    },
    minmax(emptyVals) {
        var currentBoardStateforComputer = [];
        currentBoardStateforComputer = JSON.parse(JSON.stringify(model.currentBoardState));
        var localTurn = 1;
        function endState(currentBoardStateforComputer) {
            return controller.computerCheckForWinning(currentBoardStateforComputer);
        }
        function recursionOfBoard(currentBoardStateforComputer, emptyVals, localTurn, stepsCount) {
            var scoreBoard = [];
            for (var a in emptyVals) {
                var b = emptyVals[a];
                var innerCurrentBoard = JSON.parse(JSON.stringify(currentBoardStateforComputer));
                innerCurrentBoard[b] = localTurn;
                var innerEmpty = controller.getEmptyPlaces(innerCurrentBoard);
                var ended = endState(innerCurrentBoard);
                if (!ended && innerEmpty.length > 0) {
                    if (localTurn == 1) {
                        scoreBoard[a] =Math.min.apply(null, recursionOfBoard(innerCurrentBoard, innerEmpty, 0, stepsCount + 1));
                    } else if (localTurn == 0) {
                        scoreBoard[a] =Math.max.apply(null, recursionOfBoard(innerCurrentBoard, innerEmpty, 1, stepsCount + 1));
                    }
                } else {
                    if (ended && localTurn == 1) {
                        scoreBoard[a] = 10;
                    } else if (ended && localTurn == 0) {
                        scoreBoard[a] = -10;
                    } else if (innerEmpty.length == 0) {
                        scoreBoard[a] = 0;
                    }
                }
            }
            return scoreBoard;

        }
        var deBoard = recursionOfBoard(currentBoardStateforComputer, emptyVals, localTurn, 0);
        console.log(deBoard);
        var putitin = Math.max.apply(null, deBoard);
        var selection = deBoard.indexOf(putitin);
        return emptyVals[selection];
    }
};

var view = {
    removeStartOptions: function() {
        $('.msgIndicator').hide();
        $(".resetbtn").show();
    },
    loadOptionsClicks: function() {
        $(".options").on('click', function() {
            $(".options").removeClass("optionsFocus");
            $(this).addClass("optionsFocus");
            controller.updateUserSelection(this.value);
            view.showCurrentTurn(controller.getCurrentTurn());
        });
    },
    loadUserClicks: function() {
        $(".inputBox").click(function() {
            if (controller.getCurrentTurn() == player2) {
                $(this).text(model.computerSelection);
                model.currentBoardState[$(".inputBox").index(this)] = 1
            } else if (controller.getCurrentTurn() == player1) {
                $(this).text(model.userSelection);
                model.currentBoardState[$(".inputBox").index(this)] = 0
            }

            controller.winningStatus();
            controller.getCurrentTurn() == player2 ? view.showCurrentTurn(player1) : view.showCurrentTurn(player2);
            $(this).off('click');
            controller.alternateCurrentTurn();
            controller.mainGame();
        });
    },
    showWinningStatus: function(winningStatustext, WoninRow) {
        var winningRowIndexes = winningModes[WoninRow];
        for (var a = 0; a < winningRowIndexes.length; a++) {
            $(".inputBox:eq( " + winningRowIndexes[a] + " )").addClass("winningRow");
        }
        // swal({
        //     title: winningStatustext,
        //     timer: 800,
        //     showConfirmButton: false,
        //     allowOutsideClick: true
        // }).done();
        $(".inputBox").off('click');
    },
    showCurrentTurn: function(current) {
        if (current == player2) {
            $('#currentTurn').text(player2+"'s turn");
        } else if (current == player1) {
            $('#currentTurn').text(player1+"'s turn");
        } else if (current == "") {
            $('#currentTurn').text("");
        }
    },
    showErrorMsg: function(errortext) {
        swal({
            title: errortext,
            type: 'warning',
            timer: 500,
            showConfirmButton: false,
            allowOutsideClick: true
        }).done();
    },
    changeToNewGame: function() {
        $(".resetbtn").hide();
        $(".inputBox").text("");
        $(".msgIndicator").show();
        $(".options").removeClass("optionsFocus");
        $(".inputBox").removeClass("winningRow");
    },
    removeAllClicks: function() {
        $(".inputBox").off();
        $(".options").off();
    }
};
