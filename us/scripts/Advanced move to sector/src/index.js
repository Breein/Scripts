const $ = require('./../../../js/dom.js');
const bindEvent = require('./../../../js/events.js');
const ajax = require('./../../../js/request.js');
const setStyle = require('./../../../js/style.js');
const createTable = require('./../../../js/table.js');

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');
const $sectors = require('./sectors.js');

var $data, $texts, $t;

$data = {
  sell: [],
  buy: [],
  shops: []
};

$texts = {
  island: {
    "-1": "-",
    "0": "[G]",
    "1": "[Z]",
    "2": "[S]",
    "3": "[O]",
    "4": "[P]"
  },
  iN:{
    "[G]": 0,
    "[Z]": 1,
    "[S]": 2,
    "[O]": 3,
    "[P]": 4
  }
};

if(location.pathname == "/statlist.php"){
  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('filter.js', '@include: ./../../css/filter.css, true');
  setStyle('amts.js', '@include: ./html/index.css, true');

  prepareStatListData();
  restyleStatsList();
}

function prepareStatListData(){
  var tr, settings, gui;
  var ih, bh, ch;

  settings = "gk_amts_settings";
  tr = $('b:contains("Объект")').up('table').up('tr').node();

  getStatListData(tr.cells[0], "sell");
  getStatListData(tr.cells[1], "buy");

  $t = {
    sell: createTable(tr.cells[0], "sell", settings, "price"),
    buy: createTable(tr.cells[1], "buy", settings, "price")
  };

  gui = $('<span>').attr("type", "gui").html('@include: ./html/gui.html, true').node();
  document.body.appendChild(gui);

  renderBaseHTML(true);

  ih = window.innerHeight;
  bh = $(tr).up('table').node();
  bh = bh.offsetTop + bh.offsetHeight;
  ch = (parseInt((ih - bh) / 28, 10)) * 28;
  setStyle('amts-content.js ', `div.tab-content-scroll{height: ${ch}px; overflow-y: scroll; margin: auto}`);

  renderTables();
}

function getStatListData(node, type){
  var iData;

  if($data[type] == null){
    $data[type] = [];
  }

  $(node).find('tr').each((row)=>{

    iData = getIslandData(row);

    $data[type].push({
      island: iData[0],
      xy: iData[1],
      x: iData[2],
      y: iData[3],
      sector: $sectors(iData[1]),
      object: getObject(row),
      owner: getOwner(row),
      count: getCount(row),
      price: getPrice(row),
      time: getTime(iData[2], iData[3], 9)
    });
  }, 1);

  node.removeChild(node.lastElementChild);

  function getIslandData(tr){
    var island, xy;

    island = $(tr).find('a[href*="/map.php?"]').node();
    xy = island.href.match(/sx=(\d+)&sy=(\d+)/);
    xy = [$texts.iN[island.textContent], `${xy[1]}x${xy[2]}`, Number(xy[1]), Number(xy[2])];

    return xy;
  }

  function getObject(tr){
    var object, id;

    object = $(tr).find('a[href*="/object.php"]').node(1);
    id = object.href.match(/(\d+)/)[1];
    id = Number(id);

    return [id, object.textContent];
  }

  function getOwner(tr){
    var owner;

    owner = $(tr.cells[0]).find('b').text();

    return owner;
  }

  function getCount(tr){
    return Number(tr.cells[1].textContent);
  }

  function getPrice(tr){
    var price;

    price = tr.cells[2].textContent;
    price = price.match(/(\d+)/)[1];
    price = Number(price);

    return price;
  }

  function getTime(x, y, speed){
    var dx, dy, at, time, xd, yd;

    dx = 52;
    dy = 52;
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
}

function restyleStatsList(){

}

function renderBaseHTML(type){
  var t;

  if(type){
    t = $t.sell;
    t.setStructure({
      island: [40, "multiple", "Остров"],
      sector: [120, "check", "Сектор"],
      object: [-1, "check", "Объект"],
      owner: [150, null],
      count: [100, "number", "Количество"],
      price: [85, "number", "Цена"],
      time: [60, "number", "Время пути"],
      go: [35, null],
      check: [45, null]
    });

    t.setHeader('@include: ./html/statsTableHeader.html, true');
    t.setFooter('@include: ./html/statsTableFooter.html, true');
    t.setControls(renderSellTable, true, true, true);

    /////////////////////////////

    t = $t.buy;
    t.setStructure({
      island: [40, "multiple", "Остров"],
      sector: [120, "check", "Сектор"],
      object: [-1, "check", "Объект"],
      owner: [150, null],
      count: [100, "number", "Количество"],
      price: [85, "number", "Цена"],
      time: [60, "number", "Время в пути"],
      go: [35, null],
      check: [45, null]
    });

    t.setHeader('@include: ./html/statsTableHeader.html, true');
    t.setFooter('@include: ./html/statsTableFooter.html, true');
    t.setControls(renderBuyTable, true, true, true);
  }else{

  }
}

function renderTables(){
  renderSellTable();
  renderBuyTable();
}

function renderSellTable(mode){
  var table, sells;

  table = $t.sell;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    sells = $data.sell;

    sells.forEach((sell)=>{
      table.pushContent(sell);
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(false);
  });
}

function renderBuyTable(mode){
  var table, buys;

  table = $t.buy;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    buys = $data.buy;

    buys.forEach((buy)=>{
      table.pushContent(buy);
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(false);
  });
}

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
      case "sell":
      case "buy":
        return '@include: ./html/statsTableRow.html, true';
        break;
    }
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