var $ = require('./../../../js/dom.js');
var ajax = require('./../../../js/request.js');
var bindEvent = require('./../../../js/events.js');
var setStyle = require('./../../../js/style.js');

const $ls = require('./../../../js/ls.js');

var $answer, $name, $data;

$answer = $('<span>').node();
$name = getCharacterName();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
addStyle();
loadData();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addStyle(){
  setStyle('common.js', '@include: ./../../css/common.css, true');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  var time, key;

  $data = $ls.load("gk_doShoppingFaster");
  time = getTimeNow();
  key = $data[$name];

  if($data.time == null) $data.time = 0;
  if(time - $data.time > 3600 || key == null){
    ajax("http://www.ganjawars.ru/market-i.php", "GET", null).then((r)=>{
      key = $($answer).html(r.text)
          .find('input[type="hidden"][name="lpt"]')
          .node()
          .value;

      $data.time = time;
      $data[$name] = key;

      $ls.save("gk_doShoppingFaster", $data);
      addButtons();
    });
  }else{
    addButtons();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addButtons(){
  var td, sid, key;

  key = $data[$name];

  $('a:contains("Купить сейчас")').each((button)=>{
    button.innerHTML = '<img width="12" border="0" height="10" src="http://images.ganjawars.ru/i/home/bank.gif">';
    sid = button.href.match(/(\d+)/g);
    sid = Number(sid[1]);

    td = button.offsetParent;
    td.innerHTML += ' <input type="button" value="Купить" style="float: right; margin: 0 3px 0 0;" />';

    bindEvent($(td).find('input[type="button"]'), "onclick", buyItem, [sid, key, td.parentNode]);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function buyItem(sid, key, row, button){
  var data, result;

  button.disabled = true;
  data = `sell_id=${sid}&stage=3&lopatka=${key}`;

  ajax('http://www.ganjawars.ru/market-i.php', 'POST', data).then((r)=>{
    result = $($answer).html(r.text).find('td:contains("~успешно приобрели")');
    if(result.length != 0){
      row.parentNode.removeChild(row);
    }else{
      alert(`Покупка не удалась!`);
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCharacterName(){
  return $('a[href*="info.php"]').text();
}

function getTimeNow(){
  return parseInt(new Date().getTime() / 1000, 10);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////