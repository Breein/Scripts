require('./../../../js/protoDelay.js')();

const $ = require('./../../../js/dom');
const bindEvent = require('./../../../js/events');
const setStyle = require('./../../../js/style.js');

const $ls = require('./../../../js/ls.js');
const $c = require('./../../../js/common.js')();


var $data, $urls, $names, $timeout, $settings;

$urls = {
  ew: "http://www.excelworld.ru/forum/",
  pe: "http://www.planetaexcel.ru/forum/index.php?PAGE_NAME=read&FID=7&TID=",
  ev: "http://www.excel-vba.ru/forum/index.php?topic="
};

$names = {
  ew: "Excelworld",
  pe: "Planetaexcel",
  ev: "Excel-vba"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(location.href == "http://photos.ganjawars.ru/index.php"){
  loadSettings();

  $('body').html('@include: ./html/gui.html, true');
  changeIcon();
  document.title = "[FW]: Idle";

  bindEvent($('#fw_saveButton'), "onclick", bindSaveSetting);

  addCallSettings();
  showData();
}

if(location.host == "photos.ganjawars.ru" && /\?forums=true&data=/.test(location.href)){
  saveData();
}

if(location.host == "www.excelworld.ru" && location.search == "?data=true"){
  changeIcon();
  document.title = "[FW]: Get data!";
  collectDataEW();
}

if(location.host == "www.planetaexcel.ru" && /&data=true/.test(location.search)){
  changeIcon();
  document.title = "[FW]: Get data!";
  collectDataPE();
}

if(location.host == "www.excel-vba.ru" && /\?data=true/.test(location.search)){
  changeIcon();
  document.title = "[FW]: Get data!";
  collectDataEV();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addCallSettings(){
  var pressed = {};

  bindEvent(document.body, "onkeydown", record, [], this, true);
  bindEvent(document.body, "onkeyup", clear, [], this, true);

  function record(n, e){
    pressed[e.keyCode] = true;
    if(pressed['70'] && pressed['87'] && pressed['13']){
      pressed = {};
      openSettingsWindow();
    }
  }

  function clear(n, e){
    if(pressed[e.keyCode]){
      delete  pressed[e.keyCode];
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openSettingsWindow(){
  var w = $('#fw_settingsWindow').node();

  $(w).find('[name="interval"]').node().value = $settings.interval;
  $(w).find('[name="sound"]').node().value = $settings.sound;
  $(w).class("remove", "hide");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bindSaveSetting(){
  var w, interval, sound;

  w = $('#fw_settingsWindow').node();

  interval = $(w).find('[name="interval"]').node().value;
  sound = $(w).find('[name="sound"]').node().value;

  interval = Number(interval);
  sound = Number(sound);

  if(isNaN(interval) || interval == 0) return;
  if(isNaN(sound)) return;

  $settings.interval = interval;
  $settings.sound = sound;

  $ls.save("gk_FW_settings", $settings);
  $(w).class("add", "hide");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showData(remove){
  var html, data, forum, id, tr, href, f, count, all;

  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('fw.js', '@include: ./html/index.css, true');

  data = $ls.load("gk_FW_data");
  html = '<table align="center" type="padding" width="100%">';
  html += '@include: ./html/themesHeader.html, true';

  for(forum in data){
    for(id in data[forum]){
      tr = data[forum][id];
      href = $urls[forum];
      f = $names[forum];

      if(!tr.old){
        html += '@include: ./html/themesRow.html, true';
        count = true;
      }
      all = true;
    }
  }

  if(!count){
    html += '<tr height="50" class="light"><td colspan="5" align="center">Новых тем не найдено.</td></tr>';
  }

  $('#fw_content').html(html + "</table>");

  if(count){
    $('td.this-old-button').each((td)=>{
      bindEvent(td, "onclick", action);
    });

    if(!remove){
      playSound($settings.sound);
      light(0);
    }
  }

  if(all){
    $timeout = setTimeout(()=>{
      location.href = "http://www.excelworld.ru/forum/6?data=true";
    }, $settings.interval * 60000);
  }else{
    $timeout = setTimeout(()=>{
      location.href = "http://www.excelworld.ru/forum/6?data=true";
    }, 1000);
  }

  function action(node){
    var value, id, f;

    if(!confirm("Отметить как «старая тема»?")) return;

    value = $(node).attr("type").split('-');
    f = value[0];
    id = value[1];

    data[f][id].old = true;

    $ls.save("gk_FW_data", data);
    clearTimeout($timeout);
    showData(true);
  }

  function light(n){
    if(n == 0){
      document.title = "[FW]: New Themes!";
      n = 1;
    }else{
      document.title = "[FW]: **  **  **";
      n = 0;
    }
    light.gkDelay(500, null, [n]);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function collectDataEW(){
  var id, a, name, href, author, n, data;

  n = 0;
  data = {
    name: "ew"
  };

  $('td[colspan="7"]:contains("Темы форума")')
    .up('table')
    .find('tr')
    .each((row)=>{
      if(!row.cells[1]) return;

      id = row.id;
      a = $(row.cells[2]).find('a').node();
      name = a.textContent;
      href = a.href.split("/")[4];
      author = row.cells[5].textContent;

      data[id] = [n, name, href, author];
      n++;
    }, 6);

  data = JSON.stringify(data);
  data = encodeURIComponent(data);

  setDataToFrame(data, "http://www.planetaexcel.ru/forum/index.php?PAGE_NAME=list&FID=7&data=true");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function collectDataPE(){
  var id, a, name, href, author, n, data;

  n = 0;
  data = {
    name: "pe"
  };

  $('span:contains("Темы")')
    .up('table')
    .find('tr')
    .each((row)=>{
      if(!row.cells[1]) return;
      if($(row).find('span.forum-status-sticky').length != 0) return;

      a = $(row.cells[1]).find('a').node();
      href = a.href.match(/(.+)FID=7&TID=(\d+)&(.+)&data=true/);
      id = href[2];
      href = id + "&" + href[3];
      name = a.textContent;
      author = row.cells[2].textContent;

      data[id] = [n, name, href, author];
      n++;
    }, 1);

  data = JSON.stringify(data);
  data = encodeURIComponent(data);

  setDataToFrame(data, "http://www.excel-vba.ru/forum/index.php?board=7.0?data=true");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function collectDataEV(){
  var id, a, name, href, author, n, data;

  n = 0;
  data = {
    name: "ev"
  };

  $('td:contains("Тема")')
    .up('table')
    .find('tr')
    .each((row)=>{
      if(!row.cells[1]) return;
      if($(row).find('img[src*="_sticky"]').length != 0) return;

      a = $(row.cells[2]).find('a').node();
      id = a.href.match(/topic=(.+)/)[1];
      href = id;
      name = a.textContent;
      author = $(row.cells[3]).find('a').text();

      data[id] = [n, name, href, author];
      n++;
    }, 1);

  data = JSON.stringify(data);
  data = encodeURIComponent(data);

  setDataToFrame(data, "http://photos.ganjawars.ru/index.php");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveData(){
  var data, timer, name;
  var id;

  $data = $ls.load("gk_FW_data");

  data = location.search;
  data = data.split("data=")[1];
  data = decodeURIComponent(data);
  data = JSON.parse(data);

  name = data.name;
  delete data.name;

  if($data[name] == null) $data[name] = {};

  for(id in data){
    if($data[name][id] == null){
      $data[name][id] = {
        name: data[id][1],
        href: data[id][2],
        author: data[id][3],
        n: data[id][0],
        old: data[id][0] > 10
      };
    }
  }

  for(id in $data[name]){
    if(data[id] == null){
      delete $data[name][id];
    }
  }

  timer = [$c.getTimeNow(), true];
  $ls.save("gk_FW_data", $data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setDataToFrame(data, go){
  document.body.appendChild(
    $('<iframe>')
      .attr('src', "http://photos.ganjawars.ru/index.php?forums=true&data=" + data)
      .attr('style', 'display: none;')
      .attr('id', 'fw_frame')
      .node()
  );

  next.gkDelay(2500);

  function next(){
    location.href = go;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function playSound(id){
  var audio = $('#MD_playSound');

  if(audio.length == 0){
    audio = $('<audio>').node();
    audio.id = "MD_playSound";
    audio.src = "http://www.ganjawars.ru/sounds/" + id + ".mp3";
    audio.autoplay = true;

    document.body.appendChild(audio);
  }else{
    audio.node().play();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadSettings(){
  $settings = $ls.load("gk_FW_settings");

  if($settings.interval == null){
    $settings = {
      interval: 10,
      sound: 10
    };

    $ls.save("gk_FW_settings", $settings);
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function changeIcon(){
  var old, head, _new, ico;

  ico = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAeUExURaLLokyITDN1M3ute22ibZnEmSZrJn8YGKvSqwAAAG03ko0AAAAKdFJOU////////////wCyzCzPAAAAWUlEQVR42oyPSQ7AMAgDWQwx//9wUdUlTS/xCQYL2VI1JlVJDU4aJZ+9yQ6IzISCnkLoCYI9EQmqXw4Po0El5Xb0zcRc+QCYUg0viPT+Ins5VvArt9Y/BBgAl/UGxsTHi2UAAAAASUVORK5CYII=";
  head = $('head').node();
  old = $(head).find('link[rel="shortcut icon"]').node();

  if(old) old.parentNode.removeChild(old);

  _new = $('<link>')
    .attr("href", ico)
    .attr("type","image/x-icon")
    .attr("rel","shortcut icon")
    .node();

  head.appendChild(_new);
}