require('./../../../js/protoDelay.js')();

const ajax = require('./../../../js/request.js');
const $ = require('./../../../js/dom.js');
const $c = require('./../../../js/common.js')();

var $battles;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$battles = [];
getBattles();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getBattles(){
  var table, battle;

  table = $('b:contains("Идущие бои")').up('table').node();

  $(table.rows[1].cells[1]).find('tr').each((row)=>{
    battle = row.cells[0].firstElementChild;
    battle = battle.nodeName == "A" ? battle.href : null;
    row.innerHTML = `<td width="10" valign="top"></td>` + row.innerHTML;

    $battles.push({
      url: battle,
      td: row.cells[0]
    });
  });

  watchBattle(0, $battles.length - 1, $battles);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function watchBattle(now, max, list){
  if(now < max){
    if(now != 0) list[now - 1].td.innerHTML = "";
    list[now].td.innerHTML = "»";

    ajax(list[now].url, "GET", null).then(()=>{
      now++;
      watchBattle.gkDelay($c.randomNumber(3500, 5800), null, [now, max, list]);
    });
  }else{
    reload.gkDelay($c.randomNumber(2000, 3500));
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function reload(){
  location.href = "http://www.ganjawars.ru/war/";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
