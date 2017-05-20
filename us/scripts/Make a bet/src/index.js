require('./../../../js/protoDelay.js')();
var $ = require('./../../../js/dom.js');
var tabs = require('./../../../js/tabs.js');

const ajax = require('./../../../js/request.js');
const bindEvent = require('./../../../js/events.js');
const $ls = require('./../../../js/ls.js');
const setStyle = require('./../../../js/style.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var $answer, $data, $password, $tabs, $selectBet, $game;

$password = "";
$selectBet = null;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

loadData();
createGUI();
getGameNow();

if($data.fixed.work || $data.random.work || $data.past.work){
  run.gkDelay(randomNumber(10, 30) * 100);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getGameNow(){
  var url;

  url = $('a:contains("~Результат прошлой игры")').node();
  if(url) $game = Number(url.href.match(/(\d+)/)[1]);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function run(){
  var timeout = 50;

  if($game){ // ссылка на прошлую игру есть
    if($data.game != $game){ // у нас новая игра. обнуляем все данные
      //console.log("New game!");
      $data.game = $game;
      $data.random.make = [false, false];
      $data.fixed.bets.forEach((bet)=>{bet.make = false});
      $data.past.bets.forEach((bet)=>{
        bet.res[0].r = 0;
        bet.res[1].r = 0;
        bet.bet = 0;
        bet.make = false
      });
      saveData();

      // собираем новые данные

      if($data.random.work){
        //console.log("Get last game result. Random-mode.");
        getLastGameResult();
        timeout = 750;

        if(!$data.past.work){
          //console.log("Prepare make.");
          prepareMakeBets.gkDelay(randomNumber(20, 33) * 100);
        }
      }

      if($data.past.work){
        //console.log("Get last games result. Past-mode.");
        getPastModeResults.gkDelay(timeout, null, [0, $data.past.bets.length]);
      }

      if(!$data.random.work && !$data.past.work){
        //console.log("Prepare make.");
        prepareMakeBets.gkDelay(randomNumber(13, 27) * 100);
      }

    }else{
      //console.log("Prepare make.");
      prepareMakeBets.gkDelay(randomNumber(15, 25) * 100);
    }
  }else{
    // если мы не нашли ссылку на прошлую игру, просто обновляем
    //console.log("Url not found!");
    reloadPage.gkDelay(randomNumber(30, 200) * 100);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPastModeResults(count, max){
  if(count < max){
    getGameResult(count, 0);
    getGameResult.gkDelay(1200, null, [count, 1]);

    count++;
    getPastModeResults.gkDelay(2400, null, [count, max]);
  }else{
    //console.log("Prepare make.");
    prepareMakeBets.gkDelay(randomNumber(15, 25) * 100);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareMakeBets(){
  var bid, i, length, pBet;

  if($data.random.work){
    bid = $data.random.make[0] ? 1 : 0;
    if(!$data.random.make[bid])
      return makeBet($data.random, bid);
  }

  if($data.past.work){
    pBet = $data.past.bets;
    for(i = 0, length = pBet.length; i < length; i++){
      if(pBet[i].res[0].id !=-1 && pBet[i].res[0].id !=-1){
        if(!pBet[i].make){
          if(pBet[i].bet == 0){
            //console.log("Get past games results");
            return getPastModeResults.gkDelay(250, null, [0, length]);
          }
          return makeBet(pBet[i]);
        }
      }
    }
  }

  if($data.fixed.work){
    for(i = 0, length = $data.fixed.bets.length; i < length; i++){
      if(!$data.fixed.bets[i].make)
        return makeBet($data.fixed.bets[i]);
    }
  }

  // ставки сделаны, ставок больше нет
  //console.log("All bets done! Wait.");
  reloadPage.gkDelay(randomNumber(180, 360) * 1000);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeBet(betLink, bid){
  var money, input, pass, button;

  money = $('input[name="bet"]').node();

  if(money){
    pass = $('input[name="trans"]').node();
    button = $('a:contains("Сделать ставку!")').node();

    money.value = betLink.money;
    if(bid == null){
      $(`img[onclick="putbet(${betLink.bet})"]`).node().click();
      betLink.make = true;
    }else{
      $(`img[onclick="putbet(${betLink.bets.now[bid]})"]`).node().click();
      betLink.make[bid] = true;
    }

    if(pass) pass.value = $password;

    //console.log("Make a bet! Now.");
    make.gkDelay(randomNumber(30, 50) * 100);
  }else{

    //console.log("Money input not found!");
    reloadPage.gkDelay(randomNumber(50, 180) * 100);
  }
  /////////////////////////////

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

  gui = $('<div>').attr("id", "mb_gui").html('<br>').node();
  node = $('td[valign="top"]:contains("~Максимальная сумма ставок")').find('table').node(2);
  node.parentNode.insertBefore(gui, node.nextElementSibling);

  $tabs = tabs(["Постоянные ставки", "Случайные ставки", "Ставки со сдвигом"], "make-a-bet");
  $tabs.append(gui);

  renderFixedModeGUI();
  renderRandomModeGUI();
  renderPastModeGUI();

  /////////////////////////////

  function renderRandomModeGUI(){
    $tabs.insert('Случайные ставки', '@include: ./html/randomMode.html, true');

    bindEvent($("#mab_randomBet"), 'onkeyup', bindMoneyInputs);
    bindEvent($('#mab_saveRandomBet'), "onclick", saveBetMoney, ["random"]);
    bindEvent($('#mab_randomWork'), "onclick", changeState, ["random"]);

    bindEvent($('#mab_ch-rn-0'), "onclick", changeRandomBetNow, [0]);
    bindEvent($('#mab_ch-rn-1'), "onclick", changeRandomBetNow, [1]);

    /////////////////////////////

    function changeRandomBetNow(n, node){
      var value;

      value = prompt("Введите число от 1 до 36:");
      if(value == null) return;
      value = Number(value);
      if(isNaN(value)) return alert("Введено не число!");
      if(value < 1) return alert("Число не может быть меньше 1");
      if(value > 36) return alert("Число не может быть меньше 36");

      $data.random.bets.now[n] = value;
      node.innerHTML = value;
      saveData();
    }
  }
  /////////////////////////////

  function renderFixedModeGUI(){
    var rows = '', money;

    $data.fixed.bets.forEach((bet, id)=>{
      rows += '@include: ./html/fixedModeRow.html, true';
    });

    $tabs.insert('Постоянные ставки', '@include: ./html/fixedMode.html, true');

    bindEvent($('#mab_fixedAddBet'), "onclick", addBet, ["fixed"]);
    bindEvent($('#mab_fixedWork'), "onclick", changeState, ["fixed"]);
    $('td.remove-bet-fixed').each((node)=>{
      var row;

      row = node.parentNode;
      money = row.cells[1].firstElementChild;

      bindEvent(money.nextElementSibling, "onclick", saveBetMoney, ["fixed"]);
      bindEvent(money.firstElementChild, "onkeyup", bindMoneyInputs);
      bindEvent(row.cells[0], "onclick", selectBet);
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

  function renderPastModeGUI(){
    var rows = '', money, select;

    $data.past.bets.forEach((bet, id)=>{
      rows += '@include: ./html/pastModeRow.html, true';
    });

    $tabs.insert('Ставки со сдвигом', '@include: ./html/pastMode.html, true');

    bindEvent($('#mab_pastAddBet'), "onclick", addBet);
    bindEvent($('#mab_pastWork'), "onclick", changeState, ["past"]);
    $('td.remove-bet-past').each((node)=>{
      var row;

      row = node.parentNode;
      money = row.cells[5].firstElementChild;
      select = $(row).find('select.past-time').nodes();

      bindEvent(money.nextElementSibling, "onclick", saveBetMoney, ["past"]);
      bindEvent(money.firstElementChild, "onkeyup", bindMoneyInputs);
      bindEvent(select[0], "onchange", selectBet, [0, row.rowIndex - 2]);
      bindEvent(select[1], "onchange", selectBet, [1, row.rowIndex - 2]);
      bindEvent(node, "onclick", removeBet);
    });
    /////////////////////////////

    function addBet(){
      $data.past.bets.push({
        res: [
          {id: -1, r: 0},
          {id: -1, r: 0}
        ],
        bet: 0,
        money: 1,
        make: false
      });
      saveData();
      renderPastModeGUI();
    }
    /////////////////////////////

    function removeBet(button){
      var id;

      id = Number(button.firstElementChild.value);
      $data.past.bets.splice(id, 1);

      saveData();
      renderPastModeGUI();
    }
    /////////////////////////////

    function selectBet(rid, bid, node){
      var id;

      id = Number($(node).find('option:checked').node().value);
      $data.past.bets[bid].res[rid].id = id;
      saveData();
      getGameResult(bid, rid);
    }
    /////////////////////////////

    function generateOptions(rid, id){
      var options, value, bid, checked;
      var i, length;

      options = '';
      value = 10;
      bid = $data.past.bets[id].res[rid].id;

      for(i = 0, length = 72; i < length; i++){
        checked = bid == i ? "selected" : "";
        options += `<option value="${i}" ${checked}>${getNormalTime(value, true)}</option>`;
        value += 10;
      }
      return options;
    }
  }
  /////////////////////////////

  function saveBetMoney(mode, button){
    var money, id;

    money = Number(button.previousElementSibling.lastElementChild.value);
    button.value = "√";

    switch(mode){
      case "random":
        $data.random.money = money;
        break;

      case "fixed":
        id = Number(button.nextElementSibling.value);
        $data.fixed.bets[id].money = money;
        break;

      case "past":
        id = Number(button.nextElementSibling.value);
        $data.past.bets[id].money = money;
        break;
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

  $('img[onclick*="putbet"]').each((img)=>{
    var bet;

    bet = img.getAttribute("onclick");
    bet = Number(bet.match(/(\d+)/)[1]);

    bindEvent(img, "onclick", selectBetFixedMode, [bet]);
  });
  /////////////////////////////

  function selectBetFixedMode(bet){
    if($selectBet != null){
      $data.fixed.bets[$selectBet].bet = bet;
      $selectBet = null;
      saveData();
      renderFixedModeGUI();

      document.forms.rform.betn.value = 0;
      document.forms.rform.bettype.value = "";
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getGameResult(bid, rid){
  var url, game, result, cell;
  var results;

  game = $data.past.bets[bid].res[rid];
  cell = rid ? 3 : 1;
  cell = $('#mab_pastTable').node().rows[bid + 2].cells[cell];

  if(game.id == -1){
    cell.innerHTML = 0;
    game.r = 0;
    saveData();
    return calculateBetPastMode(bid);
  }

  url = 'http://www.ganjawars.ru/rouinfo.php?id=';
  url = url + ($data.game - game.id);

  results = $ls.load('gk_rh_game')[0];

  if(results && results == $game){
    game.r = JSON.parse(localStorage.getItem("gk_rh_data"))[game.id];
    cell.innerHTML = game.r;

    saveData();
    calculateBetPastMode(bid);
  }else{
    ajax(url, "GET", null).then((r)=>{
      result = $($answer)
        .html(r.text)
        .find('div.m1:contains("~Игра ")')
        .find('b')
        .text();
      result = Number(result);
      game.r = result;
      cell.innerHTML = result;

      saveData();
      calculateBetPastMode(bid);
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getLastGameResult(){
  var url, result;

  url = "http://www.ganjawars.ru/rouinfo.php?id=";

  ajax(url + $data.game, "GET", null).then((r)=>{
    result = $($answer)
      .html(r.text)
      .find('div.m1:contains("~Игра ")')
      .find('b')
      .text();
    result = Number(result);

    $data.random.last = result;

    generateBets();
    saveData();
  });

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
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculateBetPastMode(bid){
  var res, bet, betCell;

  betCell = $('#mab_pastTable').node().rows[bid + 2].cells[4];
  res = $data.past.bets[bid].res;
  bet = 0;

  if(res[0].r != 0 && res[1].r != 0){
    bet = res[0].r + res[1].r;
    if(bet > 36){
      bet = Math.abs(res[0].r - res[1].r);
      if(bet == 0) bet = 1;
    }
  }

  $data.past.bets[bid].bet = bet;
  betCell.innerHTML = bet;
  saveData();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $answer = $('<span>').node();
  $data = $ls.load("gk_mab_data");

  if($data.past == null){
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
      },
      past: {
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
function getNormalTime(t, s){
  var result, hh, mm, ss;

  hh = 0;
  if(!s) t = parseInt(t / 1000, 10);

  if(t > 3600){
    hh = parseInt(t / 3600, 10);
    t = t % 3600;
  }
  mm = parseInt(t / 60, 10);
  ss = parseInt(t % 60, 10);

  if(mm < 10) mm = "0" + mm;
  if(ss < 10) ss = "0" + ss;

  result = `${mm}:${ss}`;

  if(hh > 0){
    if(hh < 10) hh = "0" + hh;
    result = `${hh}:${result}`;
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