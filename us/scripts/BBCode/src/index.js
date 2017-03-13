var $ = require('./../../../js/dom.js');

const bindEvent = require('./../../../js/events.js');
const $ls = require('./../../../js/ls.js');
const setStyle = require('./../../../js/style.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var $data, $address, $node, $ISKey;

getData();
$address = location.pathname;
$ISKey = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if($address == "/messages.php" || $address == "/object-messages.php"){
  $node = $('b:contains("Новое сообщение:")');

  if($node.length){
    $node = $node.up('td').node();
    createBBCode_GUI($node, "");
  }
  replaceBBCode();
}

if($address == "/threads-new.php"){
  $node = $('td:contains("Текст сообщения:")').node();

  if($node) createBBCode_GUI($node, '<br><div style="width: 100%; height: 5px;"></div>');
}

if( $address == "/info.edit.php" || $address == "/syndicate.edit.php"){
  $ISKey = true;
  $node = $('textarea[name="about"],[name="synd_desc"]').node();

  if($node) {
    $node.style.width = "100%";
    createBBCode_GUI($node, '');
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createBBCode_GUI(node, extraHTML){
  var code, gui, html;

  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('bbCode.js', '@include: ./html/index.css, true');

  gui = $('<span>').node();
  html = '';
  if(extraHTML == "") node.setAttribute("valign", "middle");

  html += "&nbsp;&nbsp;" + extraHTML;

  if($data.mode || $ISKey)
    html += '<input type="button" value="b" title="Жирный" class="bb-b" />';
  if($data.mode || $ISKey)
    html += '<input type="button" value="u" title="Подчеркнутый" class="bb-b" />';
  html += '<input type="button" value="i" title="Курсив" class="bb-b" />';

  if($data.mode || $ISKey)
    html += '<input type="button" value="s" title="Зачеркнутый" class="bb-b" />';
  if($data.mode)
    html += '<input type="button" value="c" title="Центрированный" class="bb-b" />';
  html += '<input type="button" value="q" title="Цитата" class="bb-b" />';

  if($ISKey){
    html += '<input type="button" value="red" title="Красный" class="bb-bc" />';
    html += '<input type="button" value="green" title="Зеленый" class="bb-bc" />';
    html += '<input type="button" value="blue" title="Синий" class="bb-bc" />';
    html += '<input type="button" value="Space" title="Неубиваемый пробел" name="bb-sb" class="bb-bc" />';
    html += '<input type="button" value="©" title="Копирайт" name="bb-sb" class="bb-bc" />';
    html += '<input type="button" value="®" title="Охрана товара" name="bb-sb" class="bb-bc" />';
    html += '<input type="button" value="—" title="Тире" name="bb-sb" class="bb-bc" />';
    html += '<input type="button" value="™" title="Торговая марка" name="bb-sb" class="bb-bc" />';
    html += '<input type="button" value="°" title="Градус" name="bb-sb" class="bb-bc" />';
  }

  if(extraHTML == "")
    html += '<input type="button" value="@" title="Изменить режим работы скрипта" style="float: right;" class="bb-b" /> ';

  if($ISKey) html += "<br>";

  $(gui).html(html).find('input[type="button"]').each((button)=>{
    code = button.value;
    code = {
      open: "[" + code + "]",
      close: "[/" + code + "]"
    };

    if(button.name == "bb-sb"){
      code.open = button.value;
      code.close = "";
      if(button.value == "Space") code.open = " ";
    }

    bindEvent(button, 'onclick', insertBBCode, [code.open, code.close]);
  });

  if($ISKey){
    node.parentNode.insertBefore(gui, node.nextElementSibling);
    return;
  }
  node.appendChild(gui);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertBBCode(open, close){
  var input, text, clearText, start, stop, begin, cur;

  input = $('textarea[name="message"],[name="about"],[name="synd_desc"]').node();

  if(open == "[@]"){
    setData();
    return;
  }

  start = begin = input.selectionStart;
  stop = input.selectionEnd;
  clearText = input.value;
  text = "";

  if(start != stop){
    if(start == 0 && stop == clearText.length){
      clearText = open + clearText + close;
      input.value = clearText;
      input.focus();
      return;
    }else{
      text = clearText.substring(start, stop);
    }
  }

  start = clearText.substring(0, start);
  stop = clearText.substring(stop, clearText.length);
  text = open + text + close;
  cur = begin + text.length;
  clearText = start + text + stop;

  input.value = clearText;
  input.setSelectionRange(cur, cur);
  input.focus();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function replaceBBCode(){
  var posts, post, text;

  posts = $('b:contains("Автор")').up('table').node().rows;

  for(var i = 1, length = posts.length; i < length; i++){
    post = $(posts[i]).find('table[cellpadding="5"]').find('td');
    text = post.html();
    if($data.mode){
      text = text.replace(/\[b]/g, "<b>");
      text = text.replace(/\[\/b]/g, "</b>");

      text = text.replace(/\[u]/g, "<u>");
      text = text.replace(/\[\/u]/g, "</u>");

      text = text.replace(/\[s]/g, "<s>");
      text = text.replace(/\[\/s]/g, "</s>");

      text = text.replace(/\[c]/g, "<center>");
      text = text.replace(/\[\/c]/g, "</center>");

      if($address == "/object-messages.php"){
        text = text.replace(/\[i]/g, "<i>");
        text = text.replace(/\[\/i]/g, "</i>");

        text = text.replace(/\[q]/g, "<div style='background-color: #d0eed0; border: 1px dashed #66BB66; padding: 2px;'>");
        text = text.replace(/\[\/q]/g, "</div>");
      }
    }else{
      text = text.replace(/\[b]|\[\/b]|\[u]|\[\/u]|\[s]|\[\/s]|\[c]|\[\/c]|\[i]|\[\/i]|\[q]|\[\/q]/g, "");
    }
    post.html(text);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getData(){
  $data = $ls.load("gk_bbCode");

  if($data.mode == null){
    $data = {};
    $data.mode = true;
    $ls.save("gk_bbCode", $data);
  }
}

function setData(){
  $data.mode = !$data.mode;
  $ls.save("gk_bbCode", $data);
  location.reload();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////