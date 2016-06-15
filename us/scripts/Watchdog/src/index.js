require('./../../../js/protoDelay.js')();

const $ = require('./../../../js/dom.js');
const bindEvent = require('./../../../js/events.js');
const ajax = require('./../../../js/request.js');
const setStyle = require('./../../../js/style.js');

var $shadow, $sectors;

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');


var $answer, $data, $setups, $map, $players, $title, $tmoved, $last, $sound, $types;
var $work = false;

$types = {
  gos: "Обычное (гос)",
  art: "Hi-Tech (арт)",
  gift: "Подарочное",
  named: "Именное"
};

$sound = [
  '[Без звука]',
  'Doom2: перезарядка',
  'Doom2: выстрел дробовика',
  'Doom2: открытие двери',
  'Doom2: взрыв бочки',
  'Doom2: выстрел BFG',
  'Doom2: радио-зуммер',
  'С&C: подтверждение цели',
  'C&C: "Ion Cannon Ready!"',
  'C&C: "Select target!"',
  'C&C: Звук тревоги',
  'Warcraft2: "I`m alive!"',
  'Warcraft2: орки смеются',
  'Warcraft2: Unholy Armor',
  'Warcraft2: "We`ve been attacked!"',
  'Кот мяукает',
  'Кот мяукает #2',
  'Worms: "Take cover!"',
  'Worms: "Stupid!"',
  'Worms: "Hello!"',
  'Worms: "Hehehehe!"',
  'Звук Windows: Chimes',
  'Звук Windows: Ding',
  'Звук Windows: Ошибка',
  'Звук Windows: Отказ оборудования',
  'Davin Blaine: А, вот эти ребята',
  'Davin Blaine: Не-не-не-не!',
  'Davin Blaine: Нет, Девид Блейн, нет!',
  'Davin Blaine: Я делаю особую...',
  'CS: "Prepare for battle!"',
  'CS: "Pick up your weapons"'
];

$title = document.title;
$tmoved = [
  "!", {
    "moved": "Едет!",
    "healthy-80": "80% HP!",
    "healthy-100": "Здоров!",
    "online": "В игре!",
    "offline": "Вышел!"
  }
];

if(location.pathname == "/me/"){
  addStartButton();
}

if(location.pathname == "/map.php"){
  loadMap();
  findSpeed();
}

if(location.pathname == "/map.moving.php"){
  loadMap();
  findSectorMoving();
}

if(location.pathname == "/home.friends.php"){
  loadData();
  loadMap();
  loadSetups();
  createGUI();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addStartButton(){
  var node, button, link;

  link = "http://www.ganjawars.ru/home.friends.php?watchdog=true";

  node =  $('a[href*="iski.php"]').node(-1);
  button = $('<span>').html(`
    <br>
    <br>
    <a href="${link}" target="_blank"><img width="12" border="0" height="10" src="http://images.ganjawars.ru/i/home/last_fight.gif" /></a>
    <a href="${link}" target="_blank">Слежка за жертвами</a>
  `).node();

  node.parentNode.insertBefore(button, node.nextElementSibling);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function findSpeed(){
  var speed, sector, key; $sectors = require('./sectors.js');

  speed = $('input[type="hidden"][name="moveleft"]').up('table').node();
  if(speed){
    speed = speed.rows[1].cells[1].textContent;
    speed = Number(speed);

    if($map.speed != speed){
      $map.speed = speed;
      key = true;
    }
  }

  sector = $('a[title*="Вы находитесь в секторе"]').find('b').text();
  sector = $sectors(sector);

  if($map.sector.x != sector.x || $map.sector.y != sector.y){
    $map.sector.x = sector.x;
    $map.sector.y = sector.y;
    key = true;
  }

  if(key) save("map");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function findSectorMoving(){
  var name, coordinate; $sectors = require('./sectors.js');

  name = $('center:contains("~Вы находитесь в пути из")').find('b').node(1).textContent;
  coordinate = $sectors(name);

  $map.sector.x = coordinate.x;
  $map.sector.y = coordinate.y;

  save("map");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI(){
  var td, gui;

  $shadow = require('./../../../js/shadow.js')();

  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('watchdog.js', '@include: ./html/index.css, true');

  td = $('b:contains("Ваши друзья")').up('table').up('table')
    .attr("width", "100%").html('<tr><td id="wd_mainCell"></td></tr>').node();

  gui = $('<span>').attr("type", "gui").html('@include: ./html/gui.html, true').node();
  document.body.appendChild(gui);

  bindEvent($('#wd_testSound'), "onclick", actionSounds, ["test"]);
  bindEvent($('#wd_saveSoundSetups'), "onclick", actionSounds, ["save"]);

  if(!$work) getPlayersList();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function actionSounds(type){
  var sound;

  sound = $("#wd_SoundsSelect")
    .find('option:checked')
    .node()
    .value;
  sound = Number(sound);

  if(type == "test"){
    playSound(sound);
  }else{
    $('#wd_setupsWindow').find('input[type="checkbox"]:checked').each((box)=>{
      $setups.sounds[box.name] = sound;
    });

    save("setups");
    openSetupsWindow();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPlayersList(){
  var id, player;

  $players = [];
  $work = true;

  for(id in $data.players){
    player = $data.players[id];

    if(player.work){
      $players.push(generatePlayer(id, player.name, player.level));
    }
  }

  renderTable();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderTable(){
  var code, count;

  count = 0;
  code = '@include: ./html/playersTable.html, true';
  $players.forEach(row);
  code += "</table>";

  $('#wd_mainCell').html(code);
  getData.gkDelay(750, this, [0, $players]);

  /////////////////////////////

  bindEvent($('span.add-player'), "onclick", ()=>{
    renderAddPlayersWindow();
    $shadow.open();
    $('#wd_addPlayersWindow').class("remove", "hide");
  });

  bindEvent($('span.open-setups'), "onclick", openSetupsWindow);

  /////////////////////////////

  function row(p){
    count++;
    code += '@include: ./html/playersTableRow.html, true';
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openSetupsWindow(){
  var w, box, key, select, code = "";

  w = $('#wd_setupsWindow').node();

  $(w).find('.name-sound').each((td)=>{
    box = td.nextElementSibling.firstElementChild;
    box.checked = false;
    key = box.name;
    td.innerHTML = $sound[$setups.sounds[key]];
  });

  select = $(w).find('select').node();
  if(select.childNodes.length == 0){
    $sound.forEach((sound, id)=>{
      code += `<option value="${id}">${sound}</option>`;
    });
    select.innerHTML = code;
  }

  $shadow.open(w);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderAddPlayersWindow(){
  var code, w, hidden, value, id, player;

  w = $('#wd_addPlayersWindow').node();

  code = '@include: ./html/addPlayersHeader.html, true';
  for(id in $data.players){
    player = $data.players[id];
    code += '@include: ./html/addPlayersRow.html, true'
  }
  code += '@include: ./html/addPlayersFooter.html, true';

  /////////////////////////////

  $(w).find('table').html(code);

  /////////////////////////////

  $(w).find('input[type="checkbox"][value]').each((box)=>{
    box.checked = $data.players[box.value].work;
    bindEvent(box, "onclick", changeWork);
  });

  /////////////////////////////

  $(w).find('td.remove-player').each((td)=>{
    bindEvent(td, "onclick", removePlayer, [td.firstElementChild.value]);
  });

  /////////////////////////////

  $(w).find('span[class="money-input"]').each((span)=>{
    bindEvent(span.firstElementChild, 'onkeyup', function(input){
      hidden = input.nextElementSibling;
      value = Number(input.value.replace(/,/g, ""));
      hidden.value = isNaN(value) ? 0 : value;
      input.value = $c.convertID(hidden.value);
    });
  });

  /////////////////////////////

  bindEvent($('#wd_addPlayers'), "onclick", addPlayer);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function changeWork(box){
  $work = false;
  $data.players[box.value].work = !$data.players[box.value].work;
  save("data");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function removePlayer(id, td){
  $work = false;
  delete $data.players[id];
  td.parentNode.parentNode.removeChild(td.parentNode);
  save("data");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addPlayer(button){
  var id, data, answer;

  answer = $('<span>').node();
  id = $(button).up('td').find('input[type=hidden]').node().value;
  data = {};

  ajax("http://www.ganjawars.ru/info.php?id=" + id, "GET", null).then((r)=>{
    answer.innerHTML = r.text;

    data = {
      name: getName(),
      level: getLevel(),
      work: false
    };

    $data.players[id] = data;
    save("data");
    renderAddPlayersWindow();
  });
  /////////////////////////////

  function getName(){
    return $(answer).find('#namespan').text();
  }
  /////////////////////////////

  function getLevel(){
    var level;

    level = $(answer)
      .find('tr:contains("~Боевой:")')
      .find("font")
      .text();
    level = Number(level);

    return level;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getData(index, list){
  var p, interval = $c.randomNumber(285, 614) * 10;

  if(index < list.length && $work){
    p = $players[index];
    loadMap();

    ajax(`http://www.ganjawars.ru/info.php?id=${p.id}&showattack=1`, 'GET', null).then((r)=>{
      $answer.innerHTML = r.text;
      parse();
      index++;
      getData.gkDelay(interval, this, [index, list]);
    });
  }else{
    if($work){
      getData.gkDelay(100, this, [0, list]);
    }else{
      getPlayersList();
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function parse(){
    var sector, moved, status, hp, sn, sx, sy, nextNode;

    sector = $($answer).find('b:contains("Район:")').next('a').node();
    nextNode = sector.nextElementSibling;
    moved = nextNode.nodeName == 'BR' ? sector.nextSibling : nextNode.nextSibling;

    getWeapon(p, "left");
    getWeapon(p, "right");

    hp = $($answer).find('#namespan').node().nextSibling.textContent;
    hp = hp.match(/(\d+)/g);
    p.hp.current = hp[0];
    p.hp.max = hp[1];
    p.hp.percent = $c.getPercent(p.hp.current, p.hp.max, true);

    p.moved.early = p.moved.now;
    p.mainHealing.early = p.mainHealing.now;
    p.healing.early = p.healing.now;
    p.state.early = p.state.now;

    p.moved.now = moved.nodeName != 'BR';
    p.mainHealing.now = p.hp.current != p.hp.max;
    p.healing.now = p.hp.percent < 80;

    sn = sector.textContent;
    sector = sector.href.match(/(\d+)/g);
    sx = sector[0]; sy = sector[1];

    status = $($answer).find('b:contains("Действия")').up('td').next('td').next('td').text();
    p.state.now = status.length < 3 ? "Оффлайн" : status.replace('\n', '');

    status = $($answer).find('td:contains("Вооружение")').up('table').node();
    status = status.rows[5].cells[0].textContent;
    if(status.indexOf("в заявке на бой") != -1) p.state.now = "В заявке на бой";

    if(p.sector.early.name != sn && !p.moved.now){
      p.sector.early.name = sn; p.sector.early.sx = sx; p.sector.early.sy = sy;
      p.sector.target.name = ""; p.sector.target.sx = 0; p.sector.target.sy = 0;
      p.distance = 0;
    }
    if(p.moved.now && !p.moved.early){
      p.sector.target.name = sn; p.sector.target.sx = sx; p.sector.target.sy = sy;
      p.distance = calcDistance(p);
    }

    p.time = getTime(sx, sy);
    render();
  }

  function render(){
    var row, row_, go;

    row = $('#WD_' + p.id + '_row').node();
    row_ = $('#WD_' + $last + '_row').node();

    if(row_) row_.cells[0].innerHTML = "";
    if($last != p.id) $last = p.id;

    row.cells[0].innerHTML = " > ";

    go = p.moved.now ?
      {sx: p.sector.target.sx, sy: p.sector.target.sy} :
      {sx: p.sector.early.sx, sy: p.sector.early.sy};

    renderWeapons(p, row);
    row.cells[4].innerHTML = p.state.now;
    row.cells[5].innerHTML = `${p.hp.current}/${p.hp.max}, ${p.hp.percent}%`;
    row.cells[6].innerHTML = `<a target="_blank" href="http://www.ganjawars.ru/map.php?sx=${p.sector.early.sx}&sy=${p.sector.early.sy}">${p.sector.early.name}</a>`;
    row.cells[7].innerHTML = `<a target="_blank" href="http://www.ganjawars.ru/map.php?sx=${p.sector.target.sx}&sy=${p.sector.target.sy}">${p.sector.target.name}</a>`;
    row.cells[8].innerHTML = p.distance ? p.distance + " кл." : "";
    row.cells[9].innerHTML = p.moved.now ? "<span class='moved'>Да</span>" : "Нет";
    row.cells[10].innerHTML = $c.getNormalTime(p.time, true);
    row.cells[11].innerHTML = `<a target="_blank" style="font-weight: normal; text-decoration: none;" href="http://www.ganjawars.ru/map.move.php?gps=1&sxy=${go.sx}x${go.sy}&sr=i.${p.id}">»»»</a>`;

    if(p.moved.now && p.moved.now != p.moved.early && !p.moved.early){
      playSound($setups.sounds.moved);
      p.alert(p, 0, "moved");
    }

    if(p.healing.early && !p.healing.now){
      playSound($setups.sounds["healthy-80"]);
      p.alert(p, 0, "healthy-80");
    }

    if(p.mainHealing.early && !p.mainHealing.now){
      playSound($setups.sounds["healthy-100"]);
      p.alert(p, 0, "healthy-100");
    }

    if(p.state.early == "Оффлайн" && p.state.now != "Оффлайн"){
      playSound($setups.sounds.online);
      p.alert(p, 0, "online");
    }

    if(p.state.early != "Оффлайн" && p.state.now == "Оффлайн"){
      playSound($setups.sounds.offline);
      p.alert(p, 0, "offline");
    }
  }

  function getWeapon(p, type){
    var text, weapon, img, id, name, wt;

    text = type == "left" ? "~Левая рука:" : "~Правая рука:";
    weapon = $($answer).find(`td[align="right"]:contains("${text}")`);

    if(weapon.length != 0){
      weapon = weapon.next('td').find('a').node();

      id = weapon.href.match(/item_id=(.+)/)[1];
      img = id;
      if(/&/.test(weapon)) img = img.split('&')[0];
      name = weapon.textContent;
      wt = weapon.style.color;

      switch(wt){
        case "rgb(0, 119, 0)":
          wt = "art";
          break;

        case "rgb(68, 0, 170)":
          wt = "gift";
          break;

        case "rgb(102, 0, 0)":
          wt = "named";
          break;

        case "":
        default:
          wt = "gos";
          break;
      }

      if(p.weapons.id[type] != id){
        p.weapons.id[type] = id;
        p.weapons.img[type] = img;
        p.weapons.name[type] = name;
        p.weapons.type[type] = wt;
        p.weapons.new = true;
      }else{
        p.weapons.new = false;
      }
    }else{
      p.weapons.id[type] = null;
      p.weapons.name[type] = null;
      p.weapons.img[type] = null;
      p.weapons.type[type] = "gos";
      p.weapons.new = true;
    }
  }

  function renderWeapons(p, row){
    var weapon = "", lt, rt;

    if(!p.weapons.new) return;

    lt = $types[p.weapons.type.left];
    rt = $types[p.weapons.type.right];
    if(p.weapons.id.left) weapon += '@include: ./html/leftWeapon.html, true';
    if(p.weapons.id.right)weapon += '@include: ./html/rightWeapon.html, true';

    row.cells[3].innerHTML = weapon;
    row.cells[3].className = "ct " +  p.weapons.type.right;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function isMoved(color, list){
  var row;

  color = color == 1 ? 2 : 1;
  list.forEach((player)=>{
    if(player.moved.now){
      row = $('#WD_' + player.id + '_row');
      $tmoved[1] = player.name + " !";
      color == 1 ? row.class("add", "moved") : row.class("remove", "moved");
      document.title = $tmoved[color];
    }else{
      if(player.moved.early){
        $('#WD_' + player.id + '_row').class("remove", "moved");
        document.title = $title;
      }
    }
  });
  isMoved.gkDelay(750, this, [color, list]);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calcDistance(p){
  var dx, dy;

  if(p.sector.early.sx && p.sector.target.sx){
    dx = Math.abs(p.sector.early.sx - p.sector.target.sx);
    dy = Math.abs(p.sector.early.sy - p.sector.target.sy);

    if(dx >= dy){
      return dx;
    }else{
      return dy;
    }
  }else{
    return 0;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function playSound(id){
  var audio;

  if(id == 0) return;
  audio = $('#wd_playSound');

  if(audio.length == 0){
    audio = $('<audio>').node();
    audio.id = "wd_playSound";
    audio.src = `http://www.ganjawars.ru/sounds/${id}.mp3`;
    audio.autoplay = true;

    document.body.appendChild(audio);
  }else{
    audio = audio.node();

    if(audio.src != `http://www.ganjawars.ru/sounds/${id}.mp3`){
      audio.src = `http://www.ganjawars.ru/sounds/${id}.mp3`;
    }
    audio.play();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generatePlayer(id, name, level){
  return {
    id: id,
    name: name,
    level: level,
    weapons:{
      new: true,
      img: {
        left: null,
        right: null
      },
      id: {
        left: null,
        right: null
      },
      name: {
        left: null,
        right: null
      },
      type:{
        left: "gos",
        right: "gos"
      }
    },
    hp: {
      current: 0,
      max: 0,
      percent: 0
    },
    healing: {
      now: false,
      early: false
    },
    mainHealing:{
      now: false,
      early: false
    },
    state: {
      early: "",
      now: ""
    },
    moved: {
      now: false,
      early: false
    },
    sector: {
      early: {
        name: "",
        sx: 0,
        sy: 0
      },
      target:{
        name: "",
        sx: 0,
        sy: 0
      }
    },
    time: 0,
    distance: 0,

    alert: (p, n, action)=>{
      var row = $('#WD_' + p.id + '_row'), i;

      if(n < 15){
        i = n % 2;
        document.title = i == 0 ? p.name + $tmoved[i] : p.name + " " + $tmoved[i][action];
        (i) ? row.class("add", action) : row.class("remove", action);
        n++;
        p.alert.gkDelay(400, p, [p, n, action]);
      }else{
        document.title = $title;
      }
    }
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getTime(x, y){
  var at, time, xd, yd, dx, dy, speed;

  dx = $map.sector.x;
  dy = $map.sector.y;
  speed = $map.speed;

  at = speed * 1.5;
  time = 0;

  xd = Math.abs(dx - x);
  yd = Math.abs(dy - y);

  if(xd == yd){
    time = at * xd;
  }else{
    if(xd > yd){
      time = at * yd;
      time = time + (speed * (xd - yd));
    }else{
      time = at * xd;
      time = time + (speed * (yd - xd));
    }
  }

  return parseInt(time, 10);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $answer = $('<span>').node();
  $data = $ls.load("gk_watchdog_data");
  $players = [];

  if($data.players == null){
    $data.players = {};
    save("data");
  }
}

function loadSetups(){
  $setups = $ls.load("gk_watchdog_setups");

  if($setups.sounds == null){
    $setups = {
      sounds: {
        "moved": 0,
        "healthy-80": 0,
        "healthy-100": 0,
        "online": 0,
        "offline": 0
      }
    };
    save("setups");
  }
}

function loadMap(){
  $map = $ls.load("gk_watchdog_map");

  if($map.speed == null){
    $map = {
      sector: {
        x: 0,
        y: 0
      },
      speed: 10
    };
    save("map");
  }
}

function save(type){
  switch(type){
    case "map":
      $ls.save("gk_watchdog_map", $map);
      break;

    case "data":
      $ls.save("gk_watchdog_data", $data);
      break;

    case "setups":
      $ls.save("gk_watchdog_setups", $setups);
      break;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

