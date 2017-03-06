require('./../../../js/protoDelay.js')();
var $ = require('./../../../js/dom.js');
var tabs = require('./../../../js/tabs.js');

const ajax = require('./../../../js/request.js');
const bindEvent = require('./../../../js/events.js');
const $ls = require('./../../../js/ls.js');
const setStyle = require('./../../../js/style.js');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var $answer, $data, $password, $tabs, $selectBet;

$password = "";
$selectBet = null;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

loadData();
createGUI();

if($data.fixed.work || $data.random.work){
  getOldResult.gkDelay(randomNumber(10, 30) * 100);
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

        $data.random.make = [false, false];
        $data.fixed.bets.forEach((bet)=>{bet.make = false});
        $data.random.last = result;
        $data.game = game;

        if($data.random.work) generateBets();
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
  var money, input, pass, button;
  var length;

  money = $('input[name="bet"]').node();

  if(money){
    pass = $('input[name="trans"]').node();
    button = $('a:contains("Сделать ставку!")').node();

    if($data.random.work && $data.fixed.work){
      //console.log("Make random. Next!");
      makeRandom(true);
    }else{
      if($data.random.work){
        //console.log("Make random.");
        makeRandom(false);
      }else{
        //console.log("Make fixed.");
        makeFixed();
      }
    }
  }else{
    //console.log("Bet not found!");
    reloadPage.gkDelay(randomNumber(30, 80) * 1000);
  }
  /////////////////////////////

  function makeRandom(next){
    var b;

    b = 0;
    if($data.random.make[b]) b = 1;
    if($data.random.make[b]){
      if(next){
        //console.log("Random done. Make fixed.");
        makeFixed();
        return;
      }else{
        //console.log("Bets done, wait update!");
        reloadPage.gkDelay(randomNumber(180, 360) * 1000);
        return;
      }
    }

    set(b, "random", $data.random.money, $data.random.bets.now[b]);
  }

  /////////////////////////////
  function makeFixed(){
    var key, b;

    for(b = 0, length = $data.fixed.bets.length; b < length; b++){
      if($data.fixed.bets[b].make == false){
        key = true;
        break;
      }
    }

    if(key){
      set(b, "fixed", $data.fixed.bets[b].money, $data.fixed.bets[b].bet);
    }else{
      //console.log("Bets done, wait update!");
      reloadPage.gkDelay(randomNumber(180, 360) * 1000);
    }
  }

  /////////////////////////////
  function set(b, mode, betMoney, bet){
    money.value = betMoney;
    $(`img[onclick="putbet(${bet})"]`).node().click();

    if(mode == "random"){
      $data[mode].make[b] = true;
    }else{
      $data[mode].bets[b].make = true;
    }

    if(pass) pass.value = $password;
    make.gkDelay(randomNumber(30, 50) * 100);

    //console.log("Set bet " + (b + 1) + ', mode: ' + mode);
  }
  /////////////////////////////

  function make(){
    saveData();
    button.click();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI(){
  var node, gui, hidden, value, tg;


  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('make_a_bet.js', '@include: ./html/index.css, true');

  gui = $('<div>').attr("id", "mb_gui").html('<br>').node();
  node = $('td[valign="top"]:contains("~Максимальная сумма ставок")').find('table').node(2);
  node.parentNode.insertBefore(gui, node.nextElementSibling);

  $tabs = tabs(["Постоянные ставки", "Случайные ставки"], 0);
  $tabs.append(gui);

  tg = $(gui).find('table[class="tabs-content"]').node();

  renderFixedModeGUI();
  renderRandomModeGUI();

  /////////////////////////////

  function renderRandomModeGUI(){
    tg.rows[1].cells[0].innerHTML = '@include: ./html/randomMode.html, true';

    bindEvent($("#mab_randomBet"), 'onkeyup', bindMoneyInputs);
    bindEvent($('#mab_saveRandomBet'), "onclick", saveBet, ["random"]);
    bindEvent($('#mab_randomWork'), "onclick", changeState, ["random"]);
  }
  /////////////////////////////

  function renderFixedModeGUI(){
    var rows = '';

    $data.fixed.bets.forEach((bet, id)=>{
      rows += '@include: ./html/fixedModeRow.html, true';
    });
    tg.rows[0].cells[0].innerHTML = '@include: ./html/fixedMode.html, true';

    bindEvent($('#mab_fixedAddBet'), "onclick", addBet);
    bindEvent($('#mab_fixedWork'), "onclick", changeState, ["fixed"]);
    $('td.remove-bet').each((node)=>{
      var row;

      row = node.parentNode;

      bindEvent(row.cells[1].firstElementChild.nextElementSibling, "onclick", saveBet, ["fixed"]);
      bindEvent(row.cells[0], "onclick", selectBet);
      bindEvent(row.cells[1].firstElementChild.firstElementChild, "onkeyup", bindMoneyInputs);
      bindEvent(node, "onclick", removeBet);
    });
    /////////////////////////////

    function addBet(){
      $data.fixed.bets.push({
        bet: 1, money: 1, make: false
      });
      saveData();
      renderFixedModeGUI();
    }
    /////////////////////////////

    function removeBet(button){
      var id;

      id = Number(button.firstElementChild.value);
      $data.fixed.bets.splice(id, 1);

      saveData();
      renderFixedModeGUI();
    }
    /////////////////////////////

    function selectBet(node){
      var old;

      old = node.innerHTML;
      $(node).class("add", "active").html('Выберете ставку со стола рулетки!');
      $selectBet = node.parentNode.rowIndex - 1;

      setTimeout(()=>{
        $(node).class("remove", "active").html(old);
        $selectBet = null;
      }, 10000);
    }
  }
  /////////////////////////////

  function saveBet(mode, button){
    var money, id;

    money = Number(button.previousElementSibling.lastElementChild.value);
    button.value = "√";

    if(mode == "random"){
      $data.random.money = money;
    }else{
      id = Number(button.nextElementSibling.value);
      $data.fixed.bets[id].money = money;
    }
    saveData();
    setTimeout(function(){button.value = "Ok"}, 1500);
  }
  /////////////////////////////

  function changeState(mode, button){
    $data[mode].work = !$data[mode].work;
    button.value = $data[mode].work ? "Остановить" : "Запустить";
    saveData();
    reloadPage();
  }
  /////////////////////////////

  function bindMoneyInputs(input){
    hidden = input.nextElementSibling;
    value = Number(input.value.replace(/,/g, ""));
    hidden.value = isNaN(value) ? 0 : value;
    input.value = convertID(hidden.value);
  }
  /////////////////////////////

  window.putbet = function(bet) {
    if(document.forms.rform && $selectBet == null){
      document.forms.rform.betn.value = bet;
      document.forms.rform.bettype.value = getNameBet(bet);
      return true;
    }else{
      $data.fixed.bets[$selectBet].bet = bet;
      $selectBet = null;
      saveData();
      renderFixedModeGUI();
    }
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateBets(){
  var rows;
  var oneBet, twoBet, bets, last;

  rows = $('#mab_data').find('td').nodes();
  bets = $data.random.bets;
  last = $data.random.last;

  bets.old[0] = bets.now[0];
  bets.old[1] = bets.now[1];

  rows[4].innerHTML = bets.old[0];
  rows[5].innerHTML = bets.old[1];
  rows[1].innerHTML = last;

  oneBet = last - bets.old[0];
  twoBet = last + bets.old[1];

  if(oneBet < 1) oneBet = oneBet + 36;
  if(twoBet > 36) twoBet = twoBet - 36;

  rows[2].innerHTML = oneBet;
  rows[3].innerHTML = twoBet;

  bets.now[0] = oneBet;
  bets.now[1] = twoBet;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $answer = $('<span>').node();
  $data = $ls.load("gk_mab_data");

  if($data.random == null){
    $data = {
      game: null,
      random: {
        work: false,
        money: 1,
        last: 0,
        bets: {
          now: [1, 36],
          old: [1, 36]
        },
        make: [false, false]
      },
      fixed: {
        work: false,
        bets: []
      }
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

function getNameBet(bet){
  var text;

  text = {
    37: 'Дюжина "1-12"',  40: 'Двенадцать номеров #3', 43: 'Числа 1-18',  46: 'Нечётное',
    38: 'Дюжина 13-24',   41: 'Двенадцать номеров #2', 44: 'Числа 19-36', 47: 'Красное',
    39: 'Дюжина "25-36"', 42: 'Двенадцать номеров #1', 45: 'Чётное',      48: 'Чёрное'
  };

  return bet <= 36 ? "Число " + bet :  text[bet];
}