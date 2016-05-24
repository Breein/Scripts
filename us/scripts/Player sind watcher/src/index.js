require('./../../../js/protoDelay.js')();

const $ = require('./../../../js/dom.js');
const bindEvent = require('./../../../js/events.js');
const ajax = require('./../../../js/request.js');
const setStyle = require('./../../../js/style.js');

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');

var $data;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
setStyle('common.js', '@include: ./../../css/common.css, true');
setStyle('psw.js', '@include: ./html/index.css, true');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

loadData();
watching.gkDelay($c.randomNumber(1000, 1500));
addButton();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addButton(){
  var table, position, left, top, button, text;

  text = $data.state ? "Стоп наблюдение" : "Начать наблюдение";
  table = $('table[width="600"][bgColor="#d0eed0"]').node();
  position = table.rows[0].cells[1].getBoundingClientRect();

  left = position.left + position.width / 2 - 35;
  top = position.top + position.height / 2 - 10;

  button = $('<input>')
    .attr("type", "button")
    .attr("value", text)
    .attr("style", `left: ${left}px; top: ${top}px; position: absolute; width: 130px;`)
    .node();

  document.body.appendChild(button);
  bindEvent(button, "onclick", setState);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setState(button){
  if(!$data.state){
    button.value = "Стоп наблюдение";
    $data.state = true;
    watching();
  }else{
    button.value = "Начать наблюдение";
    $data.state = false;
  }
  saveData();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function watching(){
  var b, tr;

  b = $('b:contains("~ бойцов онлайн")');

  if(b.length != 0){
    tr = b.up('table').find('tr').each((row, index)=>{
      row.removeAttribute("style");
      row.className = index % 2 ? "white-row" : "no-white-row";
    }).nodes();

    watch(1, tr.length, tr);
  }else{
    nextSindicate.gkDelay($c.randomNumber(1500, 3000));
  }

  function watch(now, max, list){
    var row, url;

    if(now < max && $data.state){
      if(now > 0) $(list[now - 1]).class("remove", "watch-row");

      row = list[now];
      url = $(row)
        .class("add", "watch-row")
        .find('a[href*="info.php?id"]')
        .node().href;

      ajax(url, "GET", null).then(()=>{
        now++;
        watch.gkDelay($c.randomNumber(1000, 2000), null, [now, max, list]);
      });
    }else{
      $(list[now - 1]).class("remove", "watch-row");
      nextSindicate.gkDelay($c.randomNumber(1500, 3000));
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function nextSindicate(){
  var id;

  id = location.search.match(/\?id=(\d+)/)[1];
  id = Number(id);
  id++;

  if(id < 9999 && $data.state){
    location.href = `http://www.ganjawars.ru/syndicate.php?id=${id}&page=online`;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $data = $ls.load("gk_psw_data");

  if($data.state == null){
    $data = {
      state: false
    };

    saveData();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveData(){
  $ls.save("gk_psw_data", $data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////