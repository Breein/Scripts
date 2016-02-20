require('./../../../js/prototypes')();
var $ = require('./../../../js/dom');
var db = require('./../../../js/idb');
var bindEvent = require('./../../../js/events');
var ajax = require('./../../../js/request');
var createTable = require('./../../../js/table');

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js')();
const $calendar = require('./../../../js/calendar.js')();
const Create = require('./../src/creator.js')();
const Pack = require('./../src/packer.js')();
const $ico = require('./../src/icons.js');


var $nameScript = "Stats forums [GW]";
var $mode = true;
var $sd, $cd, $ss, $tsd, $answer, $screenWidth, $screenHeight, $date, $checked, $t;

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
$date = parseInt(new Date().getTime() / 1000, 10);

$ss = {
  sort: {
    stats: {
      type: 1,
      cell: 'name'
    },
    themes: {
      type: 1,
      cell: 'id'
    }
  },
  show:{
    stats:{},
    themes:{}
  }
};

$cd = {
  showProgressTime: false,
  statsCount: 0,
  themesCount: 0,
  filterNode: null
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

addStyle();
createStatGUIButton();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addStyle(){
  var css, code;

  code =
    `
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
    }

    #sf_statusWindow{
      left: ${$screenWidth / 2 - 325};
      top: ${$screenHeight / 2 - 120};
    }
    #sf_controlPanelWindow{
        left: ${$screenWidth / 2 - 175};
        top: ${$screenHeight / 2 - 260};
    }
    #sf_messageWindow{
        left: ${$screenWidth / 2 - 370};
        top: ${$screenHeight / 2 - 222};
    }`;

  code += '@include: ./html/index.css';
  code += '@include: ./../../css/filter.css';

  css = $("style").html(code).node();
  css.setAttribute("type", "text/css");
  css.setAttribute("script", "true");

  document.head.appendChild(css);
}

function createStatGUIButton(){
  var fid, name, navigate, button;

  fid = location.search.match(/(\d+)/);
  fid = Number(fid[1]);

  navigate = $('a[style="color: #990000"]:contains("~Форумы")').up('b');
  name = navigate.text().match(/(.+) » (.+)/)[2];

  button = $('<span>').html('@include: ./html/button.html').node();
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

  makeConnect("gk_StatsForum", true);
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
      stats: createTable(["#sf_header_SI", "#sf_content_SI", "#sf_footer_SI"], "stats", $ss, $ico),
      themes: createTable(["#sf_header_TL", "#sf_content_TL", "#sf_footer_TL"], "themes", $ss, $ico)
    };

    $idb.getOne("forums", "id", $cd.fid).then((res)=>{
      $forum = Pack.forum(res);
      //$forum.log[0] = 0;
      createGUI();
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI(){
  var table, td, gui;

  table = $('td[style="color: #990000"]:contains("Тема")').up('table').up('table').node();
  td = table.rows[0].cells[0];

  gui = $('<td>').html('@include: ./html/baseGUI.html').node();

  td.parentNode.removeChild(td);
  table.rows[0].appendChild(gui);


  $('td[class="tab"],[class="tab tabActive"]').nodeArr().forEach((tab)=>{
    bindEvent(tab, 'onclick', ()=>{selectTabTable(tab)});
  });

  renderBaseHTML();
  renderTables();
  createShadowLayer();

  bindEvent($('#sf_gui_settings').node(), 'onclick', openControlPanelWindow);
  bindEvent($('#sf_gui_message').node(), 'onclick', openMessageWindow);
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

  $calendar.setContainer("#sf_calendar");
  $calendar.bind($('span[type="calendarCall"]').node());
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

function createStatusWindow(){
  return '@include: ./html/statusWindow.html';
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createControlPanel(){
  var code, disabled;

  disabled = $mode ? '' : 'disabled';
  code = '@include: ./html/controlPanel.html';

  return code;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createMessageWindow(){
  return '@include: ./html/messageWindow.html';
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

function prepareDoTask(node){

  openStatusWindow();

  switch (node.name){
    case 'sf_parseForum': forum(); break;
    case 'sf_parseThemes': themes(); break;
    case 'sf_parsePlayers': players(); break;
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

  function themes(){
    var p = getParam('sf_parseThemes'), l;

    switch(p.type){
      case 'count':
        prepareParseThemes(p.count);
        break;

      case 'select':
        l = getList('sf_themesList');
        prepareParseThemes(0, l);
        break;

      case 'all':
        prepareParseThemes(0);
        break;
    }
  }
  /////////////////////////////

  function players(){
    var p, l;

    p = getParam('sf_parsePlayers');

    switch(p.type){
      case 'count':
        prepareParseMembers(p.count);
        break;

      case 'select':
        l = getList('sf_membersList');
        prepareParseMembers(0, l);
        break;

      case 'all':
        prepareParseMembers(0);
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
  /////////////////////////////

  function getList(name){
    var id, list = [];

    $(`input[type="checkbox"][name="${name}"]:checked`).nodeArr().forEach(
      function(node){
        id = Number(node.value);
        list.push(id);
      }
    );

    return {array: list, count: list.length};
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
  var percent, c, m, b, i, t, te, img;

  img = `<div style="width: 25px; height: 25px; background: url(${$ico.loading});"></div>`;

  c = $("#sf_progressCurrent");
  m = $("#sf_progressMax");
  b = $("#sf_progressBar");
  i = $("#sf_progressIco");
  t = $("#sf_progressText");
  te = $("#sf_progressTextExtra");

  if(ini == 'start'){
    i.html(img);
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
    i.html('<b>Завершено!</b>');

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
function openStatusWindow(){
  $("#sf_controlPanelWindow").node().style.visibility = "hidden";
  $("#sf_filtersWindow").node().style.visibility = "hidden";
  $("#sf_messageWindow").node().style.visibility = "hidden";

  $("#sf_statusWindow").node().style.visibility = "visible";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openControlPanelWindow(){
  $("#sf_shadowLayer").node().style.visibility = "visible";

  $("#sf_countThreads").html($forum.themes[0] + '/' + $forum.themes[1]);
  $("#sf_countMembers").html($cd.statsCount);
  $("#sf_controlPanelWindow").node().style.visibility = "visible";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openFiltersWindow(){
  $("#sf_shadowLayer").node().style.visibility = "visible";
  $("#sf_filtersWindow").node().style.visibility = "visible";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openMessageWindow(){
  var window, n;

  $("#sf_shadowLayer").node().style.visibility = "visible";
  window = $("#sf_messageWindow").node();
  n = 0;

  createSelectList();
  createSelectSID();
  $(window).find('span[type="count"]').html(n);

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
    var code, name;

    code = '<option>Посмотреть список...</option>';

    $('#sf_content_SI').find('input[type="checkbox"]:checked')
      .nodeArr()
      .forEach(
        function(box){
          n++;
          name = $(box).up('tr').node().cells[2].textContent;
          code += `<option value="${box.value}">${n}. ${name}</option>`;
        }
      );

    $(window).find('select[name="mid"]').html(code);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function closeWindows(){
  var status = $("#sf_progressIco").text();
  var window = $("#sf_statusWindow").node();

  if(window.style.visibility == "visible" && status != "Завершено!") return;

  $("#sf_shadowLayer").node().style.visibility = "hidden";

  $("#sf_controlPanelWindow").node().style.visibility = "hidden";
  $("#sf_filtersWindow").node().style.visibility = "hidden";
  $("#sf_messageWindow").node().style.visibility = "hidden";
  $("#sf_calendar").node().style.visibility = "hidden";
  window.style.visibility = "hidden";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCharacter(value, tid){
  var player, member, index, id, result;
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

      resolve({p: player, m: member});
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
          pages = getPages();

          if(posts[1] != theme.posts[1]){
            theme.posts = posts;
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
      for(i = 0, length = data.count; i < length; i++) push(themes, data.array[i]);
    }else{
      for(i = 0, length = max ? max : themes.length; i < length; i++) push(themes, i);
    }

    countPages = list.length * 1250 + countPages * 1250 + 500;

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
        $forum.page[0]--;
      }
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseThemes(index, max, list){
  var info, theme, startPost;

  if(index < max){
    theme = list[index];
    startPost = theme.posts[0] % 20;
    startPost = startPost ? startPost : 1;

    parseTheme();
  }else{
    renderTables();
    displayProgress('done');
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function parseTheme(){
    var url, table, tr;
    var i, length, rows = [];

    url = 'http://www.ganjawars.ru/messages.php?fid=' + $forum.id + '&tid='+ theme.id +'&page_id=' + theme.pages[0];

    if(theme.pages[0] < theme.pages[1]){

      ajax(url, "GET", null).then((r)=>{
        $answer.innerHTML = r.text;
        correctionTime(r.time);

        table = $($answer).find('td[style="color: #990000"]:contains("Автор")').up('table').node();
        tr = table.rows;

        $(table).find('font:contains("~Тема закрыта")').nodeArr().forEach(
          function(node){
            node = $(node).up('tr').node();
            node.parentNode.removeChild(node);
          }
        );

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
        nextPageTheme();
      });
    }else{
      nextTheme();
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function parseRow(tr){
      var table, pid, words, date, carma;
      var character, player, member;
      var g, f;

      f = (resolve) => {
        g = parse();
        g = g.next();

        function* parse(){
          pid = getId();

          character = yield getCharacter.gkWait(g, this, [pid]);
          player = character.p; member = character.m;

          date = getLastDate();
          words = getWords();
          carma = getCarma();

          if(player.name == ""){
            player.name = getName();
            player._ch = true;
          }

          theme.posts[0]++;
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

          $idb.add("players", Pack.player(player));
          $idb.add(`members_${$forum.id}`, Pack.member(member));
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

    function nextTheme(){
      index++;
      $forum.themes[0]++;
      $forum._ch = true;

      $idb.add("forums", Pack.forum($forum));
      $idb.add(`themes_${$forum.id}`, Pack.theme(theme));

      displayProgress('work');
      parseThemes.gkDelay(750, this, [index, max, list]);
    }
    /////////////////////////////

    function nextPageTheme(){
      theme.pages[0]++;
      startPost = 1;
      theme._ch = true;

      $idb.add("forums", Pack.forum($forum));
      $idb.add(`themes_${$forum.id}`, Pack.theme(theme));

      displayProgress.gkDelay(750, this, ['extra', `<br><b>Тема:</b> <i>${theme.name}</i> [${theme.pages[0]}/${theme.pages[1]}]`]);
      parseTheme.gkDelay(750, this, []);
    }
    /////////////////////////////
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
      for(i = 0, length = data.count; i < length; i++) push(players, data.array[i]);
    }else{
      for(i = 0, length = max ? max : players.length; i < length; i++) push(players, i);
    }

    count = list.length;

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
      errorLog('Сбор статуса персонажа', 1, e);
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
      param.mode = $(window).find('select[name="workMode"]').find('option:checked').node().value;
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
  var b1, b2, t;

  t = $t.stats;
  t.setStructure({
    id: [75, "number", "ID"],
    sNumber: [45, "number|boolean", "По составу синдиката|в списке|тех кто в списке"],
    name: [-1, "check", "Имя персонажа"],
    start: [75, "number", "Начато тем"],
    write: [75, "number", "Учавствовал в темах"],
    lastMessage: [95, "date", "Последнее сообщение"],
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

  $('#sf_header_SI').html('@include: ./html/statsTableHeader.html');
  $('#sf_footer_SI').html('@include: ./html/statsTableFooter.html');

  t.setSizes();
  t.setSorts(renderStatsTable);
  t.setFilters(renderStatsTable);

  b1 = $('#sf_bCheckAllMembers').node();
  bindEvent(b1, 'onclick', function(){checkAllMembers(b1, '#sf_content_SI')});

  t = $t.themes;
  t.setStructure({
    id: [75, "number", "ID"],
    name: [-1, "check", "Названии темы"],
    author: [300, "check", "Имени автора"],
    start: [80, "date", "Дате создания"],
    postsDone: [100, "number", "Обработано сообщений"],
    postsAll: [100, "number", "Всего сообщений"],
    pageDone: [100, "number", "Обработано страниц"],
    pageAll: [100, "number", "Всего страниц"],
    check: [45, null, null]
  });

  $('#sf_header_TL').html('@include: ./html/themesTableHeader.html');
  $('#sf_footer_TL').html('@include: ./html/themesTableFooter.html');

  t.setSizes();
  t.setSorts(renderThemesTable);
  t.setFilters(renderThemesTable);

  b2 = $('#sf_bCheckAllThemes').node();
  bindEvent(b2, 'onclick', function(){checkAllMembers(b2, '#sf_content_TL')});

  /////////////////////////////

  function checkAllMembers(button, id){
    var cn = $('#sf_SI_ListChecked');

    if(button.textContent == "[отметить всё]"){
      button.textContent = "[снять всё]";
      if(id == "#sf_content_SI") cn.html($cd.statsCount);
    }else{
      button.textContent = "[отметить всё]";
      if(id == "#sf_content_SI") cn.html(0);
    }

    $(id)
      .find('input[type="checkbox"]')
      .nodeArr()
      .forEach(
        function(box){
          if(button.textContent != "[отметить всё]"){
            doThis(box, "lightChecked", true, $ico.boxOn, true);
          }else{
            doThis(box, "light", false, $ico.boxOff, false);
          }
        }
      );
    /////////////////////////////

    function doThis(box, type, c, img, check){
      $(box).up('tr').node().setAttribute("type", type);
      box.checked = c;
      box.nextElementSibling.style.background = `url("${img}")`;
      if(id == "#sf_content_SI") $checked.players[box.value] = check;
      if(id == "#sf_content_TL") $checked.themes[box.value] = check;
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderStatsTable(sorted){
  var g, table, players, cMembers, members, row;

  cMembers = {};
  table = $t.stats;
  g = render();
  g.next();

  function* render(){

    if(!sorted){
      table.clearContent();

      members = yield $idb.getFew.gkWait(g, $idb, [`members_${$forum.id}`]);
      players = yield $idb.getFew.gkWait(g, $idb, ["players", "{}", `FID_${$forum.id}`]);

      if($forum.sid == null && $idb.exist('members_17930'))
        cMembers = yield $idb.getFew.gkWait(g, $idb, ['members_17930', '{}']);

      members.forEach((member)=>{
        row = Create.characters(member, players[member.id], cMembers[member.id]);
        if(table.filtering(row)) table.pushContent(row);
      });

      table.sorting();
    }
    $cd.statsCount = 0;
    yield showStats.gkWait(g, this, [table]);
    bindCheckingOnRows('#sf_content_SI', table);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderThemesTable(sorted){
  var g, table, themes, row;

  table = $t.themes;
  g = render();
  g.next();

  function* render(){
    if(!sorted){
      table.clearContent();

      themes = yield $idb.getFew.gkWait(g, $idb, [`themes_${$forum.id}`]);

      themes.forEach((theme)=>{
        row = Create.thread(theme);
        if(table.filtering(row)) table.pushContent(row);
      });

      table.sorting();
    }

    $cd.themesCount = 0;
    showThemeList(table);
    bindCheckingOnRows('#sf_content_TL', table);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderTables(){
  renderStatsTable();
  renderThemesTable();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bindCheckingOnRows(id, table){
  $(id)
    .find('tr')
    .nodeArr()
    .forEach(
      function(node){
        bindEvent(node, 'onclick',function(){checkedId(node)});
      }
    );

  function checkedId(node){
    var index = node.rowIndex;

    if(node.getAttribute("type") == "light"){
      node.setAttribute("type", "lightChecked");
    }else{
      node.setAttribute("type", "light");
    }

    node = $(node).find('input[type="checkbox"]').node();
    node.nextSibling.style.background = node.checked ? `url("${$ico.boxOff}")` : `url("${$ico.boxOn}")`;
    node.checked = !node.checked;
    table.setContentValue(index, "checked", node.checked);

    //  changeCount('#sf_SI_ListChecked', node.checked);
  }

  function changeCount(id, state){
    var count, cn;

    cn = $(id);
    count = Number(cn.text());
    cn.html(state ? count + 1 : count - 1);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showStats(t){
  var code, rows, table, html, first = 1, n = 0;
  var i, length;

  table = $('#sf_content_SI');
  rows = t.getContent();
  code = [];
  html = "";

  for(i = 0, length = rows.length; i < length; i++){
    if(!n && i == 80){
      code[n] = html;
      html = "";
      n++;
    }
    //if(i && i % 1000 == 0){
    //  code[n] = html;
    //  html = "";
    //  n++;
    //}
    html += row(rows[i]);
  }
  code[n] = html;


  //getTimeRequest();

  return code.reduce((sequence, c) => {
    return sequence.then(()=>{
      return insert(c);
    });
  }, Promise.resolve()).then(()=>{

    //getTimeRequest(1);

    $cd.statsCount = length;

    $('#sf_SI_ListCount').html($cd.statsCount);
  });

  /////////////////////////////

  function insert(code){
    return new Promise((resolve)=>{
      if(first){
        table.html(code);
        first = 0;
      }else{
        table.html(code, true);
      }
      setTimeout(()=>{
        resolve();
      }, 100);
    })
  }

  /////////////////////////////

  function row(tr){
    var light, check, box;

    if(tr.checked){
      light = "lightChecked";
      check = "checked";
      box = $ico.boxOn;
    }else{
      light = "light";
      check = "";
      box = $ico.boxOff;
    }

    return `<tr height="28" type="${light}">
        <td ${t.getWidth("id")} align="right">${$c.convertID(tr.id)}</td>
        <td ${t.getWidth("sNumber")} align="center">${hz(tr.sNumber)}</td>
        <td ${t.getWidth("name")} style="text-indent: 5px;"><a style="text-decoration: none; font-weight: bold;" target="_blank" href="http://www.ganjawars.ru/info.php?id=${tr.id}">${tr.name}</a></td>
        <td ${t.getWidth("start")} align="center">${hz(tr.start)}</td>
        <td ${t.getWidth("write")} align="center">${hz(tr.write)}</td>
        <td ${t.getWidth("lastMessage")} align="center">${$c.getNormalDate(tr.lastMessage).d}</td>
        <td ${t.getWidth("posts")} align="center">${hz(tr.posts)}</td>
        <td ${t.getWidth("words")} align="center">${hz(tr.words)}</td>
        <td ${t.getWidth("wordsAverage")} align="center">${hz(tr.wordsAverage)}</td>
        <td ${t.getWidth("carma")} align="center">${hz(tr.carma, tr.posts)}</td>
        <td ${t.getWidth("carmaAverage")} align="center">${hz(tr.carmaAverage, tr.posts)}</td>
        <td ${t.getWidth("status")} align="center">${statusMember(tr)}</td>
        <td ${t.getWidth("enter")} align="center">${$c.getNormalDate(tr.enter).d}</td>
        <td ${t.getWidth("exit")} align="center">${$c.getNormalDate(tr.exit).d}</td>
        <td ${t.getWidth("kick")} align="center" title="${$c.getNormalDate(tr.kick).d}">${tr.kick ? '√' : ''}</td>
        <td ${t.getWidth("invite")} align="center" title="${$c.getNormalDate(tr.invite).d}">${tr.invite ? '√' : ''}</td>
        <td ${t.getWidth("bl")} align="center">${tr.bl ? '√' : ''}</td>
        <td ${t.getWidth("check", true)}><input type="checkbox" ${check} name="sf_membersList" value="${tr.id}"/><div style="margin: auto; width: 13px; height: 13px; background: url('${box}')"></div></td>
      </tr>
      `;
  }
  /////////////////////////////

  function hz(value, key){
    if(key){
      if(key == "%"){
        return value == 0 ? "" : value + '<span style="font-size: 9px;"> %</span>';
      }else{
        return key == 0 ? "" : value;
      }
    }else{
      return value == 0 ? "" : value;
    }
  }
  /////////////////////////////

  function statusMember(tr){
    if(tr.status == 0)
      return "";
    if(tr.status == 1)
      //return `<div style="width: 100%; height: 100%; background: url('${$ico.ok}') no-repeat 38px 0; line-height: 28px; text-indent: 25px;">[${$c.getNormalDate(tr.date).d}]</div>`;
      return `В порядке [${$c.getNormalDate(tr.date).d}]`;
    if(tr.date != 0)
      return $date > tr.date ? "?" : `<span style="${$status[tr.status].s}">${$status[tr.status].t}</span> [${$c.getNormalDate(tr.date).d}]`;

    return`<span style="${$status[tr.status].s}">${$status[tr.status].t}</span>`;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showThemeList(t){
  var code, light, check, box;

  code = '';

  t.getContent().forEach(function(tr){
    code += row(tr);
  });

  $('#sf_content_TL').html(code);

  function row(tr){
    if(tr.checked){
      light = "lightChecked";
      check = "checked";
      box = $ico.boxOn;
    }
    else{
      light = "light";
      check = "";
      box = $ico.boxOff;
    }

    return `<tr height="28" type="${light}">
      <td ${t.getWidth("id")} align="right">${$c.convertID(tr.id)} </td>
      <td ${t.getWidth("name")} style="text-indent: 5px;"><a style="text-decoration: none; font-weight: bold;" target="_blank" href="http://www.ganjawars.ru/messages.php?fid=${$forum.id}&tid=${tr.id}">${tr.name}</a></td>
      <td ${t.getWidth("author")} style="text-indent: 5px;" width="250"><a style="text-decoration: none; font-weight: bold;" href="http://www.ganjawars.ru/info.php?id=${tr.author[0]}">${tr.author[1]}</a></td>
      <td ${t.getWidth("start")} align="center">${$c.getNormalDate(tr.start).d}</td>
      <td ${t.getWidth("postsDone")} align="center">${tr.postsDone}</td>
      <td ${t.getWidth("postsAll")} align="center">${tr.postsAll}</td>
      <td ${t.getWidth("pageDone")} align="center">${tr.pageDone}</td>
      <td ${t.getWidth("pageAll")} align="center">${tr.pageAll}</td>
      <td ${t.getWidth("check", true)} align="center"><input type="checkbox" ${check} name="sf_themesList" value="${tr.id}" /><div style="width: 13px; height: 13px; background: url('${box}')"></div></td>
    </tr>
    `;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getCurrentFilters(){
  var list, l, result;

  list = Object.keys($ss.show.stats).reverse();
  l = list.length;
  result = [];

  while(l--){
    if($ss.show.stats[list[l]] != null){
      result.push('[' + $cd.values.stats[list[l]][0] + ']');
    }
  }
  result = result.length ? '<span style="font-weight: bold;">Активные фильтры:</span> ' + result.join(' ') : '';

  $('#sf_currentFilters').html(result);
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