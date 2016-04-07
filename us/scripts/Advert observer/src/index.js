require('./../../../js/protoDelay.js')();
const $ = require('./../../../js/dom.js');
const bindEvent = require('./../../../js/events.js');
const ajax = require('./../../../js/request.js');
const setStyle = require('./../../../js/style.js');

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');

var $data, $answer, $forums, $name;

$answer = $('<span>').node();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(location.pathname == "/threads.php"){
  threadLight();
}else{
  $name = getCharacterName();
  $forums = {
    "7": "Торговля предметами : Оружие",
    "36": "Торговля предметами : Броня",
    "37": "Торговля предметами : Аксессуары",
    "35": "Торговля high-tech предметами",
    "34": "Торговля недвижимостью",
    "44": "Торговля предметами : Редкие вещи",
    "47": "Торговля модифицированными предметами",
    "48": "Торговля сломанными вещами",
    "46": "Аренда предметов",
    "54": "Аренда недвижимости",
    "41": "Торговля синдикатами",
    "42": "Поиск исполнителей"
  };

  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('advert_observer.js', '@include: ./html/index.css, true');
  createButton();
  createThreadWindow();
  load();
  update();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createButton(){
  var button, node;

  node = $('a[href*="forum.php"]').node();
  button = $('<span>').html('@include: ./html/button.html, true').node();

  node.parentNode.insertBefore(button, node.nextSibling);
  bindEvent(button, "onclick", openThreadWindow);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createThreadWindow(){
  var window, save;

  window = $('<div>')
    .class("set", "window center-screen hide")
    .attr('id', "ao_thread-window")
    .html('@include: ./html/threadWindow.html, true')
    .node();

  document.body.appendChild(window);

  save = $(window).find('input[type="button"]').node();
  bindEvent(save, 'onclick', saveThreads);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function load(){
  $data = $ls.load("gk_ao_data");
  if($data.time == null){
    $data = {
      time: 0,
      threads: {
        "35": {
          text: null,
          pos: 0
        }
      }
    };
    $ls.save("gk_ao_data", $data);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function update(){
  var time, list;

  time = $c.getTimeNow();

  if(time - $data.time > 3600){
    list = Object.keys($data.threads);
    getData(0, list.length, list);
  }else{
    createTableAdverts();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getData(index, max, list){
  var url, advert, data;

  if(index < max){
    url = "http://www.ganjawars.ru/threads.php?fid=" + list[index];
    ajax(url, "GET", null).then((r)=>{
      var row, text;

      advert = $($answer)
        .html(r.text)
        .find('td:contains("Тема")')
        .up('table')
        .find(`a:contains("${$name}")`);

      if(advert.length){
        row = advert.up('tr').node();
        text = [
          $(row.cells[0]).find('a').node().href.split('tid=')[1],
          row.cells[0].textContent.trim()
        ];

        data = {
          text: text,
          pos: row.rowIndex
        }
      }else{
        data = {
          text: null,
          pos: 0
        }
      }

      $data.threads[list[index]] = data;
      index++;
      getData.gkDelay(750, null, [index, max, list]);
    });
  }else{
    $data.time = $c.getTimeNow();
    $ls.save("gk_ao_data", $data);
    createTableAdverts();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openThreadWindow(){
  var window = $('#ao_thread-window').node();

  if(/hide/.test(window.className)){
    $(window).class("remove", "hide").find('input[type="checkbox"]').nodeArr().forEach((box)=>{
      box.checked = $data.threads[box.value] != null;
    });
  }else{
    $(window).class("add", "hide");
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveThreads(){
  $('#ao_thread-window').class('add', 'hide').find('input[type="checkbox"]').nodeArr().forEach((box)=>{
    if(box.checked){
      if($data.threads[box.value] == null){
        $data.threads[box.value] = {
          text: null,
          pos: 0
        }
      }
    }else{
      if($data.threads[box.value] != null){
        delete $data.threads[box.value];
      }
    }
  });

  $data.time = 0;
  $ls.save("gk_ao_data", $data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function threadLight(){
  var threads, thread;

  $name = getCharacterName();
  threads = [7, 34, 35, 36, 37, 41, 42, 44, 46, 47, 48, 54];
  thread = Number(location.search.match(/(\d+)/)[1]);
  if(!$c.exist(thread, threads)) return;

  $('td:contains("Тема")').up('table').find(`a:contains("${$name}")`).nodeArr().forEach((a)=>{
    $(a).up('tr').attr('style', "background-color: #f2d5cb;");
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createTableAdverts(){
  var table, rows, cell, code = "";
  var value, thread;

  table = $('#ao_advertList');
  if(table.length == 0){
    table = $('<table>').attr('id', 'ao_advertList').attr('width', '100%');
    rows = $('b:contains("Ваш персонаж")').up('table').node().rows;
    cell = rows[rows.length - 1].cells[0];
    cell.appendChild(table.node());
  }

  for(value in $data.threads){
    thread = $data.threads[value];
    if(thread.text != null){
      code += '@include: ./html/fullRow.html, true';
    }else{
      code += '@include: ./html/emptyRow.html, true';
    }
  }

  table.html(code);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCharacterName(){
  return $('a[href*="info.php"]').text();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////