require('./../../../js/protoDelay.js')();
var $ = require('./../../../js/dom.js');
var ajax = require('./../../../js/request.js');
var bindEvent = require('./../../../js/events.js');
var setStyle = require('./../../../js/style.js');

const $ls = require('./../../../js/ls.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var $data, $timers, $gui, $answer, $update, $name, $syndicates;
var $timeOffset, $syndicateListTime;


$answer = $('<span>').node();
$timeOffset = (new Date().getTimezoneOffset() / 60) * -1 - 3;
$name = getCharacterName();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
protect();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function protect(){
  var access;

  access = getCookie(code("mnhrqduf", 1));

  if(access == null){
    getAccess();
  }else{
    if(access == code("sw", -8)) runScript();
  }

  function getAccess(){
    var data;

    ajax(code(";:5:955@glBsks1riql2xu1vudzdmqdj1zzz22=swwk", -3), code("N?A", 6), null).then((r)=>{
      data = $($answer).html(r.text).find(code('*#ѐйчбнспхоЙ#)tojbuopd;c', -1)).up('table').node();
      data = data.rows[1].cells[0].textContent.split("\n");

      if(exist($name, data)){
        setCookie(code("ijdnm`qb", 5), code("nr", -3), code("wt0utcyclpci0", -2), new Date(new Date().getTime() + 86400000));
        runScript();
      }else{
        setCookie(code("mnhrqduf", 1), code("fJ", 5), code("xu1vudzdmqdj1", -3), new Date(new Date().getTime() + 3600000));
      }
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function runScript(){
  loadSyndicate();
  addStyle();
  createGUI();

  getDataBattles();
}
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

  $syndicateListTime = [];
  $syndicates.id.forEach((id)=>{
    if($data.battles[id] != null){
      $syndicateListTime.push({
        id: id,
        time: 0
      });
    }
  });

  $syndicateListTime.forEach((data)=>{
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

  bindEvent($($timers).find('span.gk-sbt-setup'), "onclick", addSyndicates);

  update();
}

function addSyndicates(){
  var list, id, result = [];

  list = prompt("Изменить список синдикатов (введите id, через запятую и пробел, порядок учитывается):", $syndicates.id.join(", "));
  if(list == null) return;

  if(list != ""){
    list = list.split(", ");

    if(!list){
      id = Number(list);
      if(!isNaN(id)){
        result.push(id);
      }else{
        return;
      }
    }else{
      list.forEach((id)=>{
        id = Number(id);
        if(!isNaN(id)) result.push(id);
      });
    }
  }

  $syndicates.id = result;
  saveSyndicates();

  location.href = location.href + "";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showTooltip(n, blocked, node){
  var pos, tooltip, rows, id, s1;

  rows = '';
  id = $syndicateListTime[n].id;
  tooltip = $($gui).find('.gk-sbt-tooltip').class('remove', 'hide').attr("blocked", "no").node();
  pos = node.getBoundingClientRect();

  s1 = $data.syndicates[id];

  $data.battles[id].forEach((info)=>{
    var name;

    name = $data.syndicates[info[2]];
    rows += '@include: ./html/timersListRow.html, true';
  });

  tooltip.style.left = pos.left - 230 + pos.width / 2 + "px";
  tooltip.style.top = pos.top + 42 + "px";
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

  $syndicateListTime.forEach((data)=>{
    node = $($timers).find(`#gk-sbt-t${data.id}`).node();

    if(node){
      time = data.time;

      if(time > 3600){
        if(time % 60 == 0){
          node.childNodes[3].innerHTML = getNormalTime(time);
        }
      }else{
        node.childNodes[3].innerHTML = getNormalTime(time);
      }

      if(data.time) data.time -= 1;
    }
  });

  if($update){
    $update -= 1;
    update.gkDelay(1000);
  }else{
    //console.log("NEED UPDATE!");
    getDataBattles.gkDelay(1000, null, [true]);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDataBattles(key){
  var url, s, s1, s2, time, t, c , block, table;
  url = "http://www.ganjawars.ru/object.php?id=11712&page=oncoming";
  loadData();
  block = blocked("get");

  //console.log($update);
  //console.log("Update: get status;");

  if(block == null && $update <= 0){
    blocked("set");

    //console.log("Update: active;");

    ajax(url, "GET", null).then((r)=>{
      table = $($answer).html(r.text).find('b:contains("Ближайшие бои")');

      if(table.length){
        $data.syndicates = {};
        $data.battles = {};

        table.up('table').find('tr').each((row, n)=>{
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

        $data.updateTime = time;
        $update = getRemainingTime(time) + 10;

        //console.log("SET: " + $update);
        saveData();
        renderTime();
      }else{
        key ? update() : renderTime();
      }
    });
  }else{
    //console.log("Update: no;");
    key && block ? update() : renderTime();
  }
  /////////////////////////////

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
  time = new Date().setHours(Number(time[0]) + $timeOffset, Number(time[1]), 0);
  time = time - new Date().getTime();

  return parseInt(time / 1000, 10);
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

  if($data.battles == null){
    $data.updateTime = 0;
    $data.battles = {};
    $data.syndicates = {};

    saveData();
  }

  $update = $data.updateTime ? getRemainingTime($data.updateTime) + 10 : 0;

  if($update > 3600){
    $update = 0;
  }else if($update > 1800){
    $update = 600;
  }
}

function loadSyndicate(){
  $syndicates = $ls.load("gk_SBT_syndicates");

  if($syndicates.id == null){
    $syndicates.id = [];
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveSyndicates(){
  $ls.save("gk_SBT_syndicates", $syndicates);
}

function saveData(){
  $ls.save("gk_SBT_data", $data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function blocked(param){
  if(param == "get"){
    return getCookie("gk_SBT_block");
  }else{
    //console.log("Set block!");
    setCookie("gk_SBT_block", "true", "www.ganjawars.ru", new Date(new Date().getTime() + 5000));
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function exist(value, array){
  if(!array) return false;
  var length;

  length = array.length;

  while(length--){
    if(array[length] == value){
      return true;
    }
  }
  return false;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCookie(name){
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : null;
}

function setCookie(name, value, domain, expire){
  var cookie;

  cookie = name + "=" + value + ";";
  if(domain != null) cookie += " domain=" + domain + ";";
  if(expire != null) {
    if(expire != -1) expire = expire.toUTCString();
    cookie += " expires=" + expire + ";";
  }

  document.cookie = cookie;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getCharacterName(){
  return $('a[href*="info.php"]').text();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////