require('./../../../js/protoDelay.js')();
var $ = require('./../../../js/dom.js');
var bindEvent = require('./../../../js/events.js');
var ajax = require('./../../../js/request.js');
var createTable = require('./../../../js/table.js');
var setStyle = require('./../../../js/style.js');
var pw = require('./../../../js/progress.js');

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');
const $ico = require('./../src/icons.js');
const Create = require('./../src/creator.js')();

var $answer, $items, $adverts, $t, $texts;


$answer = $('<span>').node();

$adverts = $ls.load("gk_acfd_adverts");

$texts = {
  island: {
    "-1": "Не имеет значения",
    "0": "[G] Ganja Island",
    "1": "[Z] Z-Land",
    "4": "[P] Palm Island"
  },
  action:{
    "sell": '<span style="color: darkgreen;">Продажа</span>',
    "buy": '<span style="color: darkred;">Покупка</span>',
    "rent": '<span style="color: darkblue;">Аренда</span>'
  }
};

getItemsData();


addStyle();
createButton();
createGUI();

function addStyle(){
  var css;

  css = `
    tr.light div[type="checkbox"]{
      background-image: url(${$ico.boxOff});
    }
    tr.checked div[type="checkbox"]{
      background-image: url(${$ico.boxOn});
    }
    td[filter]{
      background-position: center center;
      background-repeat: no-repeat;
    }
    td[filter].disable{
      background-image: url(${$ico.boxOff});
    }
    td[filter].enable{
      background-image: url(${$ico.boxOn});
      background-color: #cfe5cf;
    }`;

  css += '@include: ./html/index.css, true';
  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('advanced control for do.js', css);
  setStyle('filter.js', '@include: ./../../css/filter.css, true');
}

function createButton(){
  var button, node;

  node = $('a[href*="forum.php"]').node();
  button = $('<span>').html('@include: ./html/startButton.html, true').node();

  node.parentNode.insertBefore(button, node.nextSibling);
  bindEvent(button, "onclick", createGUI);
}

function createGUI(){
  var td;

  pw();

  $t = {
    items: createTable(["#header-items", "#content-items", "#footer-items", "#contextMenu"], "items", "gk_acfd_settings", $ico, "level"),
    adverts: createTable(["#header-adverts", "#content-adverts", "#footer-adverts", "#contextMenu"], "adverts", "gk_acfd_settings", $ico, "section")
  };

  td = $('b[style="color: #990000"]:contains("Форум")').up('table').up('td');
  td = td.html('@include: ./html/baseGUI.html, true').node();

  $('td[class="tab"],[class="tab tabActive"]').nodeArr().forEach((tab)=>{
    bindEvent(tab, 'onclick', selectTabTable);
  });

  bindEvent($("#acfd_addAdvert").node(), "onclick", bindAddAdvert);

  renderBaseHTML();
  renderTables();
  bidHideContextMenu();
  bindActionsContextMenu();
}

function bidHideContextMenu(){
  bindEvent(document.body, 'onclick', ()=>{
    var menu = $('#contextMenu').node();
    if(menu.style.visibility == "visible"){
      menu.style.visibility = "hidden";
      menu.removeAttribute("class");
    }
  });
}

function bindActionsContextMenu(){
  var actions, menu, table;

  menu = $('#contextMenu').node();

  actions = {
    addAdvert: (mode, text, list)=>{
      openAdvertWindow(mode, text, list);
    },
    updateItems: ()=>{
      getItemsData(true);
    }
  };

  $(menu).find('ul[type]').nodeArr().forEach((ul)=>{
    ul = $(ul);
    table = $t[ul.attr("type")];

    ul.find('span[action]').nodeArr().forEach((item)=>{
      bindEvent(item, "onclick", action, [table]);
    });
  });

  function action(table, item){
    var func, args, index, array;

    index = Number($(menu).attr('index'));
    array = table.getCheckedContent();
    if(array.length == 0) array = [table.getContentOnIndex(index)];

    args = JSON.parse($(item).attr("action"));
    func = args.shift();
    args.push(array, table);

    actions[func].apply(null, args);
  }
}

function getValues(element){
  var result = {};

  $(element).find('input[type="text"],input[type="hidden"]').nodeArr().forEach((input)=>{
    result[input.name] = input.value;
  });
  $(element).find('input[type="checkbox"]').nodeArr().forEach((input)=>{
    result[input.name] = input.checked;
  });
  $(element).find('input[type="radio"]:checked').nodeArr().forEach((input)=>{
    result[input.name] = input.checked;
  });
  $(element).find('select').nodeArr().forEach((select)=>{
    result[select.name] = $(select).find('option:checked').node().value;
  });
  $(element).find('textarea').nodeArr().forEach((textarea)=>{
    result[textarea.name] = textarea.value;
  });

  return result;
}

function bindAddAdvert(){
  var window, data, list;
  var durability;

  window = $("#acfd_advertWindow").class("add", "hide").node();
  list = $t.items.getCheckedContent();
  data = getValues(window);

  list.forEach((item)=>{
    durability = data.durability == "new" ? [item.durability, item.durability] : [0, 1];

    $adverts[`${item.id}-${data.action}`] = {
      id: item.id,
      mod: 0,
      action: data.action,
      island: Number(data.island),
      durNow: durability[0],
      durMax: durability[1],
      termPost: Number(data.termPost),
      termRent: Number(data.termPost),
      date: $c.getTimeNow(),
      price: Number(data.price),
      posted: 0,
      autoPost: 0
    }
  });

  $ls.save("gk_acfd_adverts", $adverts);
  renderTables();
}

function selectTabTable(tab){
  var active, tabs, table;

  if(tab.className == "tab tabActive") return;

  active = $('td[class="tab tabActive"]').node();
  tabs = $(active).up('table').node();
  table = $('table[class="mainTable"]').node();

  tabs.rows[0].cells[active.cellIndex].className = "tabTop";
  active.className = "tab";

  tabs.rows[0].cells[tab.cellIndex].className = "tabTop tabTopActive";
  tab.className = "tab tabActive";

  table.rows[tab.cellIndex - 1].className = "tabRow";
  table.rows[active.cellIndex - 1].className = "tabRowHide";
}

function openAdvertWindow(mode, text, list){
  var window, hide;

  //$("#sf_shadowLayer").node().style.visibility = "visible";
  window = $("#acfd_advertWindow").node();
  hide = mode == "rent" ? "display: table-row;" : "display: none";

  createSelectList();

  $(window).find('span[type="count"]').html(list.length);
  $(window).find('input[name="action"]').node().value = mode;
  $(window).find('span[name="action"]').text(text);
  $(window).find('tr[type="rent"]').attr("style", hide);
  $(window).class("remove", "hide");

  function createSelectList(){
    var code, i, length;

    code = '<option>Посмотреть список...</option>';
    for(i = 0, length = list.length; i < length; i++){
      code += `<option value="${list[i].id}">${i + 1}. ${list[i].name}</option>`;
    }

    $(window).find('select[name="iid"]').html(code);
  }
}


function renderBaseHTML(){
  var t;

  t = $t.items;
  t.setStructure({
    section: [200, "check", "Тип предмета"],
    name: [-1, "check", "Название предмета"],
    durability: [100, "number", "Прочность"],
    level: [80, "number", "Минимальный уровень"],
    cost: [125, "number", "Стоимость предмета"],
    refund: [125, "number", "Возврат с продажи"],
    sell: [75, "boolean", "Объявление, продажа|добавленные|тех что добавлены"],
    buy: [75, "boolean", "Объявление, покупка|добавленные|тех что добавлены"],
    rent: [75, "boolean", "Объявление, аредна|добавленные|тех что добавлены"],
    check: [45, null, null]
  });

  $('#header-items').html('@include: ./html/itemsTableHeader.html, true');
  $('#footer-items').html('@include: ./html/itemsTableFooter.html, true');

  t.setSizes();
  t.setSorts(renderItemsTable);
  t.setFilters(renderItemsTable);
  t.bindCheckAll();

  t = $t.adverts;
  t.setStructure({
    section: [200, "check", "Тип предмета"],
    name: [-1, "check", "Название предмета"],
    mod: [125, "check|boolean", "Модификтор|с модом|что с модом"],
    level: [80, "number", "Минимальный уровень"],
    action: [125, "multiple", "Тип объявления"],
    island: [140, "multiple", "Остров"],
    durNow: [70, "number|boolean", "Прочность текущая|новые предметы|новых предметов"],
    durMax: [70, "number", "Прочность максимальная"],
    termPost: [100, "number", "Срок размещения"],
    termRent: [80, "number", "Срок аредны"],
    date: [80, "date", "Дата создания, изменения"],
    price: [100, "number", "Цена предмета"],
    posted: [40, "boolean", "Размещенные на доске|размещенные|не размещенные"],
    autoPost: [40, "boolean", "Авто-продление объявления|с продлением|тех что с продлением"],
    check: [45, null, null]
  });

  $('#header-adverts').html('@include: ./html/advertsTableHeader.html, true');
  $('#footer-adverts').html('@include: ./html/advertsTableFooter.html, true');

  t.setSizes();
  t.setSorts(renderAdvertsTable);
  t.setFilters(renderAdvertsTable);
  t.bindCheckAll();
}

function renderItemsTable(mode){
  var table, items;

  table = $t.items;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    items = Object.keys($items.item);

    items.forEach((id)=>{
      table.pushContent(Create.item($items.item[id], $adverts));
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(true);
  });
}

function renderAdvertsTable(mode){
  var table, adverts;

  table = $t.adverts;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    adverts = Object.keys($adverts);

    adverts.forEach((id)=>{
      table.pushContent(Create.advert($adverts[id], $items.item[$adverts[id].id]));
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(true);
  });
}

function renderTables(){
  renderItemsTable();
  renderAdvertsTable();
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
      case "items":
        return '@include: ./html/itemsTableRow.html, true';
        break;
      case "adverts":
        return '@include: ./html/advertsTableRow.html, true';
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






function getItemsData(update){
  var sections, name;

  $items = $ls.load("gk_acfd_items");
  if($items.names == null || update){
    $items = {
      item: {},
      names: {}
    };
  }else{
    return;
  }

  sections = {
    names: []
  };

  ajax("http://www.ganjawars.ru/shopc.php", "GET", null).then((r)=>{
    $($answer)
      .html(r.text)
      .find('font:contains("Разделы")')
      .up('table')
      .find('a[href*="shopc.php"]')
      .nodeArr()
      .forEach((node)=>{
        name = node.textContent;
        sections[name] = node.href;
        sections.names.push(name);
    });

    getData(0, sections.names.length);
  });


  function getData(index, max){
    var table, data, url;

    if(index < max){
      url = sections.names[index];
      url = sections[url];

      ajax(url, "GET", null).then((r)=>{
        $($answer)
          .html(r.text)
          .find('td[width="800"]')
          .find('a[href*="item.php"]')
          .nodeArr()
          .forEach((node)=>{
            table = $(node).up('table').node();

            data = {};
            data.id = getID(node);
            data.name = getName();
            data.section = getSection();
            data.cost = getCost();
            data.refund = getRefund();
            data.durability = getDurability();
            data.level = getLevel();

            $items.item[data.id] = data;
            $items.names[data.name] = data.id;
          });

        index++;
        getData.gkDelay(750, null, [index, max]);
      });

      function getID(node){
        return node.href.split(/item_id=/)[1];
      }

      function getName(){
        return $(table).find('font').text();
      }

      function getSection(){
        return sections.names[index];
      }

      function getCost(){
        var cost;

        cost = $(table).find('b:contains("Стоимость:")').next('b').text();
        cost = cost.match(/(\d+)/)[1];
        cost = Number(cost);

        return cost;
      }

      function getRefund(){
        var refund;

        refund = data.cost / 10;
        refund = refund % 10 ? parseInt(refund, 10) + 1 : refund;
        refund = data.cost - refund;

        return refund;
      }

      function getDurability(){
        var durability;

        durability = $(table).find('b:contains("Прочность:")').node();
        durability = durability.nextSibling.textContent;
        durability = Number(durability);

        return durability;
      }

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
    }else{
      $ls.save("gk_acfd_items", $items);
      renderItemsTable();
    }
  }
}