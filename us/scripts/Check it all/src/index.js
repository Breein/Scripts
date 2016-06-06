var $ = require('./../../../js/dom');
var bindEvent = require('./../../../js/events');
var setStyle = require('./../../../js/style.js');

var $ls = require('./../../../js/ls.js');

var $div, $timer, $settings, $tooltip, $data = {};

$div = {
  get:    $("#extract_items_div").node(),
  put:    $("#store_items_div").node(),
  other:  $('b:contains("Владелец")').node()
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(isPrivateRealty()){
  $settings = $ls.load("gk_CIA_settings");
  if($settings.mode == null){
    $settings = {
      mode: "new"
    };
    $ls.save("gk_CIA_settings", $settings);
  }

  if($div.other || $div.get || $div.put){
    addStyle();
    addTooltip();

    if($div.other){
      getOtherData();
      restyleTableNew("other");
    }else{
      getData("get");
      getData("put");

      if($settings.mode == "new"){
        restyleTableNew("get");
        restyleTableNew("put");
      }else{
        restyleTableOld();
      }
      addButtons();
      addModeButton();
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addStyle(){
  var css, code;

  code = $settings.mode == "new" ? "" : "#extract_items_div div tr:hover, #store_items_div div tr:hover {background-color: #bbe2bb;}";
  code += '@include: ./html/index.css, true';
  setStyle("check_it_all.js", code);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addModeButton(){
  var table, node;

  node = $('<td>').class("set", "switch-mode-button").attr("title", "Сменить режим отображения").node();
  table = $('a:contains("Забрать предметы из дома")').up('table').node();

  table.rows[0].insertBefore(node, table.rows[0].cells[1]);
  table.rows[1].cells[0].colSpan = "3";

  bindEvent(node, "onclick", switchMode);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function switchMode(){
  $settings.mode = $settings.mode == "new" ? "old" : "new";
  $ls.save("gk_CIA_settings", $settings);

  location.href = location.href + "";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addTooltip(){
  $tooltip = $('<div>')
    .attr("style", "left: 0; top: 0;")
    .attr("id", "CIA_tooltip")
    .class("set", "hide")
    .node();

  document.body.appendChild($tooltip);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function restyleTableOld(){
  $($div.get).find('input[type="checkbox"]').nodeArr().forEach((box, index)=>{
    insertNodes(box, 3, 0, index, "get");
  });

  $($div.put).find('input[type="checkbox"]').nodeArr().forEach((box, index)=>{
    insertNodes(box, 0, 1, index, "put");
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function restyleTableNew(type){
  var code, index, colspan, url, count, height, color;
  var rows, cells , length;

  count = 8;
  index = 0;
  code = "";

  color = false;
  length = $data[type].length;
  rows = parseInt(length / count, 10);
  height = type == "other" ? " other" : "";
  if($data[type].length % count) rows++;

  while(rows--){
    code += `<tr class="${color ? 'greengreenbg' : 'greenlightbg'}">`;
    color = !color;

    if(length - index > count){
      cells = count;
      colspan = null;
    }else{
      cells = length - index;
      colspan = count - cells;
    }
    while(cells--){
      url = ``;
      code += '@include: ./html/row.html, true';
      index++;
    }
    if(colspan) code += `<td colspan="${colspan}"></td>`;
    code += '</tr>';
  }

  if(!$div.other){
    if($data[type].length != 0){
      $($div[type])
        .find('div')
        .html(`<table align='center' width='100%'>${code}</table>`)
        .find('td[class="icon"]')
        .each((td, index)=>{
          bindEvent(td, 'onmouseenter', showTooltip, [index, type]);
          bindEvent(td, 'onmouseleave', hideTooltip);
          //bindEvent(td, 'onmouseover', showTooltip, [index, type]);
          //bindEvent(td, 'onmouseout', hideTooltip);
          bindEvent(td, 'onclick', checkingOne);
          bindEvent(td, 'ondblclick', checkingNew, [type]);
        });
    }
  }else{
    $($div.other)
      .up('table')
      .html(`<tr><td colspan="8" class="items-header">Предметы (${$data.other.length} шт.)</td></tr>` + code)
      .find('td[class="icon other"]')
      .each((td, index)=>{
        bindEvent(td, 'onmouseenter', showTooltip, [index, type]);
        bindEvent(td, 'onmouseleave', hideTooltip);
        //bindEvent(td, 'onmouseover', showTooltip, [index, type]);
        //bindEvent(td, 'onmouseout', hideTooltip);
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addButtons(){
  var row;

  if($data.get.length != 0){
    row = $($div.get).find('table').node().rows[0];
    row.innerHTML += '<td class="checkCell" title="Выбрать все / Снять все" bgcolor="#d0f5d0" id="checkAllGet">√</td>';

    bindEvent($('#checkAllGet'), 'onclick', checkingAll);
  }
  if($data.put.length != 0){
    row = $($div.put).find('table').node().rows[0];
    row.innerHTML = '<td class="checkCell" title="Выбрать все / Снять все" bgcolor="#d0f5d0" id="checkAllPut">√</td>' + row.innerHTML;

    bindEvent($('#checkAllPut'), 'onclick', checkingAll);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showTooltip(index, type, td){
  var size, info, sindicate;

  $timer = setTimeout(()=>{
    size = td.getBoundingClientRect();
    info = $data[type][index];

    if(info.owner.sid){
      sindicate = '@include: ./html/sIcon.html, true';
    }else{
      sindicate = '';
    }

    $tooltip.className = "no-hide";
    $tooltip.style.left = size.left + 52;
    $tooltip.style.top = size.top + document.body.scrollTop + 30;
    $tooltip.innerHTML = '@include: ./html/tooltip.html, true';

    if(type == "other"){
      $($tooltip).find('div[class="button"]').node().style.display = "none";
    }else{
      bindEvent($($tooltip).find('div[class="button"]'), 'onclick', checkingNew, [type, td]);
    }
  }, 1100);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function hideTooltip(){
  clearTimeout($timer);
  $tooltip.className = "hide";
}

function checkingOne(node){
  var box;

  box = $(node).find('input[type="checkbox"]').node();
  box.checked = !box.checked;
  box.checked ? $(node).class("add", "checked") : $(node).class("remove", "checked");
  if(window.update_selector) update_selector();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getData(type){
  var values = [];

  if($data[type] == null)
    $data[type] = [];

  $($div[type]).find('tr').each((row)=>{
    if(!row.cells[1]) return;

    values = type == "get" ?
      [row.cells[0], row.cells[1], row.cells[2]] :
      [row.cells[1], document.body, row.cells[0]];

    $data[type].push({
      item: getItem(values[0]),
      owner: getOwner(values[1]),
      box: values[2].innerHTML
    });
  });
  /////////////////////////////

  function getItem(node){
    var item, id, color, durability, mod;

    item = $(node).find('a[href*="item_id"]').node();

    durability = item.nextElementSibling;
    if(durability){
      durability = durability.textContent;
    }else{
      durability = item.nextSibling.textContent;
      durability = durability.match(/(.+)\[(.+)\/(.+)]/);
      durability = durability[2] + "/" + durability[3];
    }
    mod = node.textContent.match(/\[(\w+)]/g);
    mod = mod ? mod.join(" ") : "";
    color = item.style.color;
    id = item.href;
    if(/&/.test(id)) id = id.split(/&/)[0];
    id = id.split(/item_id=/)[1];

    return {
      name: item.textContent,
      href: item.href,
      id: id,
      color: color,
      durability: durability,
      mod: mod
    }
  }
  /////////////////////////////

  function getOwner(node){
    var owner, id, sid;

    owner = $(node).find('a[href*="info.php"]').node();
    id = Number(owner.href.split(/id=/)[1]);
    sid = $(node).find('a[href*="syndicate.php"]').node();
    if(sid) sid = Number(sid.href.split(/id=/)[1]);

    return {
      id: id,
      name: owner.textContent,
      href: owner.href,
      sid: sid
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getOtherData(){
  if($data.other == null)
    $data.other = [];

  $($div.other).up('table').find('tr').each((row)=>{
    $data.other.push({
      item: getItem(row),
      owner: getOwner(row.cells[1]),
      box: '<input type="checkbox" />'
    });
  }, 1);
  /////////////////////////////

  function getItem(tr){
    var item, id, color, durability, mod;

    item = $(tr.cells[0]).find('a[href*="item_id"]').node();
    durability = tr.cells[2].textContent;
    mod = tr.cells[0].textContent.match(/\[(\w+)]/g);
    mod = mod ? mod.join(" ") : "";
    color = "#990000";
    id = item.href;
    if(/&/.test(id)) id = id.split(/&/)[0];
    id = id.split(/item_id=/)[1];

    return {
      name: item.textContent,
      href: item.href,
      id: id,
      color: color,
      durability: durability,
      mod: mod
    };
  }
  /////////////////////////////

  function getOwner(node){
    var owner, id, sid;

    owner = $(node).find('a[href*="info.php"]').node();
    id = Number(owner.href.split(/id=/)[1]);
    sid = $(node).find('a[href*="syndicate.php"]').node();
    if(sid) sid = Number(sid.href.split(/id=/)[1]);

    return {
      id: id,
      name: owner.textContent,
      href: owner.href,
      sid: sid
    };
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertNodes(box, insertIndex, itemIndex, index, type){
  var table, tr, td, id;

  id = $data[type][index].item.id;
  tr = $(box).up('tr').node();
  tr.className = tr.cells[0].className;
  table = $(tr).up('table').node();

  $(tr).find('td').each((cell)=>{
    cell.removeAttribute("class");
  });

  if(itemIndex){
    tr.cells[itemIndex].innerHTML =
      `<img class="miniIcon icon-${itemIndex}" src="http://images.ganjawars.ru/img/items/${id}_s.jpg" />` + tr.cells[itemIndex].innerHTML;
  }else{
    tr.cells[itemIndex].innerHTML +=
      `<img class="miniIcon icon-${itemIndex}" src="http://images.ganjawars.ru/img/items/${id}_s.jpg" />`;
  }

  td = $('<td>')
    .attr("title", "Выбрать все этого типа / Снять все этого типа")
    .class("set", "checkCell")
    .html('√').node();

  tr.insertBefore(td, tr.cells[insertIndex]);
  bindEvent(td, "onclick", checkingOld, [type, id]);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkingOld(table, id, td){
  var type = /checked/.test(td.className);

  $($div[table]).find('div').find('tr').nodeArr().forEach((tr, index)=>{
    if($data[table][index].item.id != id) return;
    type ? action(tr, "remove", false) : action(tr, "add", true);
  });
}

function checkingNew(table, td){
  var type, index, id; clearSelection();

  type = /checked/.test(td.className);
  index = Number($(td).attr("index"));
  id = $data[table][index].item.id;

  $($div[table]).find('td[class*="icon"]').nodeArr().forEach((cell, index)=>{
    if($data[table][index].item.id != id) return;
    type ? action(cell, "remove", false) : action(cell, "add", true);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkingAll(button){
  var nodes, tag;

  tag = $settings.mode == "new" ? 'td[class*="icon"]' : 'tr';
  nodes = $(button).up('table').next('div').find(tag);

  if(/checked/.test(button.className)){
    $(button).class("remove", "checked");
    nodes.nodeArr().forEach((node)=>{action(node, "remove", false)});
  }else{
    $(button).class("add", "checked");
    nodes.nodeArr().forEach((node)=>{action(node, "add", true)});
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function action(node, action, state){
  var box, cell;

  cell = node.nodeName == "TR" ? $(node).find('td[class*="checkCell"]') : $(node);
  box = $(node).find('input[type="checkbox"]').node();

  if(box.checked != state) cell.class(action, "checked");
  box.checked = state;

  if(window.update_selector) update_selector();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function isPrivateRealty(){
  var name;

  name = $('font[color="#990000"]:contains("Склад")');
  if(name.length) return true;
  name = $('font[color="#990000"]:contains("Частный дом")');
  if(name.length) return true;
  name = $('font[color="#990000"]:contains("Банк")');
  return name.length != 0;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function clearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else { // старый IE
    document.selection.empty();
  }
}