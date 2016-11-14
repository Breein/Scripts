require('./../../../js/protoDelay.js')();
var $ = require('./../../../js/dom.js');
var ajax = require('./../../../js/request.js');
var bindEvent = require('./../../../js/events.js');
var setStyle = require('./../../../js/style.js');


const $ls = require('./../../../js/ls.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var $data, $timers, $gui, $answer, $update;

$answer = $('<span>').node();

var synd = [
  {id: 103, time: 0}
];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

addStyle();
createGUI();

getDataBattles();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addStyle(){
  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('sbt.js', '@include: ./html/index.css, true');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI(){
  var node, gui;

  $gui = $('<span>').attr('id', 'gk-sbt-gui').html('@include: ./html/gui.html, true').node();
  $timers = $('<span>').class('set', 'gk-sbt-timers').node();
  node = $('td[class="txt"]:contains("~игроков онлайн")').node();
  node.insertBefore($timers, node.firstChild);
  document.body.appendChild($gui);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderTime(){
  var time, code = "";

  synd.forEach((data, n)=>{
    if($data.battles[data.id] == null) synd.splice(n, 1);
  });

  synd.forEach((data)=>{
    time = getRemainingTime($data.battles[data.id][0][0]);
    code += '@include: ./html/timer.html, true';
    data.time = time;
  });

  code += `<span class="gk-sbt-timer gk-sbt-setup" title="Настройки"></span>`;

  $($timers).html(code).find('span[class=gk-sbt-timer]').each((node, n)=>{
    bindEvent(node, 'onmouseenter', showTooltip, [n, false]);
    bindEvent(node, 'onclick', actionTooltip, ["block"]);
    bindEvent(node, 'onmouseleave', actionTooltip, ["hide"]);
  });

  update();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showTooltip(n, blocked, node){
  var pos, tooltip, rows, id, s1;

  rows = '';
  id = synd[n].id;
  tooltip = $($gui).find('.gk-sbt-tooltip').class('remove', 'hide').attr("blocked", "no").node();
  pos = node.getBoundingClientRect();

  s1 = $data.syndicates[id];

  $data.battles[id].forEach((info)=>{
    var name;

    name = $data.syndicates[info[2]];
    rows += '@include: ./html/timersListRow.html, true';
  });

  tooltip.style.left = pos.x - 230 + pos.width / 2;
  tooltip.style.top = pos.y + 40;
  tooltip.innerHTML = '@include: ./html/timersList.html, true';
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function actionTooltip(action){
  var tooltip;

  tooltip = $($gui).find('.gk-sbt-tooltip');

  if(action == "block"){
    tooltip.attr("blocked", "yes");
    return;
  }

  if(action == "hide"){
    if(tooltip.attr("blocked") == "yes") return;
    tooltip.class('add', 'hide');
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function update(){
  var time, node;

  synd.forEach((data)=>{
    node = $($timers).find(`#gk-sbt-t${data.id}`).node();
    time = data.time;

    if(time > 3600){
      if(time % 60 == 0){
        node.childNodes[3].innerHTML = getNormalTime(time);
      }
    }else{
      node.childNodes[3].innerHTML = getNormalTime(time);
    }

    if(data.time) data.time -= 1;
  });

  if($update){
    $update -= 1;
    update.gkDelay(1000);
  }else{
    console.log("NEED UPDATE!");
    getDataBattles.gkDelay(1000, null, [true]);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDataBattles(key){
  var url, s, s1, s2, time, t, c;

  url = "http://www.ganjawars.ru/object.php?id=11712&page=oncoming";
  loadData();

  console.log("U1");

  if($data.update == false && $update <= 0){
    $data.update = true;
    saveData();

    // Пеередалть на КУКИ!

    console.log("U2");

    ajax(url, "GET", null).then((r)=>{
      $data.syndicates = {};
      $data.battles = {};

      $($answer).html(r.text).find('b:contains("Ближайшие бои")').up('table').find('tr').each((row, n)=>{
        s = $(row).find('a').nodes();
        s1 = getSindicate(s[0]);
        s2 = getSindicate(s[1]);
        t = row.cells[0].textContent;
        c = row.cells[1].textContent;

        $data.syndicates[s1[0]] = s1[1];
        $data.syndicates[s2[0]] = s2[1];

        if($data.battles[s1[0]] == null) $data.battles[s1[0]] = [];
        $data.battles[s1[0]].push([t, c, s2[0]]);

        if($data.battles[s2[0]] == null) $data.battles[s2[0]] = [];
        $data.battles[s2[0]].push([t, c, s1[0]]);

        if(n == 1) time = t;
      }, 1);

      $data.update = false;
      $data.updateTime = time;
      $update = getRemainingTime(time) + 10;
      saveData();
      renderTime();
    });
  }else{
    console.log("UE");

    if(key && $data.update){
      update();
    }else{
      renderTime();
    }
  }

  function getSindicate(s){
    var id, name;

    id = Number(s.href.split('sid=')[1]);
    name = s.textContent;
    return [id, name];
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function code(s, c){
  var r = "", l = s.length;
  while(l--)r += String.fromCharCode(s.charCodeAt(l) + c);
  return r;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getRemainingTime(time){
  time = time.match(/(\d+)/g);
  time = new Date().setUTCHours(Number(time[0]) - 3, Number(time[1]), 0);
  time = time - new Date().getTime();
  return time / 1000;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getNormalTime(t){
  var hh = 0, mm, ss;

  if(t > 3600){
    hh = parseInt(t / 3600, 10);
    t = t % 3600;
  }

  mm = parseInt(t / 60, 10);
  if(mm < 10) mm = "0" + mm;
  if(hh < 10) hh = "0" + hh;

  if(hh != 0) return `${hh}:${mm} ч.`;

  ss = parseInt(t % 60, 10);
  if(ss < 10) ss = "0" + ss;

  return `${mm}:${ss}`;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $data = $ls.load("gk_SBT_data");

  if($data.update == null){
    $data.update = false;
    $data.updateTime = 0;
    $data.battles = {};
    $data.syndicates = {};

    saveData();
  }

  $update = $data.updateTime ? getRemainingTime($data.updateTime) + 10 : 0;

  console.log(getRemainingTime($data.updateTime));
}

function saveData(){
  $ls.save("gk_SBT_data", $data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////