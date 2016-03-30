var $ = require('./../../../js/dom');
var bindEvent = require('./../../../js/events');

const $ls = require('./../../../js/ls.js');
const $c = require('./../../../js/common.js')();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(location.href == "http://bank.ganjawars.ru/account.php?data=true"){
  collectData();
}

if(/\/me\/\?bank=true&data=/.test(location.href)){
  saveData();
}

if(location.href == "http://www.ganjawars.ru/me/"){
  addStyle();
  getDataFromFrame();
  waitForDone();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function waitForDone(){
  var frame;

  if($ls.load("gk_GBD_timer")[1]){
    showData();
    frame = $("#gbd_frame").node();
    if(frame) document.body.removeChild(frame);
  }else{
    setTimeout(waitForDone, 25);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addStyle(){
  var css, code;

  code = '@include: ./html/index.css, true';
  css = $("<style>")
    .attr("type", "text/css")
    .attr("script", "true")
    .html(code)
    .node();

  document.head.appendChild(css);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDataFromFrame(){
  var time, timeNow;

  timeNow = $c.getTimeNow();
  time = $ls.load("gk_GBD_timer")[0];
  if(time == null) time = 0;

  if(timeNow - time > 3600){
    $ls.save("gk_GBD_timer", [timeNow, false]);
    document.body.appendChild(
      $('<iframe>')
        .attr('src', 'http://bank.ganjawars.ru/account.php?data=true')
        .attr('style', 'display: none;')
        .attr('id', 'gbd_frame')
        .node()
    );
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function collectData(){
  var data = [];
  var time, action, id, sum, text, name;

  $('b:contains("~Изменение счета")')
    .up('table')
    .find('tr')
    .nodeArr()
    .forEach((row, index)=>{
      if(index == 0) return;
      text = row.cells[1].textContent;
      time = row.cells[0].textContent;
      time = time.match(/(\d+)/g);
      time = `${time[1]}/${time[0]}/20${time[2]} ${time[3]}:${time[4]}`;
      time = Date.parse(time) / 1000;

      if(/Продан предмет/.test(text)) action = 0;
      if(/Куплен предмет/.test(text)) action = 1;
      if(/Счет пополнен/.test(text)) action = 2;

      id = $(row.cells[1]).find('a').node();
      if(id){
        name = id.textContent.replace(/"/g, "");
        id = id.href.split("item_id=")[1];
      }else{
        name = 0;
        id = 0;
      }

      sum = $(row.cells[1]).find('b').text();

      data.push([
        time,
        action,
        [id, name],
        sum
      ]);
    });

  data = JSON.stringify(data);
  data = encodeURIComponent(data);
  location.href = "http://www.ganjawars.ru/me/?bank=true&data=" + data;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveData(){
  var data, timer;

  data = location.search;
  data = data.split("data=")[1];
  data = decodeURIComponent(data);

  timer = [$c.getTimeNow(), true];

  localStorage.setItem("gk_GBD_data", data);
  $ls.save("gk_GBD_timer", timer);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showData(){
  var data, time = 0, date, lastAdd, action, item, sum;
  var insert, code, html;

  html = "";
  data = $ls.load("gk_GBD_data");

  if(data.length == null) return;
  data.reverse();
  data.forEach((operation)=>{
    if(operation[1] == 2 && time < operation[0]){
      lastAdd = operation;
      time = operation[0];
    }

    switch(operation[1]){
      case 0:
        action = "Продан предмет ";
        item = `<a href="${operation[2][0]}" target="_blank">${operation[2][1]}</a> за `;
        break;

      case 1:
        action = "Куплен предмет ";
        item = `<a href="${operation[2][0]}" target="_blank">${operation[2][1]}</a> за `;
        break;

      case 2:
        action = "Счет пополнен на ";
        item = "";
        break;
    }

    sum = operation[3];
    date = $c.getNormalDate(operation[0]);
    html += `<tr class="light"><td width="125" align="center">${date.d} ${date.t}</td><td class="indent">${action}${item}<b>${sum}</b> EUN</td></tr>`;
  });

  insert = $('b:contains("Ваш персонаж")')
    .up('tr')
    .next('tr')
    .find('br')
    .nodes()[3];

  if(lastAdd){
    time = $c.getNormalDate(lastAdd[0]);
    code = `<br>&nbsp;» Последнее: <b>${lastAdd[3]} EUN</b> (${time.d} ${time.t})`;
  }else{
    code = `<br>&nbsp;» Последнее: неизвестно`;
  }

  code += ` <span id="gbd_operationButtonOpen">(операции)</span>`;
  code += '@include: ./html/operationWindow.html, true';

  insert.parentNode.insertBefore(
    $('<span>').html(code).node(),
    insert
  );

  bindEvent($("#gbd_operationButtonOpen").node(), "onclick", openWindow);
  bindEvent($("#gbd_operationButtonClose").node(), "onclick", closeWindow);
  bindEvent($("#gbd_operationButtonUpdate").node(), "onclick", updateInfo);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openWindow(){
  $("#gbd_operationWindow").class("remove", "hide");
}

function closeWindow(){
  $("#gbd_operationWindow").class("add", "hide");
}
function updateInfo(){
  $ls.save("gk_GBD_timer", [0, false]);
  location.href = "http://www.ganjawars.ru/me/";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////