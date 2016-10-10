$(document).ready(function() {
    controller.init();
});
var player1="USER";
var player2="COMPUTER";
var model = {
    userSelection: "",
    computerSelection: "",
    currentTurn: ""
};

var controller = {
    init: function() {
        this.newGameState();
    },
    newGameState: function() {
        model.userSelection = "a";
        model.computerSelection = "a";
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
    getCurrentTurn: function(){
      return model.currentTurn
    },
    mainGame: function() {

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
            console.log($(".inputBox").index(this));
            if (controller.getCurrentTurn() == player2) {
                $(this).text(model.computerSelection);
            } else if (controller.getCurrentTurn() == player1) {
                $(this).text(model.userSelection);
            }
            controller.getCurrentTurn()==player2 ? view.showCurrentTurn(player1) : view.showCurrentTurn(player2);
            console.log(controller.getCurrentTurn());
            $(this).off('click');

            controller.alternateCurrentTurn();

        });
    },
    showCurrentTurn:function(current){
      if(current==player2){
        $('#currentTurn').text("Player - 2's turn");
      }
      else if(current==player1){
        $('#currentTurn').text("Player - 1's turn");
      }
      else if(current==""){
        $('#currentTurn').text("");
      }
    },
    showErrorMsg: function(errortext) {
        swal({
            title: errortext,
            type: 'warning',
            timer: 500,
            showConfirmButton: false,
            allowOutsideClick:true
        }).done();
    },
    changeToNewGame: function() {
        $(".resetbtn").hide();
        $(".inputBox").text("");
        $(".msgIndicator").show();
        $(".options").removeClass("optionsFocus");
    },
    removeAllClicks:function(){
        $(".inputBox").off();
        $(".options").off();
    }
};
