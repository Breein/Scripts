require('./../../../js/protoDelay')();
var $ = require('./../../../js/dom');
var bindEvent = require('./../../../js/events');
var ajax = require('./../../../js/request');
var createTable = require('./../../../js/table');

const $ls = require('./../../../js/ls.js');
const $ico = require('./../src/icons.js');

var $answer, $items, $t;


$answer = $('<span>').node();

getItemsData();


addStyle();
createButton();
createGUI();

function addStyle(){
  var css, code;

  code = `
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

  code += '@include: ./html/index.css, true';
  code += '@include: ./../../css/filter.css, true';

  css = $("<style>")
    .attr("type", "text/css")
    .attr("script", "true")
    .html(code)
    .node();

  document.head.appendChild(css);
}

function createButton(){
  var button, node;

  node = $('a[href*="forum.php"]').node();
  button = $('<span>').html('@include: ./html/startButton.html, true').node();

  node.parentNode.insertBefore(button, node.nextSibling);
  bindEvent(button, "onclick", createGUI);

  $t = {
    items: createTable(["#header-items", "#content-items", "#footer-items", "#contextMenu"], "items", "gk_acfd_settings", $ico, "level")
  };
}

function createGUI(){
  var td;

  td = $('b[style="color: #990000"]:contains("Форум")').up('table').up('td');
  td = td.html('@include: ./html/baseGUI.html, true').node();

  $('td[class="tab"],[class="tab tabActive"]').nodeArr().forEach((tab)=>{
    bindEvent(tab, 'onclick', selectTabTable);
  });

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

function bindActionsContextMenu(gr){
  var actions, menu, table;

  menu = $('#contextMenu').node();

  actions = {
    addAdvert: (action, list, table)=>{
      switch(action){
        case "sell":
          console.log(action);
          break;

        case "buy":
          console.log(action);
          break;

        case "rent":
          console.log(action);
          break;
      }
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


function renderBaseHTML(){
  var t;

  t = $t.items;
  t.setStructure({
    section: [300, "check", "Тип предмета"],
    name: [-1, "check", "Название предмета"],
    durability: [125, "number", "Прочность"],
    level: [125, "number", "Минимальный уровень"],
    cost: [100, "number", "Стоимость предмета"],
    refund: [100, "number", "Возврат с продажи"],
    check: [45, null, null]
  });

  $('#header-items').html('@include: ./html/itemsTableHeader.html, true');
  $('#footer-items').html('@include: ./html/itemsTableFooter.html, true');

  t.setSizes();
  t.setSorts(renderItemsTable);
  t.setFilters(renderItemsTable);
  t.bindCheckAll();
}

function renderItemsTable(mode){
  var table, items;

  table = $t.items;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    items = Object.keys($items.item);

    items.forEach((item)=>{
      item = $items.item[item];
      item.check = false;
      table.pushContent(item);
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(true);
  });
}

function renderTables(){
  renderItemsTable();
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






function getItemsData(){
  var sections, name;

  $items = $ls.load("gk_acfd_items");
  if($items.names == null){
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
      console.log($items);
      $ls.save("gk_acfd_items", $items);
    }
  }
}