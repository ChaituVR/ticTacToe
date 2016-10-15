$(document).ready(function() {
    controller.init();
});
var player1 = "USER";
var player2 = "COMPUTER";
// var defualtBoard={0:"",1:"",2:"",3:"",4:"",5:"",6:"",7:"",8:""};
var defualtBoard = ["", "", "", "", "", "", "", "", ""];
var model = {
    userSelection: "",
    computerSelection: "",
    currentTurn: "",
    winningModes: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ],
    currentBoardState: defualtBoard,
    winningScenarios: function(board) {
        var subarr = [],
            mainArr = [];
        //for vertical
        for (var k in this.winningModes) {
            var p = this.winningModes[k];
            mainArr.push([board[p[0]], board[p[1]], board[p[2]]]);
            //mainArr.push([this.currentBoardState[p[0]], this.currentBoardState[p[1]], this.currentBoardState[p[2]]]);
        }

        // for (var i = 0; i < this.currentBoardState.length; i++) {
        //   subarr.push(this.currentBoardState[i]);
        //   if(subarr.length==3){mainArr.push(subarr); subarr=[];}
        // }
        // //for horizontal
        // mainArr.push([this.currentBoardState[0],this.currentBoardState[3],this.currentBoardState[6]]);
        // mainArr.push([this.currentBoardState[1],this.currentBoardState[4],this.currentBoardState[7]]);
        // mainArr.push([this.currentBoardState[2],this.currentBoardState[5],this.currentBoardState[8]]);
        // mainArr.push([this.currentBoardState[0],this.currentBoardState[4],this.currentBoardState[8]]);
        // mainArr.push([this.currentBoardState[2],this.currentBoardState[4],this.currentBoardState[6]]);
        return mainArr;
    },
    WonBy: null,
    WoninRow: null,
    status: "playing"
};

var controller = {
    init: function() {
        this.newGameState();
    },
    newGameState: function() {
        model.userSelection = "a";
        model.computerSelection = "a";
        model.currentBoardState = ["", "", "", "", "", "", "", "", ""];
        view.removeAllClicks();
        view.loadUserClicks();
        view.loadOptionsClicks();
        view.changeToNewGame();
        view.showCurrentTurn("")
    },
    startGame: function() {
        if (model.userSelection != "a") {
            // model.userSelection == "o" ? model.currentTurn = "COMPUTER" : model.currentTurn = "USER";
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
    checkForplayerOne: function(currentBoard) {
        var board = model.winningScenarios(currentBoard);
        for (var a = 0; a < board.length; a++) {
            if (this.allValuesSame(board[a], 0)) {
                model.WoninRow = a;
                return true;
            }
        }
    },
    checkForplayerTwo: function(currentBoard) {
        var board = model.winningScenarios(currentBoard);
        for (var a = 0; a < board.length; a++) {
            if (this.allValuesSame(board[a], 1)) {
                model.WoninRow = a;
                return true;
            }
        }
    },
    winningStatus: function() {
        if (this.checkForplayerOne(model.currentBoardState)) {
            model.WonBy = "Player 1";
            view.showWinningStatus(model.WonBy + " Won!!!", model.WoninRow)
                //console.log("WON IT!!!! "+model.WonBy+" in "+ model.WoninRow);

        } else if (this.checkForplayerTwo(model.currentBoardState)) {
            model.WonBy = "Player 2";
            view.showWinningStatus(model.WonBy + " Won!!!", model.WoninRow)
        }
    },
    computerCheckForWinning(){
      if (this.checkForplayerOne()) {

              //console.log("WON IT!!!! "+model.WonBy+" in "+ model.WoninRow);

      } else if (this.checkForplayerTwo()) {

      }
    },
    mainGame() {
        if (controller.getCurrentTurn() == player2) {
            //play computer
            controller.playComputer();
        }
        // else if (controller.getCurrentTurn() == player1) {
        //
        // }
    },
    getEmptyPlaces() {
        var curr_board = model.currentBoardState;
        var temp = [];
        for (var i in curr_board) {
            if (curr_board[i] === "") {
                temp.push(parseInt(i));
            }
        }
        return temp;
    },
    playComputer() {
        var empty = controller.getEmptyPlaces();
        if (empty.length == 9) {
            var random = empty[Math.floor(Math.random() * empty.length)];
            $(".inputBox:eq(" + random + ")").trigger('click');
        } else {
            var computerGenerated = this.minmax(empty);
            console.log(computerGenerated);
            $(".inputBox:eq(" + computerGenerated + ")").trigger('click');
        }
    },
    minmax(emptyVals) {
        var currentBoardStateforComputer= model.currentBoardState;
        // console.log(currentBoardStateforComputer);
        // console.log(emptyVals);
        for(var a in emptyVals){
          console.log(currentBoardStateforComputer);
          console.log(model.currentBoardState);
          var b = emptyVals[a];
          // currentBoardStateforComputer[b]=1;
          // currentBoardStateforComputer[emptyVals[a]] = 1;
          // this.computerCheckForWinning()
        }

        var random = emptyVals[Math.floor(Math.random() * emptyVals.length)];
        return random;
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
            // controller.mainGame();
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
            // console.log(controller.getCurrentTurn());
            $(this).off('click');
            controller.alternateCurrentTurn();
            controller.mainGame();
        });
    },
    showWinningStatus: function(winningStatustext, WoninRow) {
        var winningRowIndexes = model.winningModes[WoninRow];
        for (var a = 0; a < winningRowIndexes.length; a++) {
            $(".inputBox:eq( " + winningRowIndexes[a] + " )").addClass("winningRow");
        }
        swal({
            title: winningStatustext,
            // type: 'success',
            timer: 800,
            showConfirmButton: false,
            allowOutsideClick: true
        }).done();
        $(".inputBox").off('click');
    },
    showCurrentTurn: function(current) {
        if (current == player2) {
            $('#currentTurn').text("Player - 2's turn");
        } else if (current == player1) {
            $('#currentTurn').text("Player - 1's turn");
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
