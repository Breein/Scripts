require('./../../../lib/prototypes')();
var $ = require('./../../../lib/dom');
var db = require('./../../../lib/idb');
var bindEvent = require('./../../../lib/events');
var ajax = require('./../../../lib/request');
var createTable = require('./../../../lib/table');


const $c = require('./../../../lib/common')();
const Create = require('./../src/generator')();
const Pack = require('./../src/packer')();
const $ico = require('./../src/icons');


var $nameScript = "Stats forums [GW]";
var $mode = true;
var $sd, $cd, $ss, $tsd, $answer, $screenWidth, $screenHeight, $date, $checked, $t;

var $idb, $forum;

const $statusStyle = {
  "Ok": "",
  "Торговый": "font-weight: bold;",
  "Арестован": "color: blue;",
  "Форумный": "color: red;",
  "Общий бан": "color: green; font-weight: bold;",
  "Заблокирован": "color: red; font-weight: bold;"
};

$checked = {
  themes: {},
  players: {}
};

$screenWidth = document.body.clientWidth;
$screenHeight = document.body.clientHeight;

$answer = $('<span>').node();
$date = parseInt(new Date().getTime() / 1000, 10);

$sd = {
  forums: {},
  players: {},
  kicked: {},
  invite: {}
};

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
  fid: 0,
  fName: "",
  tid: 0,
  tName: "",
  fPage: 27,
  tPage: 0,
  lPage: 0,
  f: null,
  sid: null,
  nameToId: {},
  members: [],
  countMembers: 0,
  values:{
    stats:{
      id: ['ID', -1, -1],
      start: ['Тем начато', -1, -1],
      write: ['Участвовал', -1, -1],
      date: ['Последнее сообщение', -1, -1],
      posts: ['Сообщений', -1, -1],
      averageWords: ['Среднее количество слов', -1, -1],
      words: ['Количество слов', -1, -1],
      pStart: ['Процент начатых тем', -1, -1],
      pWrite: ['Процент участия', -1, -1],
      pPosts: ['Процент сообщений', -1, -1],
      pWords: ['Процент слов', -1, -1],
      status: ['Статус', -1, -1],
      enter: ['Принят', -1, -1],
      exit: ['Покинул', -1, -1],
      goAway: ['Изгнан', -1, -1],
      member: ['В составе', -1, -1]
    },
    themes:{
      id: '',
      date: '',
      posts: '',
      postsAll: ''
    }
  },
  showProgressTime: false,
  timeRequest: 0,
  statsCount: 0,
  themesCount: 0
};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

addStyle();
createStatGUIButton();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addStyle(){
  var css, code;

  code = `table[type="padding"] td {
    padding: 2px 5px 2px 5px;
}
tr[type="light"] {
    background-color: #d8e8d8;
}
tr[type="lightChecked"] {
    background-color: #c7dfc7;
}
tr[type^="light"]:hover {
    background-color: #beccbe;
}
tr[type="header"] {
    background-color: #d0eed0; font-weight: bold;
}
#sf_header_SI img, #sf_header_TL img{
    float: right;
}
td[sort], td[filter]{
    cursor: pointer;
}
td[sort]:hover, td[filter]:hover{
    background-color: #cae1ca;
}
.sf_left {
    padding-left: 5px;
}
#sf_STI {
    padding: 0;
}
#sf_shadowLayer{
    position: absolute;
    width: 0;
    height: 0;
    z-index: 1;
    background-color: #000000;
    left: 0;
    top: 0;
    opacity: 0.7;
    display: none;
    cursor: pointer;
}
div[type="window"]{
    position: absolute;
    -moz-border-radius: 10px;
    border-radius: 10px;
    background-color: #FFFFFF;
    z-index: 2;
    display: none;
}

input[type="button"]{
    font-weight: 500;
    font-family: Verdana;
    background-color: rgb(208,238,208);
    font-size: 10px;
    height: 20px;
}
input[type="text"][class="sf_hideInput"]{
    font-weight: 500;
    font-family: Verdana;
    background-color: #f0fff0;
    font-size: 12px;
    text-align: center;
    width: 50px;
    border-style: none;
}
input[type="checkbox"][name="sf_membersList"],[name="sf_themesList"]{
    display: none;
}
div[class^="sf_count"]{
    border: solid 1px #000000;
    width: 100px;
    line-height: 24px;
    float: left;
    height: 24px;
}
div[class="sf_count disabled"]{
    border: solid 1px #C0c0c0;
    color: #c0c0c0;
}
div[class="sf_space"]{
    border: none;
    width: 15px;
    height: 24px;
    float: left;
}
input[type="text"][class="sf_count disabled"]{
    color: #c0c0c0;
    width: 65px;
    border-style: none;
    background: none;
    padding: 0;
    margin: 0;
}
input[type="text"][class="sf_count enabled"]{
    width: 65px;
    border-style: none;
    background: none;
    padding: 0;
    margin: 0;
}
#sf_calendar{
    left: 0;
    top: 0;
}
#sf_calendar td{
    text-align: center;
    height: 20px;
    border: solid 1px #339933;
    padding: 5px;
}
#sf_calendar td[type="day"]:hover, #sf_calendar td[type="control"]:hover{
    background: #D8E8D8;
    cursor: pointer;
}
span[type="calendarCall"]{
    cursor: pointer;
}
div[type^="multipleSelect"]{
    background: #f0fff0;
    position: absolute;
    height: 24px;
    overflow-y: hidden;
}
div[type="multipleSelect enabled"]:hover{
    position: absolute;
    overflow-y: visible;
    height: 174px;
    border: solid 1px #000000;
    margin-left: -1px;
    margin-top: -1px;
}
div[type^="option"]{
    padding-left: 10px;
    padding-right: 10px;
    text-align: left;
    border-top: dotted 1px #c0c0c0;
}
div[type="option selected"]{
    background: #c3e5c3;
}
div[type^="option"]:hover{
    background: #d9ecd9;
    cursor: pointer;
}
span[id^="sf_bCheckAll"]{
    float: right;
    margin-right: 5px;
    font-size: 9px;
    cursor: pointer;
}`;
  code +=
    `
    td[sort="member"]{
      background-image: url(${$ico.memberIco});
      background-position: 10px center;
      background-repeat:no-repeat;
    }
    #sf_statusWindow{
      left: ${$screenWidth / 2 - 325};
      top: ${$screenHeight / 2 - 120};
    }
    #sf_controlPanelWindow{
        left: ${$screenWidth / 2 - 175};
        top: ${$screenHeight / 2 - 260};
    }
    #sf_filtersWindow{
        left: ${$screenWidth / 2 - 250};
        top: ${$screenHeight / 2 - 363};
    }
    #sf_messageWindow{
        left: ${$screenWidth / 2 - 370};
        top: ${$screenHeight / 2 - 222};
    }`;
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

  button = $('<span>').html(` :: <span id="sf_buttonStats" style="cursor: pointer;">
    Статистика
</span>`).node();
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
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeConnect(name, first){
  var ini;

  ini = [
    {name: "players", key: "id", index: [["name", "a", true]]},
    {name: "forums", key: "id"}
  ];

  if(first){
    db(name).then((db)=>{
      $idb = db;
      $idb.setIniTableList(ini);

      return db;
    }).then(()=>{
      if(first) return $idb.connectDB();
    }).then(()=>{
      console.log("All done 1");
      addToDB();
    });
  }else{
    $idb.connectDB().then(()=>{
      console.log("All done 2");
      addToDB();
    });
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
      {name: `themes_${$cd.fid}`, key: "id"},
      {name: `members_${$cd.fid}`, key: "id"},
      {name: `timestamp_${$cd.fid}`, key: "id"}
    ]);
    $idb.db.close();
    $idb.nextVersion();
    makeConnect("gk_StatsForum", false);
  }else{
    loadFromLocalStorage('settings');

    $t = {
      stats: createTable(["#sf_header_SI", "#sf_content_SI", "#sf_footer_SI"], "stats", $ss),
      themes: createTable(["#sf_header_TL", "#sf_content_TL", "#sf_footer_TL"], "themes", $ss)
    };

    $idb.getOne("forums", "id", $cd.fid).then((res)=>{
      $forum = res;
      $forum = Pack.forum($forum);
      createGUI();
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI(){
  var table, td, gui, calendar;

  table = $('td[style="color: #990000"]:contains("Тема")').up('table').up('table').node();
  td = table.rows[0].cells[0];

  gui = $('<td>').html(`<b><a style="color: #990000" href="http://www.ganjawars.ru/forum.php">Форумы</a> » ${$cd.fName}</b>
:: <span id="sf_gui_settings" style="cursor: pointer; font-weight: bold;">Панель управления</span>
□ <span id="sf_gui_filters" style="cursor: pointer; font-weight: bold;">Фильтры</span>
□ <span id="sf_gui_message" style="cursor: pointer; font-weight: bold;">Рассылка почты</span>
<br>
<table width="97%" cellspacing="0" cellpadding="0" style="border-style: none; border-collapse: collapse;" align="center">
    <tr><td class="sf_left" id="sf_header_SI" valign="top" colspan="2"></td></tr>
    <tr><td class="sf_left" id="sf_content_SI" valign="top" colspan="2"></td></tr>
    <tr><td class="sf_left" id="sf_footer_SI" valign="top" colspan="2"></td></tr>
    <tr><td class="sf_left" align="center" id="sf_header_TL" width="1250"></td><td class="sf_left" valign="top" align="center" id="sf_header_STI"></td></tr>
    <tr><td class="sf_left" align="center" id="sf_content_TL" width="1250"></td><td class="sf_left" valign="top" align="center" id="sf_content_STI" rowspan="2"></td></tr>
    <tr><td class="sf_left" align="center" id="sf_footer_TL"></td></tr>
</table>
<div id="sf_shadowLayer" title="Клик закроет окно"></div>
<div type="window" id="sf_statusWindow">${createStatusWindow()}</div>
<div type="window" id="sf_controlPanelWindow">${createControlPanel()}</div>
<div type="window" id="sf_filtersWindow"></div>
<div type="window" id="sf_messageWindow">${createMessageWindow()}</div>
<div type="window" id="sf_calendar"></div>`).node();

  td.parentNode.removeChild(td);
  table.rows[0].appendChild(gui);

  renderBaseHTML();
  //renderStatsTable();
  //renderThemesTable();
  createShadowLayer();

  bindEvent($('#sf_gui_settings').node(), 'onclick', openControlPanelWindow);
  //bindEvent($('#sf_gui_message').node(), 'onclick', openMessageWindow);
  //bindEvent($('#sf_forgetForum').node(), 'onclick', forgetForum);


  $('#sf_controlPanelWindow')
    .find('input[type="button"]')
    .nodeArr()
    .forEach(
      function(node){
        bindEvent(node, 'onclick', function(){prepareDoTask(node)});
      }
    );

  //bindEvent($('#sf_sendMessages').node(), 'onclick', prepareSendMails);

  calendar = $('span[type="calendarCall"]').node();
  bindEvent(calendar, 'onclick', function(){renderCalendar(calendar)});
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderCalendar(nodeTextDate){
  var size, left, top, calendar, date;

  calendar = $('#sf_calendar').node();

  if(calendar.style.display == "block"){
    calendar.style.display = 'none';
    return;
  }
  if(nodeTextDate.nextElementSibling.disabled){
    return;
  }

  size = nodeTextDate.getBoundingClientRect();
  left = size.left + size.width + 10;
  top = size.top - 5;

  calendar.style.left = left + 'px';
  calendar.style.top = top + 'px';
  calendar.style.display = 'block';

  date = Number(nodeTextDate.nextElementSibling.value);

  createCalendar(date, nodeTextDate);
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
  return `<table width="600" height="50" style="margin: 20px 25px; background-color: #f0fff0" type="padding">
    <tr type="header" height="35">
        <td align="center" style="color: #990000;">Прогресс задачи</td>
    </tr>
    <tr height="15">
        <td></td>
    </tr>
    <tr>
        <td style="padding-left: 30px;">
            <b>Задача:</b> <span id="sf_progressText" style="font-style: italic;"></span> [<span id="sf_progressCurrent"></span>/<span id="sf_progressMax"></span>]
            <span id="sf_progressTextExtra"></span>
        </td>
    </tr>
    <tr>
        <td style="padding-left: 30px;">
            <b>Времени осталось:</b> <span>00:00</span><span style="display: none;" id="sf_progressTime">0</span>
        </td>
    </tr>
    <tr>
        <td style="padding-left: 30px;">
            <div style="width: 510px; height: 10px; border: solid 1px #000000; float: left; margin-top: 8px;">
                <div style="width: 0; height: 100%; background-color: brown;" id="sf_progressBar"></div>
            </div>
            <div style="float: left; width: 5px; height: 25px;"></div>
            <div style="float: left; width: 25px; height: 25px;" id="sf_progressIco"></div>
        </td>
    </tr>
    <tr height="25">
        <td align="right" style="padding: 15px 30px 10px 0;">
            <input type="button" value="Пауза" /> <input type="button" value="Отмена" />
        </td>
    </tr>
    <tr height="5" bgcolor="#d0eed0">
        <td></td>
    </tr>
</table>`;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createControlPanel(){
  var code, disabled;

  disabled = $mode ? '' : 'disabled';
  code = `<table cellspacing="0" width="300" style="border: solid 0 #000000; background-color: #f0fff0; margin: 20px 25px;" type="smallPadding">
    <tr height="30" type="header">
        <td align="center" bgcolor="#d0eed0" colspan="2">Сбор данных о темах</td>
    </tr>
    <tr>
        <td align="right" colspan="2">
            По какое число:
            <span type="calendarCall" style="background-color: #ffffff;">${$c.getNormalDate($date, true).d}</span>
            <input type="text"  name="sf_parseForum" class="sf_hideInput" style="display: none;" value="${$date}" />
            <input type="radio" name="sf_parseForum" value="count" checked />
        </td>
    </tr>
    <tr>
        <td align="right" colspan="2">
            Все страницы форума:
            <input type="radio" name="sf_parseForum" value="all" />
        </td>
    </tr>
    <tr height="30">
        <td align="center" colspan="2"><input type="button" value="Начать" name="sf_parseForum" /></td>
    </tr>

    <tr height="30" type="header">
        <td align="center" bgcolor="#d0eed0" colspan="2">Анализ известных тем</td>
    </tr>
    <tr>
        <td align="right" colspan="2">
            Количество тем:
            <input type="text" name="sf_parseThemes" class="sf_hideInput" value="0" />/ [<span id="sf_countThreads" title="Необработанных тем / Всего тем">[0/0]</span>]
            <input type="radio" name="sf_parseThemes" value="count" checked />
        </td>
    </tr>
    <tr>
        <td align="right" colspan="2">
            Только отмеченные в списке:
            <input type="radio" name="sf_parseThemes" value="select" />
        </td>
    </tr>
    <tr>
        <td align="right" colspan="2">
            Все известные темы:
            <input type="radio" name="sf_parseThemes" value="all" />
        </td>
    </tr>
    <tr height="30">
        <td align="center" colspan="2"><input type="button" value="Начать" name="sf_parseThemes" /></td>
    </tr>

    <tr height="30" type="header">
        <td align="center" bgcolor="#d0eed0" colspan="2">Статус персонажей</td>
    </tr>
    <tr>
        <td align="right" colspan="2">
            Количество персонажей:
            <input type="text" name="sf_parsePlayers" class="sf_hideInput" value="0" />/<span id="sf_countMembers">0</span>
            <input type="radio" name="sf_parsePlayers" ${disabled} value="count" checked />
        </td>
    </tr>
    <tr>
        <td align="right" colspan="2">
            Только отмеченные в списке:
            <input type="radio" name="sf_parsePlayers"  ${disabled} value="select" />
        </td>
    </tr>
    <tr>
        <td align="right" colspan="2">
            Все персонажи:
            <input type="radio" name="sf_parsePlayers" ${disabled} value="all" />
        </td>
    </tr>
    <tr height="30">
        <td align="center" colspan="2"><input type="button" value="Начать" ${disabled} name="sf_parsePlayers" /></td>
    </tr>

    <tr height="30" type="header">
        <td align="center" bgcolor="#d0eed0" colspan="2">Дополнительно</td>
    </tr>
    <tr height="25">
        <td align="right">Состав синдиката:</td>
        <td align="left"><input type="button" value="Обработать" name="sf_memberList" ${disabled} /></td>
    </tr>
    <tr height="25">
        <td align="right">Протокол синдиката:</td>
        <td align="left"><input type="button" value="Обработать" name="sf_sindicateLog" ${disabled} /></td>
    </tr>

    <tr height="40">
        <td colspan="2" style="font-size: 9px;" align="center">
            <span id="sf_forgetForum" style="cursor: pointer;">[забыть этот форум]</span>
        </td>
    </tr>
    <tr height="5" bgcolor="#d0eed0">
        <td colspan="2"></td>
    </tr>
</table>`;

  return code;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createMessageWindow(){
  return `<table width="700" height="395" align="center" style="margin: 20px 25px; background-color: #f0fff0;" type="padding">
    <tr type="header" height="35">
        <td align="center" style="color: #990000;" colspan="3">Рассылка почты</td>
    </tr>
    <tr>
        <td style="padding: 8px 5px 2px 5px;" align="right">Кому:</td>
        <td style="padding: 8px 5px 2px 5px; width: 200px;"><select style="width: 200px;" name="mid"></select></td>
        <td style="padding: 8px 5px 2px 5px; width: 350px;" align="left"> Всего: <span type="count"></td>
    </tr>
    <tr>
        <td align="right">Тема:</td>
        <td style="padding: 2px 5px 8px 5px;" colspan="2"><input type="text" maxlength="50" style="width:100%" value="" name="subject"></td>
    </tr>
    <tr height="30" type="header">
        <td align="center" bgcolor="#d0eed0" colspan="3">Утилиты</td>
    </tr>
    <tr>
        <td align="right" style="padding: 8px 5px 2px 5px;">Режим:</td>
        <td style="padding: 8px 5px 2px 5px; width: 200px;" colspan="2">
            <select style="width: 300px;" name="workMode">
                <option value="mail">Почта</option>
                <option value="invite">Почта и приглашение</option>
                <option value="goAway">Почта и изгнание</option>
            </select>
        </td>
    </tr>
    <tr>
        <td align="right">Синдикат:</td>
        <td style="padding: 2px 5px 8px 5px; width: 200px;" colspan="2"><select style="width: 300px;" name="sid"></select></td>
    </tr>
    <tr height="30" type="header">
        <td align="center" bgcolor="#d0eed0" colspan="3">Сообщение</td>
    </tr>
    <tr>
        <td colspan="3" style="padding: 8px 8px 2px 8px;">
            <textarea style="width:100%" rows="10" name="message"></textarea>
        </td>
    </tr>
    <tr>
        <td align="center" colspan="3" height="35">
            <input type="button" id="sf_sendMessages" value="Запустить">
        </td>
    </tr>
    <tr height="5" bgcolor="#d0eed0">
        <td colspan="3"></td>
    </tr>
</table>`;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createCalendar(cDate, nodeTextDate){
  var months, days, date, year, month, day, code, row, coll, dayNumber, firstDayWeek, exit, tMonth, tDay, color;

  months  = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентрябрь','Октябрь','Ноябрь','Декабрь'];
  days    = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  exit    = false;

  date = cDate == null ? $date : cDate;
  date = $c.getNormalDate(date, true);
  date = date.d.split('.');

  day = Number(date[0]);
  tMonth = date[1];
  month = Number(date[1]);
  year = Number(date[2]);

  if(year % 4 == 0) days[1] = 29;

  code =
    `<table class="wb" style="margin: 20px 25px;">
                <tr type="header">
                    <td type="control">«</td>
                    <td type="control" title="Выбрать год" colspan="5">${months[month-1]} ${year}</td>
                    <td type="control">»</td>
                </tr>
                <tr type="header">
                    <td>П</td>
                    <td>В</td>
                    <td>С</td>
                    <td>Ч</td>
                    <td>П</td>
                    <td>С</td>
                    <td>В</td>
                </tr>`;

  dayNumber = 1;
  firstDayWeek = Date.parse(`${month}/1/${year}`);
  firstDayWeek = new Date(firstDayWeek).getDay(); firstDayWeek--;
  if(firstDayWeek == -1) firstDayWeek = 6;

  for(row = 0; row < 6; row++){
    if(exit) break;
    code += `<tr>`;
    for(coll = 0; coll < 7; coll++){
      if(row == 0 && coll < firstDayWeek){
        code += `<td colspan="${firstDayWeek}"></td>`;
        coll = firstDayWeek;
      }
      if(dayNumber <= days[month-1]){
        if(dayNumber == days[month-1] && coll == 6) exit = true;
        tDay = dayNumber < 10 ? '0' + dayNumber : dayNumber;
        color = dayNumber == day ? 'style="background-color: #d0eed0;"' : '';
        code += `<td type="day" ${color} name="${tDay}.${tMonth}.${year}" title="${tMonth}/${tDay}/${year} 00:00">${dayNumber}</td>`;
        dayNumber++;
      }else{
        code += `<td colspan="${7-coll}"></td>`;
        exit = true;
        break;
      }
    }
    code += `</tr>`;
  }

  code +=
    `<tr type="header">
                <td colspan="7">${$c.getNormalDate($date, true).d}</td>
             </tr>
        </table>`;

  /////////////////////////////

  $('#sf_calendar')
    .html(code)
    .find('td[type="control"],[type="day"]')
    .nodeArr()
    .forEach(
      function(button){
        if(button.getAttribute("type") == "control"){
          if(button.title == "Выбрать год"){
            bindEvent(button, 'onclick', function(){setYear(month, year)});
          }else {
            bindEvent(button, 'onclick', function(){moveMonth(button, month, year)});
          }
        }else{
          bindEvent(button, 'onclick', function(){calendarSetDate(button, nodeTextDate)});
        }
      }
    );
  /////////////////////////////

  function moveMonth(button, month, year){
    if(button.textContent == "«"){
      month--;
      if(month == 0){
        year--;
        month = 12;
      }
    }else{
      month++;
      if(month == 13){
        year++;
        month = 1;
      }
    }
    month = month < 10 ? '0' + month : month;

    createCalendar(Date.parse(`${month}/01/${year}`) / 1000, nodeTextDate);
  }
  /////////////////////////////

  function setYear(month, year){
    var nYear;

    nYear = prompt("Введите поный год");

    if(nYear == ""){
      nYear = 1970;
      month = "01";
    }else{
      nYear = parseInt(nYear, 10);
      if(isNaN(nYear)) nYear = year;
    }
    console.log(nYear);

    createCalendar(Date.parse(`${month}/01/${nYear}`) / 1000, nodeTextDate);
  }
  /////////////////////////////

  function calendarSetDate(button, nodeTextDate){
    nodeTextDate.nextElementSibling.value = Date.parse(button.title) / 1000;
    $(nodeTextDate).html(button.getAttribute('name'));
    $("#sf_calendar").node().style.display = "none";
  }
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
        displayProgress('start', `Обработка тем`, 0, p.count);
        prepareParseThemes(p.count);
        break;

      case 'select':
        l = getList('sf_themesList');
        displayProgress('start', `Обработка тем`, 0, l.count);
        displayProgressTime(l.c);
        parseThemes(0, l.count, l.array);
        break;

      case 'all':
        displayProgress('start', `Обработка тем`, 0, $cd.f.threads.new);
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
        displayProgress('start', `Обработка персонажей`, 0, p.count);
        prepareParseMembers(p.count);
        break;

      case 'select':
        l = getList('sf_membersList');
        displayProgress('start', `Обработка персонажей`, 0, l.count);
        displayProgressTime(l.c);
        parseMembers(0, l.count, l.array);
        break;

      case 'all':
        displayProgress('start', `Обработка персонажей`, 0, $cd.countMembers);
        prepareParseMembers();
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
    var list = [], count = 0, id;

    $(`input[type="checkbox"][name="${name}"]:checked`).nodeArr().forEach(
      function(node){
        id = Number(node.value);
        if(name == "sf_themesList" && $cd.f.themes[id].posts[0] != $cd.f.themes[id].posts[1]){
          list.push(node.value);
          count += calculateThemePages(id).count;
        }else{
          list.push(id);
          count++;
        }
      }
    );

    if(name == "sf_themesList"){
      count = list.length * 750 + count * 1250 + 500;
    }else{
      count =  count * 1250;
    }

    return {array: list, count: list.length, c: count};
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function forgetForum(){
  var id;

  if(confirm('Вы уврены что хотите удалить все данные об этом форуме?')){
    delete $sd.forums[$cd.fid];
    for (id in $sd.players) {
      if ($sd.players[id].forums[$cd.fid]) {
        delete $sd.players[id].forums[$cd.fid];
      }
    }
    for (id in $sd.kicked){
      delete $sd.kicked[$cd.fid];
    }
    saveToLocalStorage('data');
    location.reload();
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
  $("#sf_controlPanelWindow").node().style.display = "none";
  $("#sf_filtersWindow").node().style.display = "none";
  $("#sf_messageWindow").node().style.display = "none";

  $("#sf_statusWindow").node().style.display = "block";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openControlPanelWindow(){
  $("#sf_shadowLayer").node().style.display = "block";

  $("#sf_countThreads").html($forum.themes[0] + '/' + $forum.themes[1]);
  //$("#sf_countMembers").html($cd.countMembers);
  $("#sf_controlPanelWindow").node().style.display = "block";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openFiltersWindow(){
  $("#sf_shadowLayer").node().style.display = "block";
  $("#sf_filtersWindow").node().style.display = "block";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openMessageWindow(){
  var window, n;

  $("#sf_shadowLayer").node().style.display = "block";
  window = $("#sf_messageWindow").node();
  n = 0;

  $(window).find('select[name="mid"]').html(createSelectList());
  $(window).find('select[name="sid"]').html(createSelectSID());
  $(window).find('span[type="count"]').html(n);

  window.style.display = "block";
  /////////////////////////////

  function createSelectSID(){
    var code, list, sid;

    code = '<option value="0">Выберите...</option>';
    list = $mode ? $sd.forums : $tsd.forums;

    Object.keys(list).forEach(
      function(id){
        sid = id.substring(1, id.length);
        code += `<option value="${sid}">[#${sid}] ${list[id].name}</option>`;
      }
    );

    return code;
  }
  /////////////////////////////

  function createSelectList(){
    var code;

    code = '<option>Посмотреть список...</option>';

    $('#sf_content_SI').find('input[type="checkbox"][name="sf_membersList"]:checked')
      .nodeArr()
      .forEach(
        function(box){
          n++;
          code += `<option value="${$sd.players[box.value].name}|${box.value}">${n}. ${$sd.players[box.value].name}</option>`;
        }
      );

    return code;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function closeWindows(){
  var status = $("#sf_progressIco").text();
  var window = $("#sf_statusWindow").node();

  if(window.style.display == "block" && status != "Завершено!") return;

  $("#sf_shadowLayer").node().style.display = "none";

  $("#sf_controlPanelWindow").node().style.display = "none";
  $("#sf_filtersWindow").node().style.display = "none";
  $("#sf_messageWindow").node().style.display = "none";
  $("#sf_calendar").node().style.display = "none";
  window.style.display = "none";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMembersList(){
  var url;

  if($cd.sid){
    url = `http://www.ganjawars.ru/syndicate.php?id=${$cd.sid}&page=members`;
    displayProgress('start', 'Сбор и обработка информации о составе синдиката', 0, 1);

    try{
      REQ(url, 'GET', null, true,
        function (req){
          $answer.innerHTML = req.responseText;
          parse();
          saveToLocalStorage('data');
          renderStatsTable();
          displayProgress('done');
        },
        function (){
          errorLog("Сбор информации о составе синдиката", 0, 0);
        }
      );
    }catch (e){
      errorLog("сборе информации о составе синдиката", 1, e);
    }
  }
  /////////////////////////////

  function parse(){
    var list, id, name, sn, pf;

    list = $($answer).find('b:contains("Состав синдиката")').up('table').find('a[href*="info.php"]').nodeArr();

    Object.keys($sd.players).forEach(function(id){
      pf = $sd.players[id].forums[$cd.fid];
      if(pf != null){
        pf.member = false;
        pf.sn = 0;
      }
    });

    list.forEach(function(node){
      id = Number(node.href.match(/(\d+)/)[1]);
      name = node.textContent;
      sn = $(node).up('tr').node().cells[0].textContent;
      sn = parseInt(sn, 10);

      if($sd.players[id] == null){
        $sd.players[id] = generatePlayer(name);
      }

      if($sd.players[id].forums[$cd.fid] == null){
        $sd.players[id].forums[$cd.fid] = generateForumPlayer();
      }

      $sd.players[id].forums[$cd.fid].member = true;
      $sd.players[id].forums[$cd.fid].sn = sn;
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMaxPageSindicateLog(){
  var url, page;

  url = `http://www.ganjawars.ru/syndicate.log.php?id=${$cd.sid}&page_id=10000000`;

  try{
    REQ(url, 'GET', null, true,
      function (req){
        $answer.innerHTML = req.responseText;
        $cd.lPage = parse();
        page = $cd.lPage - $cd.f.log;

        displayProgress('start', `Обработка протокола синдиката #${$cd.fid} «${$sd.forums[$cd.fid].name}»`, 0, page + 1);
        displayProgressTime((page + 1) * 1250);
        parseSindicateLog.gkDelay(750, this, [page]);
      },
      function (){
        errorLog("Сбор информации о максимальной странцие протокола синдиката", 0, 0);
      }
    );
  }catch (e){
    errorLog("сборе информации о максимальной странцие протокола синдиката", 1, e);
  }
  /////////////////////////////

  function parse(){
    var page;

    page = $($answer).find(`b:contains("~Протокол синдиката #${$cd.sid}")`).up('div').next('center').find('a');
    page = page.node(-1).href.split('page_id=')[1];

    return Number(page);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseSindicateLog(index){
  var url;

  if(index != -1){
    url = `http://www.ganjawars.ru/syndicate.log.php?id=${$cd.sid}&page_id=${index}`;

    try{
      REQ(url, 'GET', null, true,
        function (req){
          displayProgress('work');
          $answer.innerHTML = req.responseText;
          $($answer)
            .find('font[color="green"]')
            .nodeArr()
            .reverse()
            .forEach(parse);
          index--;

          if($cd.lPage != $cd.f.log) $cd.f.log++;

          correctionTime();
          saveToLocalStorage('data');
          parseSindicateLog.gkDelay(750, this, [index]);
        },
        function (){
          errorLog("Сбор информации с протокола синдиката", 0, 0);
        }
      );
    }catch (e){
      errorLog("сборе информации с протокола синдиката", 1, e);
    }
  }else{
    renderStatsTable();
    displayProgress('done');
  }
  /////////////////////////////

  function parse(node){
    var next, id, date, name;

    node = node.parentNode;
    date = node.textContent.match(/(\d)(\d).(\d)(\d).(\d)(\d) (\d)(\d):(\d)(\d)/);

    if(date){
      next = $(node).next('nobr').node();

      if(next.textContent.match(/принят в синдикат/)){
        setDate('enter');
        return;
      }
      if(next.textContent.match(/вышел из синдиката/)){
        setDate('exit');
        return;
      }
      if(next.textContent.match(/покинул синдикат/)){
        setDate('exit');
      }
      if(next.textContent.match(/пригласил в синдикат/)){
        setInvite();
      }
    }
    /////////////////////////////

    function setDate(key){
      var extra;

      id = $(next).find('a[href*="info.php"]');
      name = id.text();
      date = `${date[3]}${date[4]}/${date[1]}${date[2]}/20${date[5]}${date[6]} ${date[7]}${date[8]}:${date[9]}${date[10]}`;
      date = Date.parse(date) / 1000;

      if(id.length != 0){
        id = id.node().href;
        id = Number(id.match(/(\d+)/)[1]);
      }else{
        name = next.textContent.match(/(.+) покинул синдикат \((.+)\)/)[1];
        id = $cd.nameToId[name];
        extra = true;
      }

      if(id != null){
        if($sd.players[id] == null) $sd.players[id] = generatePlayer(name);
        if($sd.players[id].forums[$cd.fid] == null) $sd.players[id].forums[$cd.fid] = generateForumPlayer();

        $sd.players[id].forums[$cd.fid].goAway = extra ? 1 : 0;
        $sd.players[id].forums[$cd.fid][key] = date;
      }else if(name != null){
        if($sd.kicked[$cd.fid] == null) $sd.kicked[$cd.fid] = {};
        $sd.kicked[$cd.fid][name] = date;
      }
    }
    /////////////////////////////

    function setInvite(){
      var name, id;
      name = next.textContent.match(/(.+) пригласил в синдикат (.+)/)[2];
      id = $cd.nameToId[name];

      if(id != null){
        if ($sd.players[id] == null) $sd.players[id] = generatePlayer(name);
        if ($sd.players[id].forums[$cd.fid] == null) $sd.players[id].forums[$cd.fid] = generateForumPlayer();

        $sd.players[id].forums[$cd.fid].invite = 1;
      }else if(name != null){
        if($sd.invite == null) $sd.invite = {};
        if($sd.invite[$cd.fid] == null) $sd.invite[$cd.fid] = {};
        $sd.invite[$cd.fid][name] = 1;
      }
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMaxPageForum(){
  var url, page;

  url = "http://www.ganjawars.ru/threads.php?fid=" + $forum.id + "&page_id=10000000";

  ajax(url, "GET", null).then((res)=>{
    $answer.innerHTML = res;

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

  if(index != -1) {

    ajax(url, "GET", null).then((res)=>{
      $answer.innerHTML = res;

      displayProgress('work');

      $($answer)
        .find('td[style="color: #990000"]:contains("Тема")')
        .up('table')
        .find('tr[bgcolor="#e0eee0"],[bgcolor="#d0f5d0"]')
        .nodeArr()
        .reduce(function(sequence, tr) {
          return sequence.then(function() {
            return parse(tr);
          });
        }, Promise.resolve())
        .then(()=>{

          index = mode ? index - 1 : index + 1;
          if(mode && $forum.page[0] != $forum.page[1]) $forum.page[0]++;

          console.log("Done");
        });


        //.forEach((tr) => {
        //  sequence = sequence.then((r) => {
        //    console.log("Res: " + r);
        //    return parse(tr);
        //  }).then(() =>{
        //
        //    index = $forum.sid ? index - 1 : index + 1;
        //    if($forum.sid && $forum.page[0] != $forum.page[1]) $forum.page[0]++;
        //
        //    console.log("All done");
        //  });
        //});
    });





    //correctionTime();
    //calcNewThemes();
    //saveToLocalStorage('data');



    //parseForum.gkDelay(750, this, [index, mode, stopDate]);

    //try{
    //  REQ(url, 'GET', null, true,
    //    function(req){
    //      displayProgress('work');
    //
    //      $answer.innerHTML = req.responseText;
    //      $($answer)
    //        .find('td[style="color: #990000"]:contains("Тема")')
    //        .up('table')
    //        .find('tr[bgcolor="#e0eee0"],[bgcolor="#d0f5d0"]')
    //        .nodeArr()
    //        .forEach(parse);
    //
    //      index = mode ? index - 1 : index + 1;
    //      if(mode && $cd.fPage != $cd.f.page) $cd.f.page++;
    //
    //      correctionTime();
    //      calcNewThemes();
    //      saveToLocalStorage('data');
    //      parseForum.gkDelay(750, this, [index, mode, stopDate]);
    //    },
    //    function(){
    //      errorLog("Сбор информации о темах", 0, 0);
    //    }
    //  );
    //}catch(e){
    //  errorLog("сборе информации о темах", 1, e);
    //}
  }else{
    //saveToLocalStorage('data');
    //renderTables();
    displayProgress('done');

  }
  /////////////////////////////

  function parse(tr){
    var td, tid, theme, player, member;

    td = tr.cells;
    tid = getId();

    //date = getDate();


    return $idb.getOne(`themes_${$forum.id}`, "id", tid).then((res)=>{
      theme = Pack.theme(res);

      if(theme == null){
        $forum.themes[1]++;
        $idb.add(`forums`, Pack.forum($forum));

        theme = Create.theme(tid);
        theme.name = getName();
        theme.author = getAuthor();
        theme.posts = getPosts();
        theme.pages = getPages();
        theme.start = getDate();
      }else{
        theme.posts = getPosts();
        theme.pages = getPages();
      }
      $idb.add(`themes_${$forum.id}`, Pack.theme(theme));

      return $idb.getOne(`players`, "id", theme.author[0]);
    }).then((res)=>{
      player = Pack.player(res);

      if(player == null){
        player = Create.player(theme.author[0]);
        player.name = theme.author[1];
        player.forums.push($forum.id);

        member = Create.member(theme.author[0]);
        member.start.push(theme.id);

        return null;
      }else{
        if(!$c.exist($forum.id, player.forums)) player.forums.push($forum.id);

        return $idb.getOne(`members_${$forum.id}`, "id", player.id);
      }
    }).then((res)=>{
      if(res){
        member = Pack.member(res);

        if(!$c.exist(theme.id, member.start)) member.start.push(theme.id);
      }

      $idb.add(`players`, Pack.player(player));
      $idb.add(`members_${$forum.id}`, Pack.member(member));
    });



    //if(mode){
    //  addTheme();
    //}else{
    //  if(stopDate != null && stopDate < date){
    //    addTheme();
    //  }else{
    //    count++;
    //    if(count == 5){
    //      index = -2;
    //    }
    //  }
    //}


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
        parseInt(theme.posts[1] / 20, 10)
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

  function calcNewThemes(){
    var themes;

    themes = $cd.f.themes;
    $cd.f.threads.new = $cd.f.threads.all;

    Object.keys(themes).forEach(function(tid){
      if(themes[tid].posts[0] == themes[tid].posts[1]){
        $cd.f.threads.new--;
      }
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareParseThemes(max){
  var themes, tid, list, count;

  themes = $cd.f.themes;
  list = [];
  count = 0;

  for(tid in themes){
    if(themes[tid].posts[0] != themes[tid].posts[1]){
      list.push(tid);
      count += calculateThemePages(Number(tid)).count;
      if(list.length == max) break;
    }
  }
  count = list.length * 750 + count * 1250 + 500;
  displayProgressTime(count);
  parseThemes(0, list.length, list);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculateThemePages(id){
  var theme, pages, sPage, start;

  theme = $cd.f.themes[id];

  pages = theme.posts[1] / 20;
  pages = pages < 1 ? 0 : parseInt(pages, 10);

  sPage = theme.posts[0] / 20;
  sPage = sPage < 1 ? 0 : parseInt(sPage, 10);

  start = (theme.posts[0] % 20) + 1;

  return {id: sPage , count: pages + 1, start: start};
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseThemes(index, max, list){
  var info, theme;

  $cd.tid = Number(list[index]);
  theme = $cd.f.themes[$cd.tid];

  if(index < max){
    info = calculateThemePages($cd.tid);
    parseTheme(info.id, info.count, info.start);
  }else{
    saveToLocalStorage('data');
    renderTables();
    displayProgress('done');
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function parseTheme(id, count, start){
    var url;

    $cd.tPage = id;
    url = 'http://www.ganjawars.ru/messages.php?fid=' + $cd.fid + '&tid='+ $cd.tid +'&page_id=' + $cd.tPage;

    if(id < count){
      try{
        REQ(url, 'GET', null, true,
          function (req){
            $answer.innerHTML = req.responseText;
            parse();
            correctionTime();
          },
          function (){
            errorLog('Сбор информации о сообщениях', 0, 0);
            nextPageTheme();
          }
        );
      }catch (e){
        errorLog('сборе информации о сообщениях', 1, e);
        nextPageTheme();
      }
    }else{
      nextTheme();
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function parse(){
      var table, tr, pid, player, pf, w;
      var i, length;

      table = $($answer).find('td[style="color: #990000"]:contains("Автор")').up('table').node();

      $(table).find('font:contains("~Тема закрыта")').nodeArr().forEach(
        function(node){
          node = $(node).up('tr').node();
          node.parentNode.removeChild(node);
        }
      );
      tr = table.rows;
      length = tr.length;

      for(i = start; i < length; i++){
        pid = getId();

        if($sd.players[pid] == null){
          $sd.players[pid] = generatePlayer(getName());
        }
        player = $sd.players[pid];

        if(player.forums[$cd.fid] == null){
          player.forums[$cd.fid] = generateForumPlayer();
        }
        pf = player.forums[$cd.fid];

        theme.posts[0]++;
        $cd.f.posts++;

        pf.posts++;
        pf.last = getLastDate();

        w = getWords();
        $cd.f.words += w;
        pf.words[0] += w;
        pf.words[1] = parseInt(pf.words[0] / pf.posts, 10);

        if(!pf.themes.gkExist($cd.tid)){
          pf.themes.push($cd.tid);
        }
      }

      nextPageTheme();
      /////////////////////////////

      function getId(){
        var id;

        id = $(tr[i].cells[0]).find('a[href*="info.php"]').node();
        id = id.href.match(/(\d+)/)[1];
        id = Number(id);

        return id;
      }
      /////////////////////////////

      function getName(){
        return $(tr[i].cells[0]).find('a[href*="info.php"]').text();
      }
      /////////////////////////////

      function getLastDate(){
        var date;

        date = $(tr[i].cells[1]).find('td[align="left"]:contains("~написано")').text();

        date = date.match(/(.+): (\d+)-(\d+)-(\d+) (.+) /);
        date = `${date[3]}/${date[4]}/${date[2]} ${date[5]}`;
        date = Date.parse(date) / 1000;

        return date > pf.last ? date : pf.last;
      }

      function getWords(){
        var words;

        words = $(tr[i].cells[1]).find('table[cellpadding="5"]').text();
        words = (words.replace(/\s['";:,.?¿\-!¡]/g, '').match(/\s+/g) || []).length + 1;

        return words;
      }
    }
    /////////////////////////////

    function nextTheme(){
      index++;
      $cd.f.threads.new--;
      displayProgress('work');
      saveToLocalStorage('data');
      parseThemes.gkDelay(750, this, [index, max, list]);
    }
    /////////////////////////////

    function nextPageTheme(){
      id++;
      displayProgress.gkDelay(750, this, ['extra', `<br><b>Тема:</b> <i>${$cd.f.themes[$cd.tid].name}</i> [${id}/${count}]`]);
      parseTheme.gkDelay(750, this, [id, count, 1]);
    }
    /////////////////////////////
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareParseMembers(count){
  var length, player, list;

  length = count != null ? count : $cd.countMembers;
  list = [];

  while(length--){
    player = $sd.players[$cd.members[length]];
    if(count == null){
      list.push($cd.members[length]);
    }else{
      if(player.status.text == ''){
        list.push($cd.members[length]);
      }
    }
  }
  count = list.length * 750 + 500;
  displayProgressTime(count);

  parseMembers(0, list.length, list);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseMembers(id, count, list){
  var url, player;

  if(id < count){
    player = $sd.players[list[id]];
    url = `http://www.ganjawars.ru/info.php?id=${list[id]}`;
    try{
      REQ(url, 'GET', null, true,
        function (req){
          $answer.innerHTML = req.responseText;
          parse();
          saveToLocalStorage('data');
          correctionTime();
          nextMember();
        },
        function (){
          errorLog('Сбор статуса персонажа', 0, 0);
          nextMember();
        }
      );
    }catch (e){
      errorLog('сборе статуса персонажа', 1, e);
    }
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

  function parse(){
    var block, arrest, banDefault, banCommon, banTrade, status, date;

    status = 'Ok';
    date = parseInt(new Date().getTime() / 1000, 10);

    block = $($answer).find('font[color="red"]:contains("Персонаж заблокирован")');
    arrest = $($answer).find('center:contains("Персонаж арестован, информация скрыта")').find('font[color="#000099"]');
    banDefault = $($answer).find('font[color="red"]:contains("~временно забанен в форуме модератором")');
    banCommon = $($answer).find('center:contains("~Персонаж под общим баном")').find('font[color="#009900"]');
    banTrade = $($answer).find('font[color="red"]:contains("~забанен в торговых форумах")');

    if(banTrade.length){
      date = getDate(banTrade.text());
      status = 'Торговый';
    }
    if(arrest.length){
      date = 0;
      status = 'Арестован';
    }
    if(banDefault.length){
      date = getDate(banDefault.text());
      status = 'Форумный';
    }
    if(banCommon.length){
      date = getDate(banCommon.text());
      status = 'Общий бан';
    }
    if(block.length){
      date = 0;
      status = 'Заблокирован';
    }

    player.status.text = status;
    player.status.date = date;
  }
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
  var param, window, count, mode, tm, sid;
  var queue, f, invites = {};

  param = {
    list: [],
    awayList: {},
    lopata: '',
    out: 0,
    subject: '',
    message: '',
    sid: 0,
    mode: ''
  };

  tm = {
    mail: "Отправка почты",
    invite: "Отправка почты и приглашений",
    goAway: "Отправка почты и изгнание"
  };

  queue = ["getLopata", "stop"];
  f = {
    getInvitesId: function(){getInvitesId()},
    getGoAwayId: function(){getGoAwayId()},
    getLopata: function(){getLopata()},
    stop: function(){stop()}
  };


  window = $("#sf_messageWindow").node();
  param.subject = encodeURIComponent($(window).find('input[type="text"][name="subject"]').node().value);
  param.message = encodeURIComponent($(window).find('textarea[name="message"]').node().value);
  param.mode = $(window).find('select[name="workMode"]').find('option:checked').node().value;
  sid = $(window).find('select[name="sid"]').find('option:checked').node();
  param.sid = Number(sid.value); sid = sid.textContent;

  if(param.mode != "mail"){
    if(param.sid == 0){
      alert("Не выбран синдикат!");
      return;
    }
    if(param.mode == "invite") queue.unshift("getInvitesId");
    if(param.mode == "goAway") queue.unshift("getGoAwayId");
  }

  if(param.mode == "mail"){
    if(!confirm(`Режим: ${tm[param.mode]}\n\n Все правильно?`)) return;
  }else{
    if(!confirm(`Режим:       ${tm[param.mode]}\nСиндикат:  ${sid}\n\n Все правильно?`)) return;
  }

  next(0);
  /////////////////////////////

  function stop(){
    $(window).find('select')
      .find('option[value]')
      .nodeArr()
      .forEach(getList);

    count = param.list.length;

    openStatusWindow();
    displayProgress('start', 'Рассылка сообщений выбранным игрокам', 0, count);
    displayProgressTime((count * 39500) + 500);
    doActions(0, count, param);
  }

  /////////////////////////////

  function getList(option){
    var name, id;

    id = option.value.split("|");
    name = id[0];
    id = id[1];

    if(invites[name] == null){
      param.list.push({
        id: id,
        name: name,
        encode: encodeURIComponent(name)
      });
    }
  }
  /////////////////////////////

  function getLopata(){
    try{
      REQ('http://www.ganjawars.ru/sms-create.php', 'GET', null, true,
        function (req){
          $answer.innerHTML = req.responseText;
          param.out = Number($($answer).find('input[type="hidden"][name="outmail"]').node().value);
          param.lopata = $($answer).find('input[type="hidden"][name="lopata"]').node().value;

          next();
        },
        function (){
          errorLog('Получении лопаты', 0, 0);
        }
      );
    }catch(e){
      errorLog('получении лопаты', 1, e);
    }
  }
  /////////////////////////////

  function getGoAwayId (){
    try{
      REQ('http://www.ganjawars.ru/syndicate.edit.php?key=users&id=' + param.sid, 'GET', null, true,
        function (req){
          $answer.innerHTML = req.responseText;
          param.awayList = {};

          $($answer)
            .find('select[name="cid"]')
            .find("option")
            .nodeArr()
            .forEach(parse);

          next();
        },
        function (){
          errorLog(`Получении списка id на изгнание персонажей`, 0, 0);
        }
      );
    }catch (e){
      errorLog(`получении списка id на изгнание персонажей`, 1, e);
    }
    /////////////////////////////

    function parse(option){
      var id, name;

      id = Number(option.value);
      name = option.textContent;
      name = name.match(/(\d+)\. (.+) \/ \$(\d+)/);
      name = name[2];

      param.awayList[name] = id;
    }
  }
  /////////////////////////////

  function getInvitesId(){
    try{
      REQ('http://www.ganjawars.ru/syndicate.edit.php?key=invites&id=' + param.sid, 'GET', null, true,
        function (req){
          $answer.innerHTML = req.responseText;
          param.awayList = {};

          $($answer)
            .find('b:contains("Приглашенные персоны:")')
            .up('td')
            .find('a[href*="info.php"]')
            .nodeArr()
            .forEach(parse);

          next();
        },
        function (){
          errorLog(`Получении списка id на изгнание персонажей`, 0, 0);
        }
      );
    }catch (e){
      errorLog(`получении списка id на изгнание персонажей`, 1, e);
    }

    function parse(node){
      invites[node.textContent] = node.href.split('=')[1];
    }
  }
  /////////////////////////////

  function next(type){
    if(type != null){
      f[queue.shift()]();
      return;
    }

    f[queue.shift()].gkDelay(750, this, []);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doActions(index, count, param){
  if(index < count){
    if(param.mode == "invite"){
      sendInvite(index, param);
    }
    if(param.mode == "goAway"){
      if(param.awayList[param.list[index].name] != null) doGoAway(param.sid, param.awayList[param.list[index].name]);
    }

    sendMail.gkDelay(1250, this, [index, param]);

    param.out++;
    index++;

    displayProgress('work');
    doActions.gkDelay(random(360, 380) * 100, this, [index, count, param]);
  }else{
    displayProgress('done');
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendMail(index, param){
  var data;

  data = `postform=1&outmail=${param.out}&lopata=${param.lopata}&mailto=${param.list[index].encode}&subject=${param.subject}&msg=${param.message}`;

  try{
    REQ('http://www.ganjawars.ru/sms-create.php', 'POST', data, true,
      function (){
        correctionTime();
      },
      function (){
        errorLog(`Отправке письма ${param.list[index].name}`, 0, 0);
      }
    );
  }catch (e){
    errorLog(`отправке письма ${param.list[index].name}`, 1, e);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendInvite(index, param){
  var data, invite;

  data = `key=invites&id=${param.sid}&invite=${param.list[index].encode}`;
  invite = $mode ? $sd : $tsd;
  invite = invite.players[param.list[index].id].forums[("1" + param.sid)].invite;

  try{
    REQ('http://www.ganjawars.ru/syndicate.edit.php', 'POST', data, true,
      function (){
        correctionTime();
        invite = 1;        //// Пееределать
        saveToLocalStorage('data');
      },
      function (){
        errorLog(`Отправке приглашения ${param.list[index].name}`, 0, 0);
      }
    );
  }catch (e){
    errorLog(`отправке приглашения ${param.list[index].name}`, 1, e);
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doGoAway(sid, id){
  var data = `id=${sid}&key=users&remove=${id}`;

  try{
    REQ('http://www.ganjawars.ru/syndicate.edit.php', 'POST', data, true,
      function (){
        correctionTime();
      },
      function (){
        errorLog(`Изгнанние ${id}`, 0, 0);
      }
    );
  }catch (e){
    errorLog(`изгнании ${id}`, 1, e);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//function generatePlayer(name){
//  return {
//    name: name,
//    status: {
//      text: '',
//      date: 0
//    },
//    forums:{}
//  };
//}
//
//function generateForumPlayer(){
//  return {
//    sn: 0,
//    enter: 0,
//    exit: 0,
//    goAway: 0,
//    invite: 0,
//    member: false,
//    posts: 0,
//    last: 0,
//    words: [0, 0],
//    start: [],
//    themes: []
//  };
//}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderBaseHTML(){
  var header, footer, b1, b2, width;

  $t.stats.setWidth([65, 45, -1, 40, 75, 75, 95, 80, 75, 75, 75, 75, 172, 80, 80, 50, 75, 95, 45]);

  $t.stats.setStructure([
    ["paths", "$sd.players[id]", "$sd.players[id].forums[$cd.fid]", "$checked.players[id]", "getPercent($sd.players[id].forums[$cd.fid]"],
    ["id", 0, "Number(id)", "number", "ID"],
    ["sNumber", 2, ".sn", "number", "Номер в списке синдиката"],
    ["name", 1, ".name", "check", "Имя"],
    ["member", 2, ".member", "boolean", "В составе"],
    ["status", 1, ".status", "multiple", "Статус"],
    ["enter", 2, ".enter", "date", "Принят"],
    ["exit", 2, ".exit", "date", "Покинул"],
    ["invite", 2, ".invite", "date", "Приглашен"],
    ["checked", 3, "", null, null],
    ["startThemes", 2, ".start.length", "number", "Начато тем"],
    ["writeThemes", 2, ".themes.length", "number", "Учавствовал в темах"],
    ["lastMessage", 2, ".last", "date", "Последнее сообщение"],
    ["posts", 2, ".posts", "number", "Всего сообщений"],
    ["percentStartThemes", 4, ".start.length, $cd.f.threads.all, false);", "number", "Процент начатых тем"],
    ["percentWriteThemes", 4, ".themes.length, $cd.f.threads.all, false);", "number", "Процент участия в темах"],
    ["percentPosts", 4, ".posts, $cd.f.posts, false);", "number", "Процент сообщений"],
    ["percentWords", 4, ".words[0], $cd.f.words, false);", "number", "Процент написанных слов"],
    ["words", 2, ".words[0]", "number", "Всего написанных слов"],
    ["wordsAverage", 2, ".words[1]", "number", "Среднее количество написанных слов"]
  ]);

  //<div style="width: 24px; height: 24px; margin-left: 5px; float: left; background-image: url(${$ico.memberIco})"></div>

  header =
    `<table align="center" style="width: 100%;" type="padding">
                <tr style="height: 35px; font-style: italic;">
                    <td align="center" colspan="17">Данные по форуму #${$cd.fid}<b> «${$forum.name}»</b></td>
                </tr>
                <tr type="header">
                    <td ${$t.stats.getWidth(0)} align="center" rowspan="2" sort="id" height="60">#<img /></td>
                    <td ${$t.stats.getWidth(1)} align="center" rowspan="2" sort="sNumber">№<img /></td>
                    <td ${$t.stats.getWidth(2)} align="center" rowspan="2" sort="name">Имя<img /></td>
                    <td ${$t.stats.getWidth(3)} align="center" rowspan="2" sort="member"><img /></td>
                    <td align="center" colspan="2">Темы</td>
                    <td align="center" colspan="2">Посты</td>
                    <td align="center" colspan="4">Процент</td>
                    <td ${$t.stats.getWidth(12)} align="center" rowspan="2" sort="status">Статус<img /></td>
                    <td ${$t.stats.getWidth(13)} align="center" rowspan="2" sort="enter">Принят<img /></td>
                    <td ${$t.stats.getWidth(14)} align="center" rowspan="2" sort="exit">Покинул<img /></td>
                    <td ${$t.stats.getWidth(15)} align="center" rowspan="2" sort="invite">Звал<img /></td>
                    <td align="center" colspan="2">Слов в постах</td>
                    <td ${$t.stats.getWidth(18)} align="center" rowspan="2" sort="checked" width="45">@<img /></td>
                </tr>
                <tr type="header">
                    <td ${$t.stats.getWidth(4)} align="center" sort="startThemes">Начато<img /></td>
                    <td ${$t.stats.getWidth(5)} align="center" sort="writeThemes">Участия<img /></td>
                    <td ${$t.stats.getWidth(6)} align="center" sort="lastMessage">Последний<img /></td>
                    <td ${$t.stats.getWidth(7)} align="center" sort="posts">Кол-во<img /></td>
                    <td ${$t.stats.getWidth(8)} align="center" sort="percentStartThemes">Нач.тем<img /></td>
                    <td ${$t.stats.getWidth(9)} align="center" sort="percentWriteThemes">Участия<img /></td>
                    <td ${$t.stats.getWidth(10)} align="center" sort="percentPosts">Постов<img /></td>
                    <td ${$t.stats.getWidth(11)} align="center" sort="percentWords">Слов<img /></td>
                    <td ${$t.stats.getWidth(16)} align="center" sort="words">Всего<img /></td>
                    <td ${$t.stats.getWidth(17)} align="center" sort="wordsAverage" title="Среднее количесвто слов в одном сообщении">В среднем<img /></td>
                </tr>
            </table>`;

  footer =
    `<table align="center" style="width: 100%;" type="padding">
                <tr style="background-color: #d0eed0;" type="filters">
                    <td align="center" ${$t.stats.getWidth(0)} filter="id"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(1)} filter="sNumber"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(2)} filter="name"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(3)} filter="member"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(4)} filter="startThemes"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(5)} filter="writeThemes"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(6)} filter="lastMessage"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(7)} filter="posts"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(8)} filter="percentStartThemes"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(9)} filter="percentWriteThemes"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(10)} filter="percentPosts"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(11)} filter="percentWords"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(12)} filter="status"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(13)} filter="enter"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(14)} filter="exit"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(15)} filter="invite"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(16)} filter="words"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(17)} filter="wordsAverage"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.stats.getWidth(18)} ></td>
                </tr>
                <tr style="height: 35px; background-color: #d0eed0;">
                    <td colspan="12" id="sf_currentFilters"></td>
                    <td colspan="2">
                        Всего тем: <b> ${$forum.themes[1]}</b>, всего постов: <b>${$forum.posts}</b>
                    </td>
                    <td colspan="5">
                        Позиций в таблице: <b id="sf_SI_ListCount">0</b>, отмечено: <b id="sf_SI_ListChecked">0</b>
                    </td>
                </tr>
            </table>
            <span id="sf_bCheckAllMembers">[отметить всё]</span>`;

  $('#sf_header_SI').html(header);
  $('#sf_footer_SI').html(footer);

  $t.stats.setControl($ico);

  b1 = $('#sf_bCheckAllMembers').node();
  bindEvent(b1, 'onclick', function(){checkAllMembers(b1, '#sf_content_SI')});

  //header =
  //    `<table align="center" style="width: 100%" type="padding">
  //        <tr style="height: 35px; font-style: italic;">
  //            <td align="center" colspan="2">Данные по начатым игроком темам</td>
  //        </tr>
  //        <tr type="header" height="48">
  //            <td align="center" style="width: 100px;">Имя игрока:</td>
  //            <td align="left">${createSelect()}</td>
  //        </tr>
  //        <tr>
  //            <td id="sf_STI" colspan="2" valign="top"></td>
  //        </tr>
  //    </table>`;
  //
  //$('#sf_header_STI').html(header);

  $t.themes.setWidth([70, -1, 250, 80, 100, 100, 43]);
  $t.themes.setStructure([
    ["paths", "$cd.f.themes[id]", "$checked.themes[id]"],
    ["id", 0, "Number(id)", "number", "ID"],
    ["name", 1, ".name", "check", "Названии темы"],
    ["author", 1, ".author", "check", "Имени автора"],
    ["date", 1, ".date", "date", "Дате создания"],
    ["check", 2, "", null, null],
    ["postsDone", 1, ".posts[0]", "number", "Обработано сообщений"],
    ["postsAll", 1, ".posts[1]", "number", "Всего сообщений"]
  ]);

  header =
    `<table align="center" style="width: 100%;" type="padding">
                <tr style="height: 35px; font-style: italic;">
                    <td align="center" colspan="7">Данные по обработанным темам</td>
                </tr>
                <tr type="header">
                    <td align="center" ${$t.themes.getWidth(0)} sort="id" rowspan="2" style="height: 50px;">#<img /></td>
                    <td align="center" ${$t.themes.getWidth(1)} sort="name" rowspan="2">Тема<img /></td>
                    <td align="center" ${$t.themes.getWidth(2)} sort="author" rowspan="2">Автор<img /></td>
                    <td align="center" ${$t.themes.getWidth(3)} sort="date" rowspan="2">Создана<img /></td>
                    <td align="center" colspan="2">Сообщений</td>
                    <td align="center" ${$t.themes.getWidth(6)} sort="check" rowspan="2">@<img /></td>
                </tr>
                <tr type="header">
                    <td align="center" ${$t.themes.getWidth(4)} sort="postsDone">Обработано<img /></td>
                    <td align="center" ${$t.themes.getWidth(5)} sort="postsAll">Всего<img /></td>
                </tr>
            </table>`;

  footer =
    `<table align="center" style="width: 100%;" type="padding">
                <tr style="background-color: #d0eed0;" type="filters">
                    <td align="center" ${$t.themes.getWidth(0)} filter="id"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.themes.getWidth(1)} filter="name"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.themes.getWidth(2)} filter="author"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.themes.getWidth(3)} filter="date"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.themes.getWidth(4)} filter="postsDone"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.themes.getWidth(5)} filter="postsAll"><img src="${$ico.filter}"></td>
                    <td align="center" ${$t.themes.getWidth(6)} ></td>
                </tr>
                <tr style="height: 35px; background-color: #d0eed0;">
                    <td colspan="4">
                    </td>
                    <td colspan="3">
                    </td>
                </tr>
            </table>
            <span style="float: right; margin-right: 5px; font-size: 10px; cursor: pointer;" id="sf_bCheckAllThemes">[отметить всё]</span>`;

  $('#sf_header_TL').html(header);
  $('#sf_footer_TL').html(footer);

  $t.themes.setControl($ico);

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
  var table = $t.stats;

  if(!sorted) {
    table.clearContent();
    prepareRenders("players", table);
    table.sorting();
  }

  $cd.statsCount = 0;
  showStats(table);
  bindCheckingOnRows('#sf_content_SI');
}

function renderThemesTable(sorted){
  var table = $t.themes;

  if(!sorted){
    table.clearContent();
    prepareRenders("themes", table);
    table.sorting();
  }

  $cd.themesCount = 0;
  showThemeList(table);
  bindCheckingOnRows('#sf_content_TL');
}

function renderTables(){
  renderStatsTable();
  renderThemesTable();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doFilter(td, tName, type, name){
  console.log(td);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareRenders(value, table){
  var m = [], f = [], added;

  if(value == "players"){
    Object.keys($sd[value]).forEach(processing);
    //Object.keys($ss.show.stats).forEach(prepareFilters);
  }else{
    Object.keys($sd.forums[$cd.fid].themes).forEach(processing);
  }

  if(added && $mode) saveToLocalStorage('data');

  return {m: m, f: f};

  function processing(id){
    var p, pf, kicked, invite, f;

    if($checked[value][id] == null){
      $checked[value][id] = false;
    }

    if(value == "players"){
      p = $sd.players[id];
      pf = p.forums[$cd.fid];

      if(pf != null){
        //kicked = $mode ? $sd.kicked[$cd.fid] : $tsd.kicked[$cd.fid];
        //if(kicked != null && pf != null && kicked[p.name] != null){
        //    if(pf.exit <= kicked[p.name]){
        //        pf.goAway = 1;
        //        pf.exit = kicked[p.name];
        //        if($mode) delete kicked[p.name];
        //        added = true;
        //    }
        //}
        //
        //invite = $mode ? $sd.invite[$cd.fid] : $tsd.invite[$cd.fid];
        //
        //if(invite != null && invite[p.name] != null){
        //    pf.invite = 1;
        //    if($mode) delete invite[p.name];
        //    added = true;
        //}
        //
        //if(!$mode && $tsd.players[id] && $tsd.players[id].forums['17930']){
        //    f = $tsd.players[id].forums['17930'];
        //    pf.sn = f.sn;
        //    pf.enter = f.enter;
        //    pf.exit = f.exit;
        //    pf.invite = f.invite;
        //    pf.member = f.member;
        //    pf.goAway = f.goAway;
        //}
        //
        //m.push(id);

        table.setContent(id);
      }
    }else{
      table.setContent(id);
    }
  }
  /////////////////////////////////////

  function prepareFilters(value){
    if($ss.show.stats[value] != null) f.push(value);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doSort(td, table){
  var cell, name = table.getName();

  table.setSort($ico);

  cell = td.getAttribute("sort");
  if(cell == $ss.sort[name].cell){
    $ss.sort[name].type = $ss.sort[name].type == 0 ? 1 : 0;
  }else{
    $ss.sort[name].cell = cell;
    $ss.sort[name].type = 1;
  }

  table.changeSortImage($ico);
  table.sorting();

  saveToLocalStorage('settings');

  if(name == "stats") renderStatsTable(true);
  if(name == "themes") renderThemesTable(true);

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bindCheckingOnRows(id){
  $(id)
    .find('tr')
    .nodeArr()
    .forEach(
      function(node) {
        bindEvent(node, 'onclick',function(){checkedId(node)});
      }
    );

  function checkedId(node){
    if(node.getAttribute("type") == "light"){
      node.setAttribute("type", "lightChecked");
    }else{
      node.setAttribute("type", "light");
    }
    node = $(node).find('input[type="checkbox"]').node();
    node.nextSibling.style.background = node.checked ? `url("${$ico.boxOff}")` : `url("${$ico.boxOn}")`;
    node.checked = !node.checked;

    if(id == "#sf_content_SI"){
      $checked.players[node.value] = !$checked.players[node.value];
      changeCount('#sf_SI_ListChecked', node.checked);
    }
    if(id == "#sf_content_TL"){
      $checked.themes[node.value] = !$checked.themes[node.value];
    }
  }

  function changeCount(id, state){
    var count, cn;

    cn = $(id);
    count = Number(cn.text());
    cn.html(state ? count + 1 : count - 1);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showStats(table){
  var code;

  code =
    `<div style="max-height: 477px; overflow-y: scroll;">
                <table align="center" style="width: 100%;" type="padding">`;


  table.getContent().forEach(function(tr){
    var memberIco, inviteIco, light, check, box, kickedColor;

    if (tr.check){
      light = "lightChecked";
      check = "checked";
      box = $ico.boxOn;
    }
    else {
      light = "light";
      check = "";
      box = $ico.boxOff;
    }

    memberIco = tr.member ? $ico.inTeam : $ico.outTeam;
    inviteIco = tr.invite ? $ico.inTeam : $ico.outTeam;
    kickedColor = tr.goAway ? 'style="color: brown; font-weight: bold;"' : "";

    code +=
      `<tr height="28" type="${light}">
                            <td ${table.getWidth(0)} align="right">${convertID(tr.id)}</td>
                            <td ${table.getWidth(1)} align="center">${hz(tr.sNumber)}</td>
                            <td ${table.getWidth(2)} style="text-indent: 5px;"><a style="text-decoration: none; font-weight: bold;" target="_blank" href="http://www.ganjawars.ru/info.php?id=${tr.id}">${tr.name}</a></td>
                            <td ${table.getWidth(3)} align="center"><img src="${memberIco}" /></td>
                            <td ${table.getWidth(4)} align="center">${hz(tr.startThemes)}</td>
                            <td ${table.getWidth(5)} align="center">${hz(tr.writeThemes)}</td>
                            <td ${table.getWidth(6)} align="center">${getNormalDate(tr.lastMessage).d}</td>
                            <td ${table.getWidth(7)} align="center">${hz(tr.posts)}</td>
                            <td ${table.getWidth(8)} align="center">${hz(tr.percentStartThemes, 1)}</td>
                            <td ${table.getWidth(9)} align="center">${hz(tr.percentWriteThemes, 1)}</td>
                            <td ${table.getWidth(10)} align="center">${hz(tr.percentPosts, 1)}</td>
                            <td ${table.getWidth(11)} align="center">${hz(tr.percentWords, 1)}</td>
                            <td ${table.getWidth(12)} align="center">${statusMember(tr.status)}</td>
                            <td ${table.getWidth(13)} align="center">${getNormalDate(tr.enter).d}</td>
                            <td ${table.getWidth(14)} align="center" ${kickedColor}>${getNormalDate(tr.exit).d}</td>
                            <td ${table.getWidth(15)} align="center"><img src="${inviteIco}" /></td>
                            <td ${table.getWidth(16)} align="center">${hz(tr.words)}</td>
                            <td ${table.getWidth(17)} align="center">${hz(tr.wordsAverage)}</td>
                            <td ${table.getWidth(18, true)}><input type="checkbox" ${check} name="sf_membersList" value="${tr.id}"/><div style="margin: auto; width: 13px; height: 13px; background: url('${box}')"></div></td>
                        </tr>
                    `;

    $cd.statsCount++;
  });

  code += `</table>
            </div>`;

  $('#sf_content_SI').html(code);
  $('#sf_SI_ListCount').html($cd.statsCount);

  /////////////////////////////

  function hz(value, p){
    return value == 0 ? "-" : p != null ? value + '<span style="font-size: 9px;"> %</span>' : value;
  }
  /////////////////////////////

  function statusMember(s){
    if(s.text == '')
      return "-";
    if(s.text == "Ok")
      return `<div style="width: 100%; height: 100%; background: url('${$ico.ok}') no-repeat 38px 0; line-height: 28px; text-indent: 25px;">[${getNormalDate(s.date).d}]</div>`;
    if(s.date != 0)
      return $date > s.date ? "?" : `<span style="${$statusStyle[s.text]}">${s.text}</span> [${getNormalDate(s.date).d}]`;

    return`<span style="${$statusStyle[s.text]}">${s.text}</span>`;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showThemeList(table){
  var code, light, check, box;

  code =
    `<div style="max-height: 495px; overflow-y: scroll;">
                <table align="center" style="width: 100%;" type="padding">`;

  table.getContent().forEach(function(tr){
    if(tr.check){
      light = "lightChecked";
      check = "checked";
      box = $ico.boxOn;
    }
    else{
      light = "light";
      check = "";
      box = $ico.boxOff;
    }

    code +=
      `<tr height="28" type="${light}">
                        <td ${table.getWidth(0)} align="right">${convertID(tr.id)} </td>
                        <td ${table.getWidth(1)} style="text-indent: 5px;"><a style="text-decoration: none; font-weight: bold;" target="_blank" href="http://www.ganjawars.ru/messages.php?fid=${$cd.fid}&tid=${tr.id}">${tr.name}</a></td>
                        <td ${table.getWidth(2)} style="text-indent: 5px;" width="250"><a style="text-decoration: none; font-weight: bold;" href="http://www.ganjawars.ru/info.php?id=${tr.author.id}">${tr.author.name}</a></td>
                        <td ${table.getWidth(3)} align="center">${getNormalDate(tr.date).d}</td>
                        <td ${table.getWidth(4)} align="center">${tr.postsDone}</td>
                        <td ${table.getWidth(5)} align="center">${tr.postsAll}</td>
                        <td ${table.getWidth(6, true)} align="center"><input type="checkbox" ${check} name="sf_themesList" value="${tr.id}" /><div style="width: 13px; height: 13px; background: url('${box}')"></div></td>
                    </tr>`;
  });

  code += `</table>
            </div>`;

  $('#sf_content_TL').html(code);
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
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function correctionTime(){
  var node, time, t;

  t = $cd.timeRequest;
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
    console.error(`Запрос завершился неудачно. ${text}.`);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// АПИ для работы с LS

function saveToLocalStorage(type){
  var string;

  if(type == 'data' && $mode){
    string = JSON.stringify($sd);
    localStorage.setItem("gk_SF_data", string);
  }
  if(type == 'settings'){
    string = JSON.stringify($ss);
    localStorage.setItem("gk_SF_settings", string);
  }
}

function loadFromLocalStorage(type){
  var string;

  if(type == 'data'){
    string = localStorage.getItem("gk_SF_data");

    if(string){
      if($mode) {
        $sd = JSON.parse(string);
      }else{
        $tsd = JSON.parse(string);
      }
    }else{
      saveToLocalStorage('data');
    }
  }
  if(type == 'settings'){
    string = localStorage.getItem("gk_SF_settings");

    if(string){
      $ss = JSON.parse(string);
    }else{
      saveToLocalStorage('settings');
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// АПИ запроса

function REQ(url, method, param, async, onsuccess, onfailure) {
  var request = new XMLHttpRequest();

  getTimeRequest();

  request.open(method, url, async);
  if (method == 'POST') request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send(param);

  if (async == true) {
    request.onreadystatechange = function(){
      if (request.readyState == 4 && request.status == 200 && typeof onsuccess != 'undefined'){
        getTimeRequest(1);
        onsuccess(request);
      }else if (request.readyState == 4 && request.status != 200 && typeof onfailure != 'undefined') onfailure(request);
    }
  }

  if (async == false) {
    if (request.status == 200 && typeof onsuccess != 'undefined') onsuccess(request);
    else if (request.status != 200 && typeof onfailure != 'undefined') onfailure(request);
  }
}