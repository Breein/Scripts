var $ = require('./../../../js/dom');
var bindEvent = require('./../../../js/events');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(isPrivateRealty()){
  addStyle();
  addButtons();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addStyle(){
  var css, code;

  code = '@include: ./html/index.css, true';
  css = $("style")
    .attr("type", "text/css")
    .attr("script", "true")
    .html(code)
    .node();

  document.head.appendChild(css);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addButtons(){
  var get, put, row, cGet, cPut;

  put = $('#store_items_div').node();
  get = $('#extract_items_div').node();

  $(get).find('input[type="checkbox"]').nodeArr().forEach((box)=>{
    insertNodes(box, 3, 0);
  });

  $(put).find('input[type="checkbox"]').nodeArr().forEach((box)=>{
    insertNodes(box, 0, 1);
  });

  row = $(get).find('table').node().rows[0];
  row.innerHTML += '<td class="checkCell" title="Выбрать все / Снять все" bgcolor="#d0f5d0" id="checkAllGet">√</td>';
  row = $(put).find('table').node().rows[0];
  row.innerHTML = '<td class="checkCell" title="Выбрать все / Снять все" bgcolor="#d0f5d0" id="checkAllPut">√</td>' + row.innerHTML;

  cGet = $('#checkAllGet').node();
  cPut = $('#checkAllPut').node();

  bindEvent(cGet, 'onclick', ()=>{checkingAll(cGet)});
  bindEvent(cPut, 'onclick', ()=>{checkingAll(cPut)});
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertNodes(box, insertIndex, itemIndex){
  var table, tr, td, value;

  tr = $(box).up('tr').node();
  tr.className = tr.cells[0].className;
  table = $(tr).up('table').node();

  $(tr).find('td').nodeArr().forEach((cell)=>{
    cell.removeAttribute("class");
  });

  value = getId(tr);

  if(itemIndex){
    tr.cells[itemIndex].innerHTML =
      `<img class="miniIcon icon-${itemIndex}" src="http://images.ganjawars.ru/img/items/${value}_s.jpg" />` + tr.cells[itemIndex].innerHTML;
  }else{
    tr.cells[itemIndex].innerHTML +=
      `<img class="miniIcon icon-${itemIndex}" src="http://images.ganjawars.ru/img/items/${value}_s.jpg" />`;
  }

  td = $('<td>')
    .attr("title", "Выбрать все этого типа / Снять все этого типа")
    .class("set", "checkCell")
    .html('√').node();

  tr.insertBefore(td, tr.cells[insertIndex]);
  bindEvent(td, "onclick", ()=>{checking(table, value, td)});
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checking(table, value, td){
  var type = td.className;

  $(table).find('tr').nodeArr().forEach((tr)=>{
    if(getId(tr) != value) return;

    if(/checkedCell/.test(type)){
      unCheckIt(tr);
    }else{
      checkIt(tr);
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkingAll(button){
  var rows = $(button).up('table').next('div').find('tr');

  if(/checkedCell/.test(button.className)){
    $(button).class("remove", "checkedCell");
    rows.nodeArr().forEach(unCheckIt);
  }else{
    $(button).class("add", "checkedCell");
    rows.nodeArr().forEach(checkIt);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkIt(tr){
  $(tr).find('td[class="checkCell"]').class("add", "checkedCell");
  $(tr).find('input[type="checkbox"]').node().checked = true;
  if(window.update_selector) update_selector();
}

function unCheckIt(tr){
  $(tr).find('td[class*="checkCell"]').class("remove", "checkedCell");
  $(tr).find('input[type="checkbox"]').node().checked = false;
  if(window.update_selector) update_selector();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getId(node){
  var id;

  id = $(node).find('a[href*="item_id="]').node().href;
  if(/&/.test(id)) id = id.split(/&/)[0];
  id = id.split(/item_id=/)[1];

  return id;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function isPrivateRealty(){
  var name;

  name = $('font[color="#990000"]:contains("Склад")');
  if(name.length) return true;
  name = $('font[color="#990000"]:contains("Частный дом")');
  if(name.length) return true;
  name = $('font[color="#990000"]:contains("Банк")');
  return !!name.length;
}