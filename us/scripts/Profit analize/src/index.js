var $ = require('./../../../js/dom.js');

if(location.pathname == "/me/") addStartButton();
//if(location.search != "?profit=true") return;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
require('./../../../js/protoDelay.js')();
var bindEvent = require('./../../../js/events.js');
var ajax = require('./../../../js/request.js');
var setStyle = require('./../../../js/style.js');
var progress = require('./../../../js/progress.js')(renderTables);
var shadow = require('./../../../js/shadow.js')();
var tabs = require('./../../../js/tabs.js');
var createTable = require('./../../../js/table.js');
var calendar = require('./../../../js/calendar.js')();

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');
const Create = require('./../src/creator.js')();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var $answer, $tabs, $data, $items, $t, $sellers, $texts;

$texts = {
  island: {
    "-1": "Не имеет значения",
    "0": "[G] Ganja Island",
    "1": "[Z] Z-Land",
    "2": "[S] Santa Maria",
    "3": "[O] Outland",
    "4": "[P] Palm Island"
  }
};


loadData();

setStyle('common.js', '@include: ./../../css/common.css, true');
setStyle('filter.js', '@include: ./../../css/filter.css, true');
setStyle('pa.js', '@include: ./html/index.css, true');

createGUI();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addStartButton(){
  var node, button, link;

  link = "http://www.ganjawars.ru/home.friends.php?profit=true";

  node =  $('a[href*="iski.php"]').node(-1);
  button = $('<span>').html(`
    <br>
    <br>
    <a href="${link}"><img width="12" border="0" height="10" src="http://images.ganjawars.ru/i/home/cashlog.gif" /></a>
    <a href="${link}">Анализ продаж</a>
  `).node();

  node.parentNode.insertBefore(button, node.nextElementSibling);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI(){
  var td, gui, settings, ih, bh, ch, menu;
  var date = $c.getTimeNow();

  if(!getItemsData()) return;

  menu = {
    "Добавить продавца": "pa_openAddSeller",
    "Провести анализ прибыли": "pa_openAnalyze"
  };

  settings = "gk_pa_settings";
  gui = $('<span>').attr("type", "gui").html('@include: ./html/baseGUI.html, true').node();
  td = $('b:contains("Ваши друзья")').up('table').up('table')
    .attr("width", "100%").html("<tr><td></td></tr>").node();
  td = td.rows[0].cells[0];

  $tabs = tabs(["Предметы", "Анализ продаж", "Продавцы"], 1, menu);
  $tabs.append(td);
  document.body.appendChild(gui);
  calendar.bind($('span[type="calendarCall"]').node());

  $t = {
    items: createTable(0, "items", settings, "level"),
    stats: createTable(1, "stats", settings, "seller"),
    sellers: createTable(2, "sellers", settings, "level")
  };

  renderBaseHTML();

  ih = window.innerHeight;
  bh = $(td).up('table').node();
  bh = bh.offsetTop + bh.offsetHeight;
  ch = (parseInt((ih - bh) / 28, 10)) * 28;
  setStyle('pa-content.js ', `div.tab-content-scroll{height: ${ch}px; overflow-y: scroll; margin: auto}`);

  renderTables();
  bidHideContextMenu();
  bindActionsContextMenu();
  bindMoneyInputs();
  bindAddSellers();

  bindEvent($('#pa_openAddSeller'), "onclick", openAddSellersWindow);
  bindEvent($('#pa_openAnalyze'), "onclick", openAnalyzeWindow, ["all"]);
  bindEvent($('#pa_doAnalyze'), "onclick", prepareAnalyzeSellers, [date]);
  bindEvent($('#pa_setMinPrice'), "onclick", setMinPriceItem);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bidHideContextMenu(){
  bindEvent(document.body, 'onclick', ()=>{
    var menu = $('#contextMenu').node();
    if(menu.style.visibility == "visible"){
      menu.style.visibility = "hidden";
      menu.removeAttribute("class");
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bindActionsContextMenu(){
  var actions, menu, table;

  menu = $('#contextMenu').node();

  actions = {
    updateItems: ()=>{
      getItemsData(true);
    },

    setPrice: (type, list)=>{
      if(type == "add"){
        openMinPriceWindow(list[0]);
      }else{
        list.forEach((item)=>{
          $items.item[item.id].d = 0;
        });

        $ls.save("gk_pa_items", $items);
        renderItemsTable();
        renderStatsTable();
      }
    },

    removeSellers: (list)=>{
      if(!confirm(`Вы уверены что хотите убрать этих продавцов? (${list.length} шт.)`)) return;

      list.forEach((seller)=>{
        delete $sellers[seller.id];
      });

      $ls.save("gk_pa_sellers", $sellers);
      renderSellersTable();
    },

    analyzeSellers: ()=>{
      openAnalyzeWindow("checked");
    }
  };
  /////////////////////////////

  $(menu).find('ul[type]').each((ul)=>{
    ul = $(ul);
    table = $t[ul.attr("type")];

    ul.find('span[action]').each((item)=>{
      bindEvent(item, "onclick", action, [table]);
    });
  });
  /////////////////////////////

  function action(table, item){
    var func, args, index, array;

    index = Number($(menu).attr('index'));
    array = table.getCheckedContent();
    if(array.length == 0) array = table.getContentOnIndex(index);

    args = JSON.parse($(item).attr("action"));
    func = args.shift();
    args.push(array, table);

    actions[func].apply(null, args);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bindMoneyInputs(){
  var hidden, value;

  $('span[class="money-input"]').each((span)=>{
    bindEvent(span.firstElementChild, 'onkeyup', function(input){
      hidden = input.nextElementSibling;
      value = Number(input.value.replace(/,/g, ""));
      hidden.value = isNaN(value) ? 0 : value;
      input.value = $c.convertID(hidden.value);
    });
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bindAddSellers(){
  var list, count, value, w;

  bindEvent($('#pa_addSeller'), 'onclick', ()=>{
    list = [];
    w = $('#pa_addSellersWindow').node();

    $(w).find('input[type="hidden"]').each((input)=>{
      value = Number(input.value);
      if(value != 0) list.push(value);
    });

    count = list.length;
    $(w).class("add", "hide");
    progress.start("Добавление продавцов", count, 750);
    addSellers(0, count, list);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addSellers(now, max, list){
  var id;

  if(now < max){
    id = list[now];
    ajax('http://www.ganjawars.ru/info.php?id=' + id, "GET", null).then((r)=>{
      if(!/Internal error/.test(r.text)){
        $answer.innerHTML = r.text;

        $sellers[id] = {
          a: getName(),
          b: getLevel(),
          c: getSindicate(),
          d: getIsland()
        };

        $ls.save("gk_pa_sellers", $sellers);
      }
      progress.work(false, r.time);
      now++;
      addSellers.gkDelay(750, null, [now, max, list]);
    });
  }else{
    //$tabs.select("Продавцы");
    renderSellersTable();
    progress.done();
  }
  /////////////////////////////

  function getName(){
    return $($answer).find('#namespan').text();
  }
  /////////////////////////////

  function getLevel(){
    var level;

    level = $($answer)
      .find('tr:contains("~Боевой:")')
      .find("font")
      .text();
    level = Number(level);

    return level;
  }
  /////////////////////////////

  function getSindicate(){
    var sid, name;

    sid = $($answer).find('b:contains("Основной синдикат:")');
    if(sid.length == 0) return [0, "-"];

    sid = sid.next('a').node();
    name = sid.textContent;
    sid = sid.href.match(/(\d+)/)[1];
    sid = Number(sid);

    return [sid, name];
  }
  /////////////////////////////

  function getIsland(){
    var island;

    island = $($answer).find('b:contains("Район:")').next('a').text();

    if(/\[G]/.test(island)) return 0;
    if(/\[Z]/.test(island)) return 1;
    if(/\[S]/.test(island)) return 2;
    if(/\[P]/.test(island)) return 4;
    if(/Ejection|Overlord/.test(island)) return 3;
    return -1;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openMinPriceWindow(item){
  var w = $('#pa_minPriceWindow').node();

  shadow.open("#pa_minPriceWindow");
  $tabs.closeMenu();

  $(w).find('td[name="item-name"]').text(item.name);
  $(w).find('input[type="hidden"]').node().value = item.id;
  $(w).find('input[type="text"]').node().value = $c.convertID(item.price);
  $(w).find('input[type="hidden"]').node(-1).value = item.price;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openAddSellersWindow(){
  shadow.open("#pa_addSellersWindow");
  $tabs.closeMenu();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openAnalyzeWindow(type){
  var text = type == "all" ? "Все" : "Выбранные";
  $('#pa_sellers-type').text(text);
  shadow.open("#pa_timeAnalyzeWindow");
  $tabs.closeMenu();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setMinPriceItem(){
  var data;

  data = getValues($('#pa_minPriceWindow').node());
  $items.item[data.id].d = Number(data.price);
  $ls.save("gk_pa_items", $items);

  renderItemsTable();
  renderStatsTable();
  shadow.close();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareAnalyzeSellers(date){
  var w, data, stop, type, list = [];

  w = $('#pa_timeAnalyzeWindow').node();
  type = $('#pa_sellers-type').text() == "Все";
  data = getValues(w);
  stop = Number(data[data.type]);
  if(data.type == "period") stop = date - stop;

  if(type){
    list = Object.keys($sellers);
  }else{
    $t.sellers.getCheckedContent(true).forEach((seller)=>{
      list.push(seller.id);
    });
  }

  $data.time = date;
  $(w).class("add", "hide");
  progress.start("Аанализ протоколов продавцов", list.length, 1250);
  analyzeSellers(0, list.length, list, stop);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function analyzeSellers(now, max, list, stop){
  if(progress.isWork(analyzeSellers, arguments)) return;
  if(now < max){
    progress.start(`<b>Продавец:</b> ${$sellers[list[now]].a}, страница протокола: `, "?", 1250, null, true);
    getLog(0, true, [now, max, list, stop]);
  }else{
    progress.done();
    $tabs.select("Анализ продаж");
    renderStatsTable();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getLog(page, next, data){
  var url, id, stop;

  if(progress.isWork(getLog, arguments)) return;

  id = data[2][data[0]];
  stop = data[3];
  url = `http://www.ganjawars.ru/usertransfers.php?id=${id}&page_id=${page}`;

  ajax(url, "GET", null).then((r)=>{
    $($answer).html(r.text).find('nobr').each((nobr)=>{
      var text, log, date;

      if(!next) return;
      text = nobr.textContent;
      date = text.match(/  (\d+).(\d+).(\d+) (\d+):(\d+)(.+)/);

      if(date != null){
        date = `${date[2]}/${date[1]}/20${date[3]} ${date[4]}:${date[5]}`;
        date = Date.parse(date) / 1000;
        log = text.match(/(.+)Передано \$(\d+) от (.+) : Приобретение предмета (.+)/);

        if(log){
          if($data.log[id] == null) $data.log[id] = [];
          if($items.names[log[4]]){
            $data.log[id].push({
              id: $items.names[log[4]],         // id
              a: Number(log[2]),                // money
              b: date                           // date
            });
          }

          $ls.save("gk_pa_data", $data);
        }

        if(date < stop){
          next = false;
        }
      }
    });

    if(next){
      progress.work(true, r.time);
      page++;
      getLog.gkDelay(1250, null, [page, next, data]);
    }else{
      progress.work(false, r.time);
      data[0]++;
      analyzeSellers.gkDelay(1250, null, data);
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderBaseHTML(){
  var t;

  t = $t.items;
  t.setStructure({
    section: [150, "check", "Тип предмета"],
    level: [28, "number", "Минимальный уровень"],
    name: [-1, "check", "Название предмета"],
    durability: [50, "number", "Прочность"],
    cost: [85, "number", "Стоимость предмета"],
    price: [85, "number|boolean", "Минимальная цена предмета|с мин.ценой|тех что с мин.ценой"],
    check: [45, null]
  });

  t.setHeader('@include: ./html/itemsTableHeader.html, true');
  t.setFooter('@include: ./html/itemsTableFooter.html, true');
  t.setControls(renderItemsTable, true, true, true);

  /////////////////////////////

  t = $t.stats;
  t.setStructure({
    section: [150, "check", "Тип предмета"],
    name: [-1, "check", "Название предмета"],
    price: [75, "number|boolean", "Минимальная цена предмета|с минимальной ценой|тех что с ценой"],
    sell: [75, "number", "Цена продажи предмета"],
    profit: [75, "number", "Прибыль"],
    seller: [120, "check", "Имя продавца"],
    date: [60, "date", "Дата продажи"],
    check: [45, null]
  });

  t.setHeader('@include: ./html/statsTableHeader.html, true');
  t.setFooter('@include: ./html/statsTableFooter.html, true');
  t.setControls(renderStatsTable, true, true, true);

  /////////////////////////////

  t = $t.sellers;
  t.setStructure({
    id: [80, "number", "ID"],
    level: [28, "number", "Уровень продавца"],
    name: [-1, "check", "Продавец"],
    sid: [300, "number", "Синдикат"],
    island: [150, "multiple", "Остров"],
    check: [45, null]
  });

  t.setHeader('@include: ./html/sellerTableHeader.html, true');
  t.setFooter('@include: ./html/sellerTableFooter.html, true');
  t.setControls(()=>{}, true, true, true);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderTables(){
  renderItemsTable();
  renderStatsTable();
  renderSellersTable();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderItemsTable(mode){
  var table, items;

  table = $t.items;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    items = Object.keys($items.item);

    items.forEach((id)=>{
      table.pushContent(Create.item($items.item[id], $items.sections));
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(true);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderStatsTable(mode){
  var table, id, date;
  var sells = 0, profits = 0;

  table = $t.stats;

  if(mode == null){
    mode = "filter";
    table.clearContent();

    for(id in $data.log){
      $data.log[id].forEach((log)=>{
        table.pushContent(Create.log($items.item[log.id], log, $items.sections, [id, $sellers[id].a]));
      });
    }
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(true);

    table.getContent(true).forEach((row)=>{
      sells += row.sell;
      profits += row.profit;
    });

    date = $c.getNormalDate($data.time);
    $('#pa_time-update').text(`${date.d} ${date.t}`);
    $('#pa_sell-sum').text("$" + $c.convertID(sells));
    $('#pa_profit-sum').text("$" + $c.convertID(profits));
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderSellersTable(mode){
  var table, sellers;

  table = $t.sellers;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    sellers = Object.keys($sellers);

    sellers.forEach((id)=>{
      table.pushContent(Create.seller($sellers[id], Number(id)));
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(true);
  });
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
      case "items":
        return '@include: ./html/itemsTableRow.html, true';
        break;
      case "stats":
        return '@include: ./html/statsTableRow.html, true';
        break;
      case "sellers":
        return '@include: ./html/sellerTableRow.html, true';
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getItemsData(update){
  var sections, name;

  if($items.names == null || update){
    $items = {
      item: {},
      names: {},
      sections: []
    };
  }else{
    return true;
  }
  /////////////////////////////

  sections = {
    names: []
  };

  ajax("http://www.ganjawars.ru/shop.php", "GET", null).then((r)=>{
    $($answer)
      .html(r.text)
      .find('font:contains("Разделы")')
      .up('table')
      .find('a[href*="/shop.php"]')
      .each((node)=>{
        name = node.textContent;
        if(name == "") return;
        sections[name] = node.href;
        sections.names.push(name);
      });

    $items.sections = sections.names;
    progress.start("Сбор новых данных предметов с гос.магазина, разделы", sections.names.length, 750);
    getData(0, sections.names.length);
  });
  /////////////////////////////

  function getData(index, max){
    var table, data, url;

    if(progress.isWork(getData, arguments)) return;
    if(index < max){
      url = sections.names[index];
      url = sections[url];

      ajax(url, "GET", null).then((r)=>{
        $($answer)
          .html(r.text)
          .find('td[width="800"]')
          .find('a[href*="item.php"]')
          .each((node)=>{
            table = $(node).up('table').node();

            data = {};
            data.id = getID(node);
            data.a = getName();             // name
            data.b = getSection();          // section
            data.c = getCost();             // cost
            data.d = 0;                     // price
            data.e = getDurability();       // durability
            data.f = getLevel();            // level

            $items.item[data.id] = data;
            $items.names[data.a] = data.id;
          });

        progress.work(false, r.time);
        index++;
        getData.gkDelay(750, null, [index, max]);
      });
      /////////////////////////////

      function getID(node){
        return node.href.split(/item_id=/)[1];
      }
      /////////////////////////////

      function getName(){
        return $(table).find('font').text();
      }
      /////////////////////////////

      function getSection(){
        return index;
      }
      /////////////////////////////

      function getCost(){
        var cost;

        cost = $(table).find('b:contains("Стоимость:")').next('b').text();
        cost = cost.replace(/,/g, "");
        cost = Number(cost);

        return cost;
      }
      /////////////////////////////

      function getDurability(){
        var durability;

        durability = $(table).find('b:contains("Прочность:")').node();
        durability = durability.nextSibling.textContent;
        durability = Number(durability);

        return durability;
      }
      /////////////////////////////

      function getLevel(){
        var level;

        level = $(table).find('font:contains("Минимальный боевой уровень:")');
        if(level.length){
          level = level.next('b').text();
          level = Number(level);
        }else{
          level = 0;
        }

        return level;
      }
      /////////////////////////////
    }else{
      $ls.save("gk_pa_items", $items);
      //console.log($items);
      update ? renderItemsTable() : createGUI();
      progress.done();
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getValues(element){
  var result = {};

  $(element).find('input[type="text"],input[type="hidden"]').each((input)=>{
    result[input.name] = input.value;
  });
  $(element).find('input[type="checkbox"]').each((input)=>{
    result[input.name] = input.checked;
  });
  $(element).find('input[type="radio"]:checked').each((input)=>{
    result[input.name] = input.value;
  });
  $(element).find('select').each((select)=>{
    result[select.name] = $(select).find('option:checked').node().value;
  });
  $(element).find('textarea').each((textarea)=>{
    result[textarea.name] = textarea.value;
  });

  return result;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $answer = $('<span>').node();
  $items = $ls.load("gk_pa_items");
  $sellers = $ls.load("gk_pa_sellers");
  $data = $ls.load("gk_pa_data");

  if($data.time == null){
    $data = {
      time: $c.getTimeNow(),
      log: {}
    };

    $ls.save("gk_pa_data", $data);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////