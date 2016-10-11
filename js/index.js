$(document).ready(function() {
  controller.init();
});
var player1="USER";
var player2="COMPUTER";
// var defualtBoard={0:"",1:"",2:"",3:"",4:"",5:"",6:"",7:"",8:""};
var defualtBoard=["","","","","","","","",""];
var model = {
  userSelection: "",
  computerSelection: "",
  currentTurn: "",
  currentBoardState:defualtBoard,
  // actualBoard:function(){
  //   var  subarr=[],mainArr=[];
  //   for (var i = 0; i < this.currentBoardState.length; i++) {
  //     subarr.push(this.currentBoardState[i]);
  //     if(i==2 || i==5 || i==8){mainArr.push(subarr); subarr=[];}
  //   }
  //   return mainArr;
  // },
  winningScenarios:function(){
    var  subarr=[],mainArr=[];
    //for vertical
    for (var i = 0; i < this.currentBoardState.length; i++) {
      subarr.push(this.currentBoardState[i]);
      if(subarr.length==3){mainArr.push(subarr); subarr=[];}
    }
    //for horizontal
    mainArr.push([this.currentBoardState[0],this.currentBoardState[3],this.currentBoardState[6]]);
    mainArr.push([this.currentBoardState[1],this.currentBoardState[4],this.currentBoardState[7]]);
    mainArr.push([this.currentBoardState[2],this.currentBoardState[5],this.currentBoardState[8]]);
    mainArr.push([this.currentBoardState[0],this.currentBoardState[4],this.currentBoardState[8]]);
    mainArr.push([this.currentBoardState[2],this.currentBoardState[4],this.currentBoardState[6]]);
    return mainArr;
  },
  WonBy:null,
  WoninRow:null,
  status:"playing"
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
  allValuesSame:function(mainarray,player) {
    var Won=false,previous=true;
    mainarray.forEach(function(element) {
      if(element ===player){
        if(previous ===true){
          previous=true;
          Won=true;
        }
      }else{
        previous=false;
        Won=false;}
      });
      return Won;
    },
    checkForplayerOne:function(){
      var board=model.winningScenarios();
      for(var a=0;a<board.length;a++){
        if(this.allValuesSame(board[a],0)){
          model.WoninRow=a;
          return true;
        }
      }
    },
    checkForplayerTwo:function(){
      var board=model.winningScenarios();
      for(var a=0;a<board.length;a++){
        if(this.allValuesSame(board[a],1)){
          model.WoninRow=a;
          return true;
        }
      }
    },
    winningStatus:function(){
     if(this.checkForplayerOne()){
       model.WonBy="player1";
       console.log("WON IT!!!! "+model.WonBy+" in "+ model.WoninRow);
     }
     else if(this.checkForplayerTwo()){
         model.WonBy="player2";
         console.log("WON IT!!!! "+model.WonBy+" in "+ model.WoninRow);
     }
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
           model.currentBoardState[$(".inputBox").index(this)]=1
         } else if (controller.getCurrentTurn() == player1) {
           $(this).text(model.userSelection);
           model.currentBoardState[$(".inputBox").index(this)]=0
         }

        controller.winningStatus();
        controller.getCurrentTurn()==player2 ? view.showCurrentTurn(player1) : view.showCurrentTurn(player2);
        // console.log(controller.getCurrentTurn());
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
