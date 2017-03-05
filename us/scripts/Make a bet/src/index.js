require('./../../../js/protoDelay.js')();
var $ = require('./../../../js/dom.js');

const ajax = require('./../../../js/request.js');
const bindEvent = require('./../../../js/events.js');
const $ls = require('./../../../js/ls.js');
const setStyle = require('./../../../js/style.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var $answer, $data, $password;

$password = "";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

loadData();
createGUI();

if($data.work){
  getOldResult();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getOldResult(){
  var url, result, game;

  url = $('a:contains("~Результат прошлой игры")').node();

  if(url){
    game = url.textContent.match(/Результат прошлой игры \((.+)\)/)[1];

    if($data.game != game){
      ajax(url.href, "GET", null).then((r)=>{
        result = $($answer)
          .html(r.text)
          .find('div.m1:contains("~Игра ")')
          .find('b')
          .text();
        result = Number(result);

        //console.log("Get last result");

        $data.makeBet = [false, false];
        $data.game = game;
        $data.last = result;

        generateBets();
        saveData();

        makeABet.gkDelay(randomNumber(25, 83) * 100);
      });
    }else{
      makeABet.gkDelay(randomNumber(25, 83) * 100);
    }
  }else{
    //console.log("Url not found");
    reloadPage.gkDelay(randomNumber(30, 200) * 100);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeABet(){
  var bet, input, pass, b, button;

  bet = $('input[name="bet"]').node();

  if(bet){
    b = 0;
    if($data.makeBet[b]) b = 1;
    if($data.makeBet[b]){
      reloadPage.gkDelay(randomNumber(180, 360) * 1000);
      //console.log("Wait next game.");
      return;
    }

    pass = $('input[name="trans"]').node();
    button = $('a:contains("Сделать ставку!")').node();

    bet.value = $data.bet;
    $(`img[onclick="putbet(${$data.bets.now[b]})"]`).node().click();
    $data.makeBet[b] = true;
    if(pass) pass.value = $password;

    make.gkDelay(randomNumber(30, 50) * 100);
    //console.log("Set bet " + (b + 1));
  }else{
    //console.log("Bet not found!");
    reloadPage.gkDelay(randomNumber(30, 80) * 1000);
  }

  function make(){
    saveData();
    button.click();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI(){
  var node, gui, hidden, value;

  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('make_a_bet.js', '@include: ./html/index.css, true');

  gui = $('<span>').attr("id", "mb_gui").html('@include: ./html/gui.html, true').node();
  node = $('td[valign="top"]:contains("~Максимальная сумма ставок")').find('table').node(2);
  node.parentNode.insertBefore(gui, node.nextElementSibling);

  /////////////////////////////

  $(gui).find('span[class="money-input"]').each((span)=>{
    bindEvent(span.firstElementChild, 'onkeyup', function(input){
      hidden = input.nextElementSibling;
      value = Number(input.value.replace(/,/g, ""));
      hidden.value = isNaN(value) ? 0 : value;
      input.value = convertID(hidden.value);
    });
  });

  bindEvent($('#saveBetButton'), "onclick", saveBet);
  bindEvent($('#switchModeButton'), "onclick", changeState);

  /////////////////////////////

  function saveBet(button){
    var bet;

    bet = Number(button.previousElementSibling.lastElementChild.value);
    button.value = "√";
    $data.bet = bet;
    saveData();
    setTimeout(function(){button.value = "Ok"}, 1500);
  }
  /////////////////////////////

  function changeState(button){
    $data.work = !$data.work;
    button.value = $data.work ? "Остановить" : "Запустить";
    saveData();
    reloadPage();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateBets(){
  var rows;
  var oneBet, twoBet;
  rows = $('#mab_data').find('td').nodes();

  $data.bets.old[0] = $data.bets.now[0];
  $data.bets.old[1] = $data.bets.now[1];

  rows[4].innerHTML = $data.bets.old[0];
  rows[5].innerHTML = $data.bets.old[1];
  rows[1].innerHTML = $data.last;

  oneBet = $data.last - $data.bets.old[0];
  twoBet = $data.last + $data.bets.old[1];

  if(oneBet < 1) oneBet = oneBet + 36;
  if(twoBet > 36) twoBet = twoBet - 36;

  rows[2].innerHTML = oneBet;
  rows[3].innerHTML = twoBet;

  $data.bets.now[0] = oneBet;
  $data.bets.now[1] = twoBet;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $answer = $('<span>').node();
  $data = $ls.load("gk_mab_data");

  if($data.last == null){
    $data = {
      work: true,
      bet: 1,
      last: 0,
      bets: {
        now: [1, 36],
        old: [1, 36]
      },
      game: null,
      makeBet: [false, false]
    };

    saveData();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveData(){
  $ls.save("gk_mab_data", $data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function reloadPage(){
  location.href = "http://www.ganjawars.ru/roulette.php";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function randomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function convertID(value){
  var result, vs, i, j;

  if(value < 1000) return value;

  vs = value + "";
  j = 1; i = vs.length;
  result = "";

  while(i--){
    result = vs.charAt(i) + result;
    if(j%3 == 0 && j != 0 && i != 0){
      result = ',' + result;
    }
    j++
  }

  return result;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////