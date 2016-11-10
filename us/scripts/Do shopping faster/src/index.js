var $ = require('./../../../js/dom.js');
var ajax = require('./../../../js/request.js');
var bindEvent = require('./../../../js/events.js');
var setStyle = require('./../../../js/style.js');


var $answer;

$answer = $('<span>').node();

addStyle();
addButtons();

function addStyle(){
  setStyle('common.js', '@include: ./../../css/common.css, true');
}

function addButtons(){
  var td, sid,
    //key = "418ff"; // гном
    //key = "dcaa3";  // гыж
    key = "67199";  // гыж мульт


  $('a:contains("Купить сейчас")').each((button)=>{
    button.innerHTML = '<img width="12" border="0" height="10" src="http://images.ganjawars.ru/i/home/bank.gif">';
    sid = button.href.match(/(\d+)/g);
    sid = Number(sid[1]);

    td = button.offsetParent;
    td.innerHTML += ' <input type="button" value="Купить" style="float: right; margin: 0 3px 0 0;" />';

    bindEvent($(td).find('input[type="button"]'), "onclick", buyItem, [sid, key, td.parentNode]);
  });
}

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