require('./../../../js/prototypes')();
var $ = require('./../../../js/dom');
var db = require('./../../../js/idb');
var bindEvent = require('./../../../js/events');
var ajax = require('./../../../js/request');
var createTable = require('./../../../js/table');

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');
const $calendar = require('./../../../js/calendar.js')();
const Create = require('./../src/creator.js')();
const Pack = require('./../src/packer.js')();
const $ico = require('./../src/icons.js');
const $pause = require('./../../../js/pause.js');


var $nameScript = "Stats forums [GW]";
var $maxTimestamps = 10;
var $mode = true;
var $cd, $ss, $answer, $screenWidth, $screenHeight, $date, $checked, $t;

var $idb, $forum;

$checked = {
  themes: {},
  players: {}
};

const $status = {
  "1": {t: "Ok", s: ""},
  "2": {t: "Торговый", s: "font-weight: bold;"},
  "3": {t: "Арестован", s: "color: blue;"},
  "4": {t: "Форумный", s: "color: red;"},
  "5": {t: "Общий бан", s: "color: green; font-weight: bold;"},
  "6": {t: "Заблокирован", s: "color: red; font-weight: bold;"}
};

$screenWidth = document.body.clientWidth;
$screenHeight = document.body.clientHeight;

$answer = $('<span>').node();
$date = $c.getTimeNow();

$cd = {
  fid: 0,
  showProgressTime: false,
  statsCount: 0,
  themesCount: 0
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

addStyle();
createStatGUIButton();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addStyle(){
  var css, code;

  code =
    `
    tr.light div[type="checkbox"]{
      background-image: url(${$ico.boxOff});
    }
    tr.checked div[type="checkbox"]{
      background-image: url(${$ico.boxOn});
    }

    td[sort="sNumber"]{
      background-image: url(${$ico.memberIco});
      background-position: 12px center;
      background-repeat:no-repeat;
    }
    td[sort="kick"]{
      background-image: url(${$ico.kickIco});
      background-position: 10px center;
      background-repeat:no-repeat;
    }
    td[sort="bl"]{
      background-image: url(${$ico.blIco});
      background-position: 10px center;
      background-repeat:no-repeat;
    }
    td[sort="invite"]{
      background-image: url(${$ico.inviteIco});
      background-position: 10px center;
      background-repeat:no-repeat;
    }
    td[filter]{
      background-position: center center;
      background-repeat:no-repeat;
    }
    td[filter].disable{
      background-image: url(${$ico.boxOff});
    }
    td[filter].enable{
      background-image: url(${$ico.boxOn});
      background-color: #cfe5cf;
    }`;

  code += '@include: ./html/index.css, true';
  code += '@include: ./../../css/filter.css, true';

  css = $("style").html(code).node();
  css.setAttribute("type", "text/css");
  css.setAttribute("script", "true");

  document.head.appendChild(css);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createStatGUIButton(){
  var fid, name, navigate, button;

  fid = location.search.match(/(\d+)/);
  fid = Number(fid[1]);

  navigate = $('a[style="color: #990000"]:contains("~Форумы")').up('b');
  name = navigate.text().match(/(.+) » (.+)/)[2];

  button = $('<span>').html('@include: ./html/button.html, true').node();
  navigate.node().appendChild(button);

  $cd.fid = fid;
  $cd.fName = name;

  if(fid > 100){
    $cd.sid = fid.toString();
    $cd.sid = Number($cd.sid.slice(1, $cd.sid.length));
  }else{
    $mode = false;
  }

  bindEvent(button, 'onclick', function(){
    makeConnect("gk_StatsForum", true)
  });

  //makeConnect("gk_StatsForum", true);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeConnect(name, first){
  var ini, g;

  ini = [
    {name: "players", key: "id", index: [["NAME", "a", true], ["BL", "e", false]]},
    {name: "forums", key: "id"}
  ];

  g = connect();
  g.next();

  function* connect(){
    if(first){
      $idb = yield db.gkWait(g, this, [name]);
      $idb.setIniTableList(ini);
    }
    $idb = yield $idb.connectDB.gkWait(g, $idb);

    //if(first) $idb.deleteDB();
    addToDB();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addToDB(){
  var forum;

  if(!$idb.exist(`themes_${$cd.fid}`)){
    forum = Create.forum($cd.fid);
    forum.name = $cd.fName;
    forum.sid = $cd.sid;
    forum = Pack.forum(forum);

    $idb.add("forums", forum);
    $idb.setModifyingTableList([
      {name: "players", index:[[`FID_${$cd.fid}`, `d.f${$cd.fid}`, false]]},
      {name: `themes_${$cd.fid}`, key: "id"},
      {name: `members_${$cd.fid}`, key: "id"},
      {name: `timestamp_${$cd.fid}`, key: "id"}
    ]);
    $idb.db.close();
    $idb.nextVersion();
    makeConnect("gk_StatsForum", false);
  }else{
    $ss = $ls.load("gk_SF_settings");

    $t = {
      stats: createTable(["#sf_header_SI", "#sf_content_SI", "#sf_footer_SI", "#sf_contextMenu"], "stats", $ss, $ico),
      themes: createTable(["#sf_header_TL", "#sf_content_TL", "#sf_footer_TL", "#sf_contextMenu"], "themes", $ss, $ico),
      bl: createTable(["#sf_header_BL", "#sf_content_BL", "#sf_footer_BL", "#sf_contextMenu"], "bl", $ss, $ico)
    };

    $idb.getOne("forums", "id", $cd.fid).then((res)=>{
      $forum = Pack.forum(res);
      createGUI();
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI(){
  var table, td, gui, disabled;

  disabled = $mode ? '' : 'disabled';
  table = $('td[style="color: #990000"]:contains("Тема")').up('table').up('table').node();
  td = table.rows[0].cells[0];

  gui = $('<td>').html('@include: ./html/baseGUI.html, true').node();

  td.parentNode.removeChild(td);
  table.rows[0].appendChild(gui);


  $('td[class="tab"],[class="tab tabActive"]').nodeArr().forEach((tab)=>{
    bindEvent(tab, 'onclick', ()=>{selectTabTable(tab)});
  });

  renderBaseHTML();
  renderTables();
  createShadowLayer();

  bindEvent($('#sf_gui_settings').node(), 'onclick', openControlPanelWindow);
  bindEvent($('#sf_forgetForum').node(), 'onclick', forgetForum);

  $('#sf_controlPanelWindow')
    .find('input[type="button"]')
    .nodeArr()
    .forEach(
      function(node){
        bindEvent(node, 'onclick', function(){prepareDoTask(node)});
      }
    );

  bindEvent($('#sf_sendMessages').node(), 'onclick', prepareSendMails);
  bindEvent($('#sf_pauseButton').node(), 'onclick', pauseProgress);
  bindEvent($('#sf_cancelButton').node(), 'onclick', ()=>{$pause.stop()});
  bindEvent($('#sf_proceedBLButton').node(), 'onclick', bindProceedBLWindow);

  $calendar.setContainer("#sf_calendar");
  $calendar.bind($('span[type="calendarCall"]').node());

  bindActionsContextMenu();
  bidHideContextMenu();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createShadowLayer(){
  var bBody = document.body.getBoundingClientRect();
  var fullHeight = $screenHeight > bBody.height ? $screenHeight : bBody.height;
  var shadowLayer;

  shadowLayer = $('#sf_shadowLayer').node();
  shadowLayer.style.width = bBody.width;
  shadowLayer.style.height = fullHeight;

  bindEvent(shadowLayer, 'onclick', closeWindows);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function selectTabTable(tab){
  var active, table;

  if(tab.className == "tab tabActive") return;

  active = $('td[class="tab tabActive"]').node();
  table = $(active).up('table').node();

  table.rows[0].cells[active.cellIndex].className = "tabTop";
  active.className = "tab";

  table.rows[0].cells[tab.cellIndex].className = "tabTop tabTopActive";
  tab.className = "tab tabActive";

  table.rows[1 + tab.cellIndex].className = "tabRow";
  table.rows[1 + active.cellIndex].className = "tabRowHide";

  closeWindows();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bindActionsContextMenu(){
  var actions;

  actions = {
    getStatus: (table)=>{
      prepareParseMembers(0, table.getCheckedContent());
    },
    getWrites: (table)=>{
      alert("Упс! Не доделано пока что.");
      alert("ID тем:\n" + table.getCheckedContent()[0].writes.join(', '));
    },
    sendMail: (text, mode, table)=>{
      openMessageWindow(mode, text, table.getCheckedContent());
    },
    operationBL: (action, table)=>{
      switch(action){
        case "add":
          openBlackListWindow(action, "Добавить", "", table.getName());
          break;

        case "edit":
          openBlackListWindow(action, "Изменить описание", "[новое описание, причина]", table.getName());
          break;

        case "remove":
          blActions("Убираю", 0, 0, table.getCheckedContent());
          break;
      }
    },
    parseThemes: (mode, table)=>{
      if(mode == "check"){
        prepareParseThemes(0, table.getCheckedContent());
      }else{
        prepareParseThemes(0);
      }
    },
    getTimestamp: (table)=>{
      alert("Данные есть, графиков еще нет.");
      //$idb.getOne(`timestamp_${$forum.id}`, 'id', 2040777).then((result)=>{
      //  console.log(result);
      //});
    }
  };

  $('#sf_contextMenu').find('ul[type]').nodeArr().forEach((ul)=>{
    var table;
    ul = $(ul);
    table = $t[ul.attr("type")];
    ul.find('span[action]').nodeArr().forEach((item)=>{
      bindEvent(item, "onclick", ()=>{
        var func, args;

        args = JSON.parse($(item).attr("action"));
        func = args.shift();
        args.push(table);
        actions[func].apply(null, args);
      });
    });
  });
}

function bindProceedBLWindow(){
  var table, action, text, desc, date, mode, sid, window;

  window = $('#sf_blWindow').node();
  action = $(window).find('input[name="action"]').node().value;
  date = Number($(window).find('input[name="date"]').node().value);
  sid = Number($(window).find('input[name="sid"]').node().value);
  text = $(window).find('span').text();
  desc = $(window).find('textarea').node().value;
  mode = $(window).find('input[type="radio"]:checked').node().value;

  table = $(window).find('table').attr("name");
  table = $t[table];

  if(mode == "players"){
    if(action == "add"){
      blActions(text, date, desc, table.getCheckedContent());
    }else{
      blActions(text, null, desc, table.getCheckedContent());
    }
  }else{
    if(isNaN(sid) || sid == 0){
      alert("ID Синдиката не корректен");
      return;
    }
    getBLMembersFromSindicate(sid, text, date, desc);
  }
  window.style.visibility = "hidden";
}

function getBLMembersFromSindicate(id, text, date, desc){
  var url, list;

  openStatusWindow();
  displayProgress('start', `Сбор состава синдиката #${id}, для добавления в черный список`, 0, 1);

  url = `http://www.ganjawars.ru/syndicate.php?id=${id}&page=members`;
  list = [];

  ajax(url, 'GET', null).then((r)=>{
    $answer.innerHTML = r.text;
    correctionTime(r.time);

    $($answer)
      .find('b:contains("Состав синдиката")')
      .up('table')
      .find('a[href*="info.php"]')
      .nodeArr()
      .forEach((a)=>{
      list.push({
        id: Number(a.href.match(/(\d+)/)[0]),
        name: a.textContent
      });
    });

    displayProgress("done");
    blActions(text, date, desc, list);
  }, (e)=>{

  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bidHideContextMenu(){
  bindEvent(document.body, 'onclick', ()=>{
    var menu = $('#sf_contextMenu').node();
    if(menu.style.visibility == "visible"){
      menu.style.visibility = "hidden";
      menu.removeAttribute("class");
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function blActions(action, date, desc, list){
  var g, timeout = 120;
  g = actions();
  g.next();

  openStatusWindow();
  displayProgress('start', `Операции над черным списком`, 0, list.length);
  displayProgressTime(list.length * timeout);

  function* actions(){
    var player;
    var i, length;

    for(i = 0, length = list.length; i < length; i++){
      displayProgress('extra', `<br><b>${action}</b>: <i>${list[i].name}</i>`);
      if($pause.isStop(cancelProgress)) return;

      player = yield $idb.getOne.gkWait(g, $idb, [`players`, "id", list[i].id]);
      player = Pack.player(player);

      if(player == null){
        player = Create.player(list[i].id);
        player.name = list[i].name;
      }

      if(date != null){
        player.bl = date;
      }
      player.desc = desc == "" ? 0 : desc;
      player._ch = true;

      $idb.add('players', Pack.player(player));
      displayProgress('work');

      yield g.next.gkDelay(timeout, g);
    }

    displayProgress('done');
    renderStatsTable();
    renderBLTable();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareDoTask(node){

  openStatusWindow();

  switch (node.name){
    case 'sf_parseForum': forum(); break;
    case 'sf_memberList': getMembersList(); break;
    case 'sf_sindicateLog': getMaxPageSindicateLog(); break;
  }
  /////////////////////////////

  function forum(){
    var p = getParam('sf_parseForum');

    switch(p.type){
      case 'count':
        displayProgress('start', `Обработка форума синдиката #${$forum.id} «${$forum.name}»`, 0, 100);
        parseForum(0, false, p.count);
        break;

      case 'all':
        getMaxPageForum();
        break;
    }
  }
  /////////////////////////////

  function getParam(name){
    var type, count, table;

    table = $(node).up('table').node();
    type = $(table).find(`input[type="radio"][name="${name}"]:checked`).node().value;
    count = $(table).find(`input[type="text"][name="${name}"]`).node().value;
    count = Number(count);

    return {count: count, type: type};
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function forgetForum(){
  if(confirm('Вы уврены что хотите удалить все данные об этом форуме?')){
    $idb.clear(`members_${$forum.id}`);
    $idb.clear(`themes_${$forum.id}`);
    $idb.clear(`timestamp_${$forum.id}`);
    $forum.posts = 0;
    $forum.words = 0;
    $forum.page = [0, 0];
    $forum.themes = [0, 0];
    $forum.log = [0, 0];
    $forum._ch = true;

    $idb.add("forums", Pack.forum($forum));
    location.href = location.href + "";
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function displayProgress(ini, text, current, max){
  var percent, c, m, b, i, t, te;

  c = $("#sf_progressCurrent");
  m = $("#sf_progressMax");
  b = $("#sf_progressBar");
  i = $("#sf_progressIco").node();
  t = $("#sf_progressText");
  te = $("#sf_progressTextExtra");

  if(ini == 'start'){
    i.style.background = `url(${$ico.loading})`;
    i.name = "work";
    t.html(text);
    m.html(max);
    c.html(current);
    b.node().style.width = '0%';

    $cd.showProgressTime = true;
  }
  if(ini == 'work'){
    current = parseInt(c.text(), 10) + 1;
    max = parseInt(m.text(), 10);

    percent = $c.getPercent(current, max, false);
    b.node().style.width = percent + '%';
    c.html(current);
  }
  if(ini == 'extra'){
    te.html(text);
  }
  if(ini == 'done'){
    te.html('');
    b.node().style.width = '100%';
    c.html(m.text());
    i.style.background = `url(${$ico.done})`;
    i.name = "done";

    $cd.showProgressTime = false;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function displayProgressTime(t){
  var node, time;

  if(!$cd.showProgressTime) return;

  node = $('#sf_progressTime');
  time = t ? t : Number(node.text()) - 1000;
  if(time < 0) time = 0;
  node.node().previousElementSibling.textContent = $c.getNormalTime(time);
  node.html(time);
  displayProgressTime.gkDelay(1000, this, []);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function pauseProgress(){
  var button, progress;

  button = $('#sf_pauseButton').node();
  progress = $('#sf_progressIco').node();

  if($pause.isActive()){
    $pause.deactivate();
    button.value = "Пауза";
    $cd.showProgressTime = true;
    displayProgressTime();
    progress.style.background = `url(${$ico.loading})`;
    i.name = "work";
  }else{
    $pause.activate();
    button.value = "Продолжить";
    $cd.showProgressTime = false;
    progress.style.background = `url(${$ico.pause})`;
    i.name = "pause";
  }
}

function cancelProgress(){
  $cd.showProgressTime = false;

  console.log("Ok");

  $("#sf_shadowLayer").node().style.visibility = "hidden";
  $("#sf_statusWindow").node().style.visibility = "hidden";
  renderTables();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openBlackListWindow(action, text, desc, table){
  var window, inputs;

  window = $("#sf_blWindow").node();

  $(window).find('table').attr("name", table);
  $(window).find('span').text(text);
  $(window).find('input[name="action"]').node().value = action;
  $(window).find('textarea').node().value = desc;

  inputs = $(window).find('input[name="sid"]');
  inputs = [inputs.node(), inputs.prev('input').node()];

  if(action == "edit"){
    inputs[0].disabled = true;
    inputs[1].disabled = true;
  }else{
    inputs[0].disabled = false;
    inputs[1].disabled = false;
  }

  $("#sf_shadowLayer").node().style.visibility = "visible";
  window.style.visibility = "visible";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function openStatusWindow(){
  $("#sf_shadowLayer").node().style.visibility = "visible";
  $("#sf_controlPanelWindow").node().style.visibility = "hidden";
  $("#sf_filtersWindow").node().style.visibility = "hidden";
  $("#sf_messageWindow").node().style.visibility = "hidden";

  $("#sf_statusWindow").node().style.visibility = "visible";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openControlPanelWindow(){
  $("#sf_shadowLayer").node().style.visibility = "visible";
  $("#sf_controlPanelWindow").node().style.visibility = "visible";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openMessageWindow(mode, text, list){
  var window;

  $("#sf_shadowLayer").node().style.visibility = "visible";
  window = $("#sf_messageWindow").node();

  createSelectList();
  createSelectSID();

  $(window).find('span[type="count"]').html(list.length);
  $(window).find('input[name="workMode"]').node().value = mode;
  $(window).find('span[name="workMode"]').text(text);

  window.style.visibility = "visible";
  /////////////////////////////

  function createSelectSID(){
    var code;

    code = '<option value="0">Выберите...</option>';

    $idb.getFew("forums").then((forums)=>{
      forums.forEach((forum)=>{
        forum = Pack.forum(forum);
        if(forum.sid){
          code += `<option value="${forum.sid}">[#${forum.sid}] ${forum.name}</option>`;
        }
      });

      $(window).find('select[name="sid"]').html(code);
    });
  }
  /////////////////////////////

  function createSelectList(){
    var code, i, length;

    code = '<option>Посмотреть список...</option>';
    for(i = 0, length = list.length; i < length; i++){
      code += `<option value="${list[i].id}">${i + 1}. ${list[i].name}</option>`;
    }

    $(window).find('select[name="mid"]').html(code);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function closeWindows(){
  var status = $("#sf_progressIco").node().name;
  var window = $("#sf_statusWindow").node();

  if(window.style.visibility == "visible" && status != "done") return;

  $("#sf_shadowLayer").node().style.visibility = "hidden";

  $("#sf_controlPanelWindow").node().style.visibility = "hidden";
  $("#sf_blWindow").node().style.visibility = "hidden";
  $("#sf_filtersWindow").node().style.visibility = "hidden";
  $("#sf_messageWindow").node().style.visibility = "hidden";
  $("#sf_calendar").node().style.visibility = "hidden";
  window.style.visibility = "hidden";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCharacter(value, tid){
  var player, member, index, id, result, timestamp;
  var g, f;

  index = typeof value == "string" ? "NAME" : "id";
  tid = tid ? tid : $forum.id;

  /////////////////////////////

  f = (resolve) => {
    g = getHim();
    g.next();

    function* getHim(){
      player = yield $idb.getOne.gkWait(g, $idb, [`players`, index, value]);
      player = Pack.player(player);

      if(player == null){
        if(index == "id"){
          id = value;
        }else{
          result = yield requestID.gkWait(g, this, [value]);
          id = result[0];
          displayProgress('extra', '<br><b>Получаю ID персонажа:</b> -');
        }
        player = Create.player(id);
      }

      if(result){
        if(player.status != result[1] || player.date < result[2]){
          player.status = result[1];
          player.date = result[2];
          player._ch = true;
        }
      }

      member = yield $idb.getOne.gkWait(g, $idb, [`members_${tid}`, "id", player.id]);
      member = Pack.member(member);

      if(member == null) member = Create.member(player.id);

      if(player.forums[`f${tid}`] == null){
        player.forums[`f${tid}`] = 1;
        player._ch = true;
      }

      timestamp = yield $idb.getOne.gkWait(g, $idb, [`timestamp_${tid}`, "id", player.id]);
      timestamp = Pack.timestamp(timestamp);
      if(timestamp == null) timestamp = Create.timestamp(player.id);

      resolve({p: player, m: member, t: timestamp});
    }
  };
  /////////////////////////////

  function requestID(name){
    var url, answer, id, result;
    var g, f;

    url = "http://www.ganjawars.ru/search.php?key=" + $c.encodeHeader(name);
    answer = $('<span>').node();

    displayProgress('extra', `<br><b>Получаю ID персонажа:</b> <i>${name}</i>`);

    f = (resolve)=>{
      g = getHim();
      g.next();

      function* getHim(){
        var r;
        r = yield ajax.gkWait(g, this, [url, 'GET', null]);
        answer.innerHTML = r.text;
        correctionTime(500 + r.time);

        id = $(answer).find(`a:contains("~форму нападения")`).node();
        id = id.href.match(/(\d+)/);
        id = Number(id[0]);

        result = getStatusPlayer(answer);

        yield setTimeout(()=>{g.next()}, 500);
        resolve([id, result.status, result.date]);
      }
    };

    return new Promise(f);
  }

  return new Promise(f);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMembersList(){
  var url;

  if($forum.sid){
    url = `http://www.ganjawars.ru/syndicate.php?id=${$forum.sid}&page=members`;
    displayProgress('start', 'Сбор и обработка информации о составе синдиката', 0, 1);

    ajax(url, "GET", null).then((r)=>{
      $answer.innerHTML = r.text;
      correctionTime(r.time);

      prepareMembers().then(()=>{
        $($answer)
          .find('b:contains("Состав синдиката")')
          .up('table')
          .find('a[href*="info.php"]')
          .nodeArr()
          .reduce((sequence, a) => {
          return sequence.then(()=>{
            return parseNodes(a);
          });
        }, Promise.resolve()).then(()=>{
          renderStatsTable();
          displayProgress('done');
        });
      });
    }, (e)=>{
      errorLog("Сбор информации о составе синдиката", 0, e);
    });
  }
  /////////////////////////////

  function prepareMembers(){
    return $idb.getFew(`members_${$forum.id}`).then((members)=>{
      members.forEach((member)=>{
        member.i = 0;
        $idb.add(`members_${$forum.id}`, member);
      });
    });
  }
  /////////////////////////////

  function parseNodes(node){
    var id, name, sn, character, player, member;
    var g, f;

    f = (resolve) => {
      g = parse();
      g.next();

      function* parse(){
        id = Number(node.href.match(/(\d+)/)[1]);
        name = node.textContent;
        sn = $(node).up('tr').node().cells[0].textContent;
        sn = parseInt(sn, 10);

        character = yield getCharacter.gkWait(g, this, [id]);
        player = character.p; member = character.m;

        if(player._ch) player.name = name;
        member.sn = sn;
        member._ch = true;

        $idb.add(`players`, Pack.player(player));
        $idb.add(`members_${$forum.id}`, Pack.member(member));
        resolve();
      }
    };

    return new Promise(f);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMaxPageSindicateLog(){
  var url, page;

  url = `http://www.ganjawars.ru/syndicate.log.php?id=${$forum.sid}&page_id=10000000`;

  ajax(url, 'GET', null).then((r)=>{
    $answer.innerHTML = r.text;
    correctionTime(r.time);

    page = $($answer).find(`b:contains("~Протокол синдиката #${$forum.sid}")`).up('div').next('center').find('a');
    page = page.node(-1).href.split('page_id=')[1];
    page = Number(page);

    if($forum.log[1] != page){
      $forum.log[1] = page;
      $forum._ch = true;
    }

    page = $forum.log[1] - $forum.log[0];
    $idb.add("forums", Pack.forum($forum));

    displayProgress('start', `Обработка протокола синдиката #${$forum.id} «${$forum.name}»`, 0, page + 1);
    displayProgressTime((page + 1) * 1250);
    parseSindicateLog.gkDelay(750, this, [page]);
  }, (e)=>{
    errorLog("Сбор информации о максимальной странцие протокола синдиката", 1, e);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseSindicateLog(index){
  var url;

  if($pause.isStop(cancelProgress)) return;
  if($pause.isActive(parseSindicateLog, arguments)) return;

  if(index != -1){
    url = `http://www.ganjawars.ru/syndicate.log.php?id=${$forum.sid}&page_id=${$forum.log[0]}`;

    ajax(url, 'GET', null).then((r)=>{
      $answer.innerHTML = r.text;
      correctionTime(r.time);

      $($answer)
        .find('font[color="green"]')
        .nodeArr()
        .reverse()
        .reduce((sequence, font) => {
          return sequence.then(()=>{
            return parseNode(font);
          });
        }, Promise.resolve())
        .then(()=>{
          displayProgress("work");
          nextPage();
        });
    }, (e)=>{
      errorLog("Сбор информации с протокола синдиката", 1, e);
    });
  }else{
    renderStatsTable();
    displayProgress('done');
  }
  /////////////////////////////

  function nextPage(){
    index--;
    if($forum.log[0] != $forum.log[1]){
      $forum.log[0]++;
      $forum._ch = true;
    }
    $idb.add("forums", Pack.forum($forum));
    parseSindicateLog.gkDelay(750, this, [index]);
  }

  /////////////////////////////

  function parseNode(node){
    var nobr, type, data, character, value, member, player;
    var g, f;

    f = (resolve)=>{
      g = parse();
      g.next();

      function* parse(){
        node = node.parentNode;
        nobr = $(node).next('nobr').node();
        type = getType(nobr);

        if(type){
          data = getData(node, nobr, type);
          value = data.id ? data.id : data.name;
          character = yield getCharacter.gkWait(g, this, [value]);
          player = character.p; member = character.m;

          if(player.name == ""){
            player.name = data.name;
            player._ch = true;
          }

          if(member[type] < data.date){
            member[type] = data.date;
            member._ch = true;
          }

          if(type == "kick" && member.exit < data.date){
            member.exit = data.date;
            member._ch = true;
          }

          $idb.add("players", Pack.player(player));
          $idb.add(`members_${$forum.id}`, Pack.member(member));
        }
        resolve();
      }
    };

    return new Promise(f);
  }
  /////////////////////////////

  function getType(nobr){
    if(/принят в синдикат/.test(nobr.textContent)) return "enter";
    if(/вышел из синдиката/.test(nobr.textContent)) return "exit";
    if(/покинул синдикат/.test(nobr.textContent)) return "kick";
    if(/пригласил в синдикат/.test(nobr.textContent)) return "invite";
    return null;
  }
  /////////////////////////////

  function getData(node, nobr, type){
    var id, name, date;

    date = node.textContent.match(/(\d+)/g);
    date = `${date[1]}/${date[0]}/20${date[2]} ${date[3]}:${date[4]}`;
    date = Date.parse(date) / 1000;

    if(type == "enter" || type == "exit"){
      id = $(nobr).find('a[href*="info.php"]');
      name = id.text();
      id = id.node().href;
      id = Number(id.match(/(\d+)/)[1]);
    }else{
      name = type == "kick"?
        nobr.textContent.match(/(.+) покинул синдикат \((.+)\)/)[1] :
        nobr.textContent.match(/(.+) пригласил в синдикат (.+)/)[2];
      id = null;
    }

    return {id: id, name: name, date: date};
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMaxPageForum(){
  var url, page;

  url = "http://www.ganjawars.ru/threads.php?fid=" + $forum.id + "&page_id=10000000";

  ajax(url, "GET", null).then((r)=>{
    $answer.innerHTML = r.text;
    correctionTime(r.time);

    $forum.page[1] = parse();
    page = $forum.page[1] - $forum.page[0];

    $idb.add("forums", Pack.forum($forum));

    displayProgress('start', `Обработка форума синдиката #${$forum.id} «${$forum.name}»`, 0, page + 1);
    displayProgressTime(page * 1250 + 1500);

    parseForum.gkDelay(750, this, [page, true]);
  });
  /////////////////////////////

  function parse(){
    var page;

    page = $($answer).find('a[style="color: #990000"]:contains("~Форумы")').up('b').next('center').find('a');
    page = page.node(-1).href.split('page_id=')[1];

    return Number(page);
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseForum(index, mode, stopDate){
  var url, count;

  if($pause.isStop(cancelProgress)) return;
  if($pause.isActive(parseForum, arguments)) return;

  url = `http://www.ganjawars.ru/threads.php?fid=${$cd.fid}&page_id=${index}`;
  count = 0;

  if(index != -1){
    ajax(url, "GET", null).then((r)=>{
      var rows;

      $answer.innerHTML = r.text;
      correctionTime(r.time);
      displayProgress('work');

      rows = $($answer)
        .find('td[style="color: #990000"]:contains("Тема")')
        .up('table')
        .find('tr[bgcolor="#e0eee0"],[bgcolor="#d0f5d0"]')
        .nodeArr();

      if(!mode && rows.length == 0){
        endParseForum();
        return;
      }

      rows.reduce((sequence, tr) => {
        return sequence.then(()=>{
          return parseRow(tr);
        });
      }, Promise.resolve()).then(()=>{
        nextPageForum();
      });
    }, (e)=>{
      errorLog("Сбор информации о темах", 0, e);
    });
  }else{
    endParseForum();
  }
  /////////////////////////////

  function parseRow(tr){
    var td, tid, theme, player, character, member, pages, posts, date;
    var g, f;

    f = (resolve) => {
      g = parse();
      g.next();

      function* parse(){
        td = tr.cells;
        tid = getId();
        date = getDate();

        if(stopDate != null && !(stopDate < date)) count++;

        if(count > 5){
          index = -2;
          return resolve();
        }

        theme = yield $idb.getOne.gkWait(g, $idb, [`themes_${$forum.id}`, "id", tid]);
        theme = Pack.theme(theme);

        if(theme == null){
          $forum.themes[1]++;
          $forum._ch = true;

          theme = Create.theme(tid);
          theme.name = getName();
          theme.author = getAuthor();
          theme.posts = getPosts();
          theme.pages = getPages();
          theme.start = date;
        }else{
          posts = getPosts();
          if(posts[1] != theme.posts[1]){
            theme.posts = posts;
            theme._ch = true;
          }

          pages = getPages();
          if(pages[1] != theme.pages[1]){
            theme.pages = pages;
            theme._ch = true;
          }
        }

        $idb.add(`themes_${$forum.id}`, Pack.theme(theme));

        character = yield getCharacter.gkWait(g, this, [theme.author[0]]);
        player = character.p; member = character.m;

        if(player._ch) player.name = theme.author[1];

        if(!$c.exist(theme.id, member.start)){
          member.start.push(theme.id);
          member._ch = true;
        }

        $idb.add(`players`, Pack.player(player));
        $idb.add(`members_${$forum.id}`, Pack.member(member));
        resolve();
      }
    };

    return new Promise(f);
    /////////////////////////////

    function getId(){
      var id;

      id = $(td[0]).find('a').node();
      id = id.href.split('tid=')[1];

      return Number(id);
    }
    /////////////////////////////

    function getName(){
      return $(td[0]).find('a').text();
    }
    /////////////////////////////

    function getPosts(){
      var posts;

      posts = $(td[2]).text().replace(/,/g, '');
      posts = Number(posts);

      if(theme == null){
        return [0, posts];
      }else{
        return [theme.posts[0], posts];
      }
    }
    /////////////////////////////

    function getPages(){
      var page;

      page = [
        parseInt(theme.posts[0] / 20, 10),
        parseInt(theme.posts[1] / 20, 10) + 1
      ];

      return page;
    }
    /////////////////////////////

    function getDate(){
      var date;

      date = tr.previousSibling.data;
      date = date.match(/(\d+)/g);
      date = `${date[1]}/${date[2]}/${date[0]} ${date[3]}:${date[4]}:${date[5]}`;
      date = Date.parse(date) / 1000;

      return date;
    }
    /////////////////////////////

    function getAuthor(){
      var a, name, id;

      a = $(td[3]).find('a[href*="info.php"]');
      name = a.text();
      id = a.node().href.match(/(\d+)/)[0];

      return [Number(id), name];
    }
  }
  /////////////////////////////

  function endParseForum(){
    renderTables();
    displayProgress('done');
  }
  /////////////////////////////

  function nextPageForum(){
    index = mode ? index - 1 : index + 1;
    if(mode && $forum.page[0] != $forum.page[1]){
      $forum._ch = true;
      $forum.page[0]++;
    }

    $idb.add(`forums`, Pack.forum($forum));

    parseForum.gkDelay(750, this, [index, mode, stopDate]);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareParseThemes(max, data){
  var list, countPages, theme, type;
  var i, length;

  countPages = 0;
  list = [];
  type = data ? "{}" : "[]";

  $idb.getFew(`themes_${$forum.id}`, type).then((themes)=>{
    if(data){
      for(i = 0, length = data.length; i < length; i++) push(themes, data[i].id);
    }else{
      for(i = 0, length = max ? max : themes.length; i < length; i++) push(themes, i);
    }

    countPages = list.length * 1250 + countPages * 1250 + 500;

    openStatusWindow();
    displayProgress('start', `Обработка тем`, 0, list.length);
    displayProgressTime(countPages);
    parseThemes(0, list.length, list);
  });

  /////////////////////////////

  function push(themes, id){
    theme = Pack.theme(themes[id]);

    if(theme.posts[0] != theme.posts[1]){
      countPages += theme.pages[1] - theme.pages[0];
      list.push(theme);

      if(theme.posts[0] != 0){
        $forum.themes[0]--;
      }
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseThemes(index, max, list){
  var theme, startPost;

  if($pause.isStop(cancelProgress)) return;
  if($pause.isActive(parseThemes, arguments)) return;

  if(index < max){
    theme = list[index];
    startPost = theme.posts[0] % 20;
    startPost = startPost ? startPost + 1 : 1;

    parseTheme(theme, startPost, [index, max, list]);
  }else{
    renderTables();
    displayProgress('done');
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseTheme(theme, startPost, args){
  var url, table, tr;
  var i, length, rows = [];

  if($pause.isStop(cancelProgress)) return;
  if($pause.isActive(parseTheme, arguments)) return;

  if(theme.pages[0] != theme.pages[1]){
    displayProgress('extra', `<br><b>Тема:</b> <i>${theme.name}</i> [${theme.pages[0] + 1}/${theme.pages[1]}]`);
    url = 'http://www.ganjawars.ru/messages.php?fid=' + $forum.id + '&tid='+ theme.id +'&page_id=' + theme.pages[0];

    ajax(url, "GET", null).then((r)=>{
      $answer.innerHTML = r.text;
      correctionTime(r.time);

      table = $($answer).find('td[style="color: #990000"]:contains("Автор")').up('table').node();
      $(table).find('font:contains("~Тема закрыта")').nodeArr().forEach(
        function(node){
          node = $(node).up('tr').node();
          node.parentNode.removeChild(node);
        }
      );

      tr = table.rows;
      for(i = startPost, length = tr.length; i < length; i++){
        rows.push(tr[i]);
      }

      rows.reduce(
        (sequence, tr)=>{return sequence.then(()=>{return parseRow(tr);});},
        Promise.resolve()
      ).then(()=>{
        nextPageTheme();
      });

    }, (e)=>{
      errorLog('Сбор информации о сообщениях', 1, e);
      nextPageTheme(true);
    });
  }else{
    nextTheme();
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function parseRow(tr){
    var table, pid, words, date, carma;
    var character, player, member;
    var timestamp, tsKeys;
    var g, f;

    f = (resolve) => {
      g = parse();
      g = g.next();

      function* parse(){
        pid = getId();

        character = yield getCharacter.gkWait(g, this, [pid]);
        player = character.p; member = character.m; timestamp = character.t;

        date = getLastDate();
        words = getWords();
        carma = getCarma();

        if(player.name == ""){
          player.name = getName();
          player._ch = true;
        }

        theme.posts[0]++;
        if(theme.posts[0] > theme.posts[1])
          theme.posts[1] = theme.posts[0];
        theme._ch = true;

        $forum.posts++;
        $forum.words += words;
        $forum._ch = true;

        member.posts++;
        member.last = date;
        member.words += words;
        member.wordsAverage += parseInt(member.words / member.posts, 10);
        member.carma += carma;
        member.carmaAverage = parseInt(member.carma / member.posts, 10);
        if(!$c.exist(theme.id, member.write)) member.write.push(theme.id);
        member._ch = true;

        timestamp.data[$date] = Create.stamp(member);
        tsKeys = Object.keys(timestamp.data);
        if(tsKeys.length > $maxTimestamps) delete timestamp.data[tsKeys[0]];
        timestamp._ch = true;

        $idb.add("players", Pack.player(player));
        $idb.add(`members_${$forum.id}`, Pack.member(member));
        $idb.add(`timestamp_${$forum.id}`, Pack.timestamp(timestamp));
        resolve();
      }
    };

    return new Promise(f);
    /////////////////////////////

    function getId(){
      var id;

      id = $(tr.cells[0]).find('a[href*="info.php"]').node();
      id = id.href.match(/(\d+)/)[1];
      id = Number(id);

      return id;
    }
    /////////////////////////////

    function getName(){
      return $(tr.cells[0]).find('a[href*="info.php"]').text();
    }
    /////////////////////////////

    function getLastDate(){
      var date;

      date = $(tr.cells[1]).find('td[align="left"]:contains("~написано")').text();

      date = date.match(/(.+): (\d+)-(\d+)-(\d+) (.+) /);
      date = `${date[3]}/${date[4]}/${date[2]} ${date[5]}`;
      date = Date.parse(date) / 1000;

      return date > member.last ? date : member.last;
    }
    /////////////////////////////

    function getWords(){
      var words;

      words = $(tr.cells[1]).find('table[cellpadding="5"]').text();
      words = (words.replace(/\s['";:,.?¿\-!¡]/g, '').match(/\s+/g) || []).length + 1;

      return words;
    }
    /////////////////////////////

    function getCarma(){
      var carma;

      carma = $(tr).find('span[title="Балл сообщения"]');
      carma = carma.length ? Number(carma.text()) : 0;

      return carma;
    }
  }
  /////////////////////////////

  function nextPageTheme(error){
    var page = $($answer).find('a[class="clr"][style*="#AA0000"]');

    if(page.length && page.up('td').next('td').length || error){
      theme.pages[0]++;
      theme._ch = true;

      parseTheme.gkDelay(750, this, [theme, 1, args]);
    }else{
      nextTheme();
    }

    $idb.add("forums", Pack.forum($forum));
    $idb.add(`themes_${$forum.id}`, Pack.theme(theme));
  }
  /////////////////////////////

  function nextTheme(){
    args[0]++;
    $forum.themes[0]++;
    $forum._ch = true;

    $idb.add("forums", Pack.forum($forum));
    $idb.add(`themes_${$forum.id}`, Pack.theme(theme));

    displayProgress('work');
    parseThemes.gkDelay(750, this, args);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareParseMembers(max, data){
  var list, count, player, type;
  var i, length;

  count = 0;
  list = [];
  type = data ? "{}" : "[]";

  $idb.getFew(`players`, type).then((players)=>{
    if(data){
      for(i = 0, length = data.length; i < length; i++) push(players, data[i].id);
    }else{
      for(i = 0, length = max ? max : players.length; i < length; i++) push(players, i);
    }

    count = list.length;

    openStatusWindow();
    displayProgress('start', `Обработка персонажей`, 0, count);
    displayProgressTime(count * 1250);
    parseMembers(0, count, list);
  });

  /////////////////////////////

  function push(players, id){
    player = Pack.player(players[id]);
    list.push(player);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseMembers(id, count, list){
  var url, player;

  if($pause.isStop(cancelProgress)) return;
  if($pause.isActive(parseMembers, arguments)) return;

  if(id < count){
    player = list[id];
    url = `http://www.ganjawars.ru/info.php?id=${player.id}`;

    ajax(url, 'GET', null).then((r)=>{
      $answer.innerHTML = r.text;
      correctionTime(r.time);

      displayProgress("extra", `<br><b>Получение статуса персонажа:</b> <i>${player.name}</i>`);
      parseMember(player);
      nextMember();

    }, (e)=>{
      errorLog('Сбор статуса персонажа', 0, e);
      nextMember();
    });
  }else{
    renderStatsTable();
    displayProgress('done');
  }
  /////////////////////////////

  function nextMember(){
    id++;
    displayProgress.gkDelay(750, this, ['work']);
    parseMembers.gkDelay(750, this, [id, count, list]);
  }
  /////////////////////////////

  function parseMember(player){
    var result;

    result = getStatusPlayer($answer);

    if(player.status != result.status || player.date < result.date){
      player.status = result.status;
      player.date = result.date;
      player._ch = true;
    }

    $idb.add("players", Pack.player(player));
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getStatusPlayer(answer){
  var block, arrest, banDefault, banCommon, banTrade, status, date;

  status = 1;
  date = parseInt(new Date().getTime() / 1000, 10);

  block = $(answer).find('font[color="red"]:contains("Персонаж заблокирован")');
  arrest = $(answer).find('center:contains("Персонаж арестован, информация скрыта")').find('font[color="#000099"]');
  banDefault = $(answer).find('font[color="red"]:contains("~временно забанен в форуме модератором")');
  banCommon = $(answer).find('center:contains("~Персонаж под общим баном")').find('font[color="#009900"]');
  banTrade = $(answer).find('font[color="red"]:contains("~забанен в торговых форумах")');

  if(banTrade.length){
    date = getDate(banTrade.text());
    status = 2;
  }
  if(arrest.length){
    date = 0;
    status = 3;
  }
  if(banDefault.length){
    date = getDate(banDefault.text());
    status = 4;
  }
  if(banCommon.length){
    date = getDate(banCommon.text());
    status = 5;
  }
  if(block.length){
    date = 0;
    status = 6;
  }

  return {status: status, date: date};
  /////////////////////////////

  function getDate(string){
    var date;

    date = string.match(/(\d+)/g);
    date = `${date[3]}/${date[2]}/20${date[4]} ${date[0]}:${date[1]}`;
    date = Date.parse(date) / 1000;

    return date;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareSendMails(){
  var param, window, sid, tm, count;
  var g, f;

  f = (resolve) => {
    g = prepare();
    g.next();

    function* prepare(){
      tm = {
        mail: "Отправка почты",
        invite: "Отправка почты и приглашений",
        goAway: "Отправка почты и изгнание"
      };

      param = {
        list: [],
        awayList: {},
        lopata: "",
        out: 0,
        subject: "",
        message: "",
        sid: 0,
        mode: "",
        id: ""
      };

      window = $("#sf_messageWindow").node();
      param.subject = $c.encodeHeader($(window).find('input[type="text"][name="subject"]').node().value);
      param.message = $c.encodeHeader($(window).find('textarea[name="message"]').node().value);
      param.mode = $(window).find('input[name="workMode"]').node().value;
      sid = $(window).find('select[name="sid"]').find('option:checked').node();
      param.sid = Number(sid.value); sid = sid.textContent;
      param.id = "1" + param.sid;

      if(param.mode == "mail"){
        if(!confirm(`Режим: ${tm[param.mode]}\n\n Все правильно?`)) return;
      }else{
        if(param.sid == 0){
          alert("Не выбран синдикат!");
          return;
        }
        if(!confirm(`Режим:       ${tm[param.mode]}\nСиндикат:  ${sid}\n\n Все правильно?`)) return;
      }

      //if(param.mode == "invite"){
      //  yield getDataInvite.gkWait(g, this, []);
      //  yield setTimeout(()=>{g.next()}, 750);
      //}

      if(param.mode == "goAway"){
        yield getDataIdKick.gkWait(g, this, []);
        yield setTimeout(()=>{g.next()}, 750);
      }

      yield getDataSend.gkWait(g, this, []);

      getSendingList();
      count = param.list.length;

      yield setTimeout(()=>{g.next()}, 750);

      openStatusWindow();
      displayProgress('start', 'Рассылка сообщений выбранным игрокам', 0, count);
      displayProgressTime((count * 39500) + 500);

      doActions(0, count, param);
      resolve();
    }
  };

  new Promise(f);
  /////////////////////////////

  function getDataSend(){
    var url = 'http://www.ganjawars.ru/sms-create.php';

    return ajax(url, "GET", null).then((r)=>{
      $answer.innerHTML = r.text;
      correctionTime(r.time);

      param.out = Number($($answer).find('input[type="hidden"][name="outmail"]').node().value);
      param.lopata = $($answer).find('input[type="hidden"][name="lopata"]').node().value;
    }, (e)=>{
      errorLog('Получении лопаты', 0, e);
    });
  }
  /////////////////////////////

  //function getDataInvite(){
  //  var url = 'http://www.ganjawars.ru/syndicate.edit.php?key=invites&id=' + param.sid;
  //
  //  return ajax(url, 'GET', null).then((r)=>{
  //    //invites = {};
  //
  //    $answer.innerHTML = r.text;
  //    correctionTime(r.time);
  //
  //    $($answer)
  //      .find('b:contains("Приглашенные персоны:")')
  //      .up('td')
  //      .find('a[href*="info.php"]')
  //      .nodeArr()
  //      .forEach((node)=>{
  //        invites[node.textContent] = node.href.split('=')[1];
  //      });
  //  }, (e)=>{
  //    errorLog('Получении списка приглашений', 0, e);
  //  });
  //}
  /////////////////////////////

  function getDataIdKick(){
    var url = "http://www.ganjawars.ru/syndicate.edit.php?key=users&id=" + param.sid;

    return ajax(url, "GET", null).then((r)=>{
      param.awayList = {};

      $answer.innerHTML = r.text;
      correctionTime(r.time);

      $($answer)
        .find('select[name="cid"]')
        .find("option")
        .nodeArr()
        .forEach((option)=>{
          var id, name;

          id = Number(option.value);
          name = option.textContent;
          name = name.match(/(\d+)\. (.+) \/ \$(\d+)/);
          name = name[2];

          param.awayList[name] = id;
        });
    }, (e)=>{
      errorLog('Получении списка id на исключения', 0, e);
    });
  }
  /////////////////////////////

  function getSendingList(){
    $(window).find('select')
      .find('option[value]')
      .nodeArr()
      .forEach((option)=>{
        var name, id;

        id = Number(option.value);
        name = option.textContent.match(/(\d+)\. (.+)/)[2];

        param.list.push({
          id: id,
          name: name,
          encode: $c.encodeHeader(name)
        });
      });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doActions(index, count, param){
  if($pause.isStop(cancelProgress)) return;
  if($pause.isActive(doActions, arguments)) return;

  if(index < count){
    if(param.mode == "invite"){
      sendInvite(index, param);
    }
    if(param.mode == "goAway"){
      if(param.awayList[param.list[index].name] != null){
        doKicking(index, param);
      }
    }

    sendMail.gkDelay(1250, this, [index, param]);

    param.out++;
    index++;

    displayProgress('work');
    doActions.gkDelay($c.randomNumber(360, 380) * 100, this, [index, count, param]);
  }else{
    displayProgress('done');
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendMail(index, param){
  var url, data;

  url = "http://www.ganjawars.ru/sms-create.php";
  data = `postform=1&outmail=${param.out}&lopata=${param.lopata}&mailto=${param.list[index].encode}&subject=${param.subject}&msg=${param.message}`;

  ajax(url, "POST", data).then((r)=>{
    correctionTime(r.time);
  }, (e)=>{
    errorLog(`Отправке письма ${param.list[index].name}`, 0, e);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendInvite(index, param){
  var url, data, men;
  var invite, invited;

  men = param.list[index];
  url = "http://www.ganjawars.ru/syndicate.edit.php";
  data = `key=invites&id=${param.sid}&invite=${men.encode}`;

  ajax(url, "POST", data).then((r)=>{
    $answer.innerHTML = r.text;
    correctionTime(r.time);

    invite = $($answer).find('b:contains("Приглашенные персоны:")');
    if(invite.length){
      invited = invite.up('td').find(`a[href*="info.php?id=${men.id}"]`);

      if(invited.length){
        getCharacter(men.id, param.id).then((character)=>{
          character.m.invite = new Date().getTime() / 1000;
          character.m._ch = true;

          $idb.add(`players`, Pack.player(character.p));
          $idb.add(`members_${param.id}`, Pack.member(character.m));
        });
      }else{
        console.log(`Не найден приглашенный. ${men.name}`);
      }
    }else{
      console.log(`Не найдена таблица приглашений. ${men.name}`);
    }
  }, (e)=>{
    errorLog(`Отправке приглашения ${men.name}`, 0, e);
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doKicking(index, param){
  var url, men, data, kickId;

  url = "http://www.ganjawars.ru/syndicate.edit.php";
  men = param.list[index];
  kickId = param.awayList[men.name];
  data = `id=${param.sid}&key=users&remove=${kickId}`;

  ajax(url, "POST", data).then((r)=>{
    correctionTime(r.time);

    getCharacter(men.id, param.id).then((character)=>{
      character.m.kick = new Date().getTime() / 1000;
      character._ch = true;

      $idb.add(`players`, Pack.player(character.p));
      $idb.add(`members_${param.id}`, Pack.member(character.m));
    });
  }, (e)=>{
    errorLog(`Изгнанние ${param.name}, ID Kick:${kickId}`, 0, e);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderBaseHTML(){
  var t;

  t = $t.stats;
  t.setStructure({
    id: [75, "number", "ID"],
    sNumber: [45, "number|boolean", "По составу синдиката|в списке|тех кто в списке"],
    name: [-1, "check", "Имя персонажа"],
    start: [75, "number", "Начато тем"],
    write: [75, "number", "Учавствовал в темах"],
    lastMessage: [95, "date|boolean", "Последнее сообщение|кто писал сообщения|тех кто писал сообщения"],
    posts: [80, "number", "Всего сообщений"],
    words: [75, "number", "Всего написанных слов"],
    wordsAverage: [95, "number", "Среднее количество написанных слов"],
    carma: [75, "number", "Всего кармы"],
    carmaAverage: [95, "number", "Среднее количество кармы"],
    status: [172, "multiple", "Статус"],
    enter: [80, "date|boolean", "Принят в синдикат|принятые в синдикат|тех кто был"],
    exit: [80, "date|boolean", "Покинул синдикат|кто поикнули|тех кто не покидал"],
    kick: [40, "boolean", "Исключен из состава синдиката|исключенные|исключенных"],
    invite: [40, "boolean", "Приглашен в синдикат|кого приглашал|тех кого приглашал"],
    bl: [40, "boolean", "Черный список|кто в списке|тех кто в списке"],
    check: [45, null, null]
  });

  $('#sf_header_SI').html('@include: ./html/statsTableHeader.html, true');
  $('#sf_footer_SI').html('@include: ./html/statsTableFooter.html, true');

  t.setSizes();
  t.setSorts(renderStatsTable);
  t.setFilters(renderStatsTable);
  t.bindCheckAll();

  t = $t.themes;
  t.setStructure({
    id: [75, "number", "ID"],
    name: [-1, "check", "Названии темы"],
    author: [300, "check", "Имени автора"],
    start: [80, "date", "Дате создания"],
    postsNew: [100, "number|boolean", "Новых сообщений|новые|новых"],
    postsDone: [100, "number", "Обработано сообщений"],
    postsAll: [100, "number", "Всего сообщений"],
    pageAll: [80, "number", "Всего страниц"],
    check: [45, null, null]
  });

  $('#sf_header_TL').html('@include: ./html/themesTableHeader.html, true');
  $('#sf_footer_TL').html('@include: ./html/themesTableFooter.html, true');

  t.setSizes();
  t.setSorts(renderThemesTable);
  t.setFilters(renderThemesTable);
  t.bindCheckAll();

  t = $t.bl;
  t.setStructure({
    id: [75, "number", "ID"],
    name: [250, "check", "Имя игрока"],
    date: [150, "date", "Дата добавления"],
    desc: [-1, "check|boolean", "Описание, причина|с описанием|тех кто с описанием"],
    check: [45, null, null]
  });

  $('#sf_header_BL').html('@include: ./html/blTableHeader.html, true');
  $('#sf_footer_BL').html('@include: ./html/blTableFooter.html, true');

  t.setSizes();
  t.setSorts(renderBLTable);
  t.setFilters(renderBLTable);
  t.bindCheckAll();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderStatsTable(mode){
  var g, table, players, cMembers, members, row;

  cMembers = {};
  table = $t.stats;
  g = render();
  g.next();

  function* render(){
    if(mode == null){
      mode = "filter";
      table.clearContent();

      members = yield $idb.getFew.gkWait(g, $idb, [`members_${$forum.id}`]);
      players = yield $idb.getFew.gkWait(g, $idb, ["players", "{}", `FID_${$forum.id}`]);

      if($forum.sid == null && $idb.exist('members_17930'))
        cMembers = yield $idb.getFew.gkWait(g, $idb, ['members_17930', '{}']);

      members.forEach((member)=>{
        row = Create.characters(member, players[member.id], cMembers[member.id]);
        table.pushContent(row);
      });
    }

    table.prepare(mode);
    yield showTable.gkWait(g, this, [table]);
    table.bindClickRow(true);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderThemesTable(mode){
  var g, table, themes, row;

  table = $t.themes;
  g = render();
  g.next();

  function* render(){
    if(mode == null){
      mode = "filter";
      table.clearContent();

      themes = yield $idb.getFew.gkWait(g, $idb, [`themes_${$forum.id}`]);
      themes.forEach((theme)=>{
        row = Create.thread(theme);
        table.pushContent(row);
      });
    }

    table.prepare(mode);
    yield showTable.gkWait(g, this, [table]);
    table.bindClickRow(true);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderBLTable(mode){
  var g, table, players, row;

  table = $t.bl;
  g = render();
  g.next();

  function* render(){
    if(mode == null){
      mode = "filter";
      table.clearContent();

      players = yield $idb.getFew.gkWait(g, $idb, [`players`, "[]", "BL", [">", 1]]);
      players.forEach((player)=>{
        row = Create.blackList(player);
        table.pushContent(row);
      });
    }

    table.prepare(mode);
    yield showTable.gkWait(g, this, [table]);
    table.bindClickRow(true);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderTables(){
  renderStatsTable();
  renderThemesTable.gkDelay(600);
  renderBLTable.gkDelay(1200);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showTable(t){
  var code, rows, html, first = 1, n = 0, b;
  var i, length;

  rows = t.getContent(true);
  code = [];
  html = "";

  for(i = 0, length = rows.length; i < length; i++){
    b = i > 0 && i < length - 1 ? "" : (i == 0 ? 'type="no-b-top"' : 'type="no-b-bottom"');
    if(!n && i == 80){
      code[n] = html;
      html = "";
      n++;
    }
    if(i && i % 1500 == 0){
      code[n] = html;
      html = "";
      n++;
    }
    html += getRows(t, rows[i], b);
  }
  code[n] = html;

  return code.reduce((sequence, c) => {
    return sequence.then(()=>{
      return insert(c);
    });
  }, Promise.resolve());

  /////////////////////////////

  function insert(code){
    return new Promise((resolve)=>{
      if(first){
        t.render(code, false);
        first = 0;
      }else{
        t.render(code, true);
      }
      setTimeout(()=>{
        resolve();
      }, 100);
    })
  }
  /////////////////////////////

  function getRows(t, tr, border){
    switch(t.getName()){
      case "stats":
        return '@include: ./html/statsTableRow.html, true';
        break;

      case "themes":
        return '@include: ./html/themesTableRow.html, true';
        break;

      case "bl":
        return '@include: ./html/blTableRow.html, true';
        break;
    }
  }
  /////////////////////////////

  function statusMember(tr){
    if(tr.status == 0)
      return "";
    if(tr.status == 1)
      return `В порядке [${$c.getNormalDate(tr.date).d}]`;
    if(tr.date != 0)
      return $date > tr.date ? "?" : `<span style="${$status[tr.status].s}">${$status[tr.status].t}</span> [${$c.getNormalDate(tr.date).d}]`;

    return`<span style="${$status[tr.status].s}">${$status[tr.status].t}</span>`;
  }
  /////////////////////////////

  function getClass(row){
    return row.check ? "light checked" : "light";
  }
  /////////////////////////////

  function getChecked(row){
    return row.check ? "checked" : "";
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getTimeRequest(type){
  if(!type){
    $cd.timeRequest = new Date().getTime();
  }else{
    $cd.timeRequest = new Date().getTime() - $cd.timeRequest;
    console.log($cd.timeRequest);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function correctionTime(t){
  var node, time;

  node = $('#sf_progressTime');
  time = Number(node.text());

  if(t > 500){
    node.html(time - (500 - t));
  }else if(t < 500){
    node.html(time + (t - 500));
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function errorLog(text, full, e){
  if(full){
    $cd.showProgressTime = false;
    console.groupCollapsed($nameScript);
    console.error(`Случилась при: ${text}. Ошибка: %s, строка: %d"`, e.name, e.lineNumber);
    console.groupEnd();
  }else{
    console.groupCollapsed($nameScript);
    console.error(`Запрос завершился неудачно. ${text}.`);
    console.error(e);
    console.groupEnd();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////