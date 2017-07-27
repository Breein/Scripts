var $ = require('./../../../js/dom.js');
var bindEvent = require('./../../../js/bindEvents.js');
var bindObserver = require('./../../../js/mutationObserver.js');
var setStyle = require('./../../../js/style.js');
var $dd= require('./../../../js/drag-n-drop.js');
var $resize = require('./../../../js/resize.js');


setStyle('common.js', '@include: ./../../css/common.css, true');
setStyle("extended_outland.js", '@include: ./html/index.css, true');

bindObserver($('body'), {childList: true}, some);

var $data, $sectors;

$data = {
  scale: 1,
  map: {
    w: 588,
    h: 686,
    left: 0,
    top: 0,
    bs: 100
  },
  window: {
    w: 300,
    h: 300
  },
  point:{
    x: 0,
    y: 294,
    follow: true
  }
};

$sectors = {
  "Nou Lake" :      {x: 0, y: 3},
  "Shoretale":      {x: 0, y: 4},
  "Sector SA98":    {x: 1, y: 1},
  "Ejection Point": {x: 1, y: 2},
  "Dangerous Xith": {x: 1, y: 3},
  "Second Path":    {x: 1, y: 4},
  "West Cape":      {x: 2, y: 0},
  "Raged Land":     {x: 2, y: 1},
  "Spherix point":  {x: 2, y: 2},
  "Eye of Glory":   {x: 2, y: 3},
  "Chelby":         {x: 2, y: 4},
  "Tiger Lairs":    {x: 2, y: 5},
  "South Tibet":    {x: 2, y: 6},
  "North Beach":    {x: 3, y: 0},
  "Alpha Three":    {x: 3, y: 1},
  "Aikon":          {x: 3, y: 2},
  "Thordendal":     {x: 3, y: 3},
  "Tracid Line":    {x: 3, y: 4},
  "Hypercube":      {x: 3, y: 5},
  "Abbey road":     {x: 4, y: 0},
  "Army Base":      {x: 4, y: 1},
  "South Normand":  {x: 4, y: 2},
  "Por Eso One":    {x: 4, y: 3},
  "Freestates":     {x: 4, y: 4},
  "World`s Corner": {x: 4, y: 5},
  "Threeforce":     {x: 5, y: 0},
  "Overlord Point": {x: 5, y: 1},
  "East Cape":      {x: 5, y: 2}
};

function some(){
  if($('#mapWindow').length) return;

  var $sector,$marks, $mod, $ds, $sid;

  $ds = {
    sector: 98,
    w: 588,
    h: 686
  };

  $sector = getSector();
  $sid = $sectors[$sector];

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function render(){
    var mapWindow, mapContent, map, marks, header, resize, scale;

    mapWindow = $('<div>').attr('id', 'mapWindow').html('@include: ./html/mapWindow.html, true').node();

    mapContent = $(mapWindow)
      .find('.map-content')
      .attr('style', `width: ${$data.window.w}px; height: ${$data.window.h}px;`)
      .node();

    map = $(mapContent).find('.map-outland').node();
    header = $(mapWindow).find('.map-header').node();
    resize = $(mapWindow).find('.map-resize').node();
    scale = $(mapWindow).find('#map-scale').node();
    marks = $(mapWindow).find('#map-marks').node();

    calculatesMapPosition(map);
    createMarks(marks);
    createLabel(map);
    setFollow(mapWindow, $data.point.follow);

    $(marks).find('div[class*="position-"]').each((nodeMark, index)=>{
      calculatesMarkPosition(nodeMark, $marks[index]);
    });

    document.body.appendChild(mapWindow);


    bindEvent(mapContent, 'onwheel', scaleMap, [scale], null, true);
    bindEvent(map, "onmousedown", moveMap, [], null, true);

    $dd(mapWindow, 'mapWindow', header).bind();
    $resize(mapContent, 'mapContent', resize).bind([moveLayers, map]);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function createMarks(marks){
    var safes, code, gps;

    $marks = [];
    gps = getGPS();
    code = '';

    if(gps){
      $marks.push({
        x: 35, //gps.x,
        y: 65, //gps.y,
        name: 'North Beach',//$sector,
        info: "Я здесь",
        type: 'me'
      });

      code += `<div class="position-me" title="Я здесь"></div>`;
    }


    $marks.push({
      x: 35, //gps.x,
      y: 65, //gps.y,
      name: 'North Beach',//$sector,
      info: "Я здесь",
      type: 'safe'
    });

    code += `<div class="position-safe" title="Я здесь"></div>`;

    safes = $('td:contains("~ лежит Сейф ")');

    if(safes.length){
      safes = safes.html().split('Важно:');

      if(safes){
        safes = safes[1].split('</td>')[0];
        safes = safes.split('<br>');

        safes.forEach((safe)=>{
          safe = safe.match(/В секторе (.+) \[(\d+),(\d+)] лежит Сейф с (.+) Гб/);

          if(safe){
            $marks.push({
              x: Number(safe[2]),
              y: Number(safe[3]),
              name: safe[1],
              info: safe[4],
              type: 'safe'
            });

            code += `<div class="position-safe" title="${safe[4]} гб."></div>`;
          }
        });
      }
    }

    marks.innerHTML += code;
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function moveMap(map, event){
    var moveEvent, stopEvent, inMove, offset, mx, my;

    mx = event.x || event.clientX;
    my = event.y || event.clientY;

    moveEvent = bindEvent(window.document.body, 'onmousemove', move, [map], null, true);
    stopEvent = bindEvent(window.document.body, 'onmouseup', stopMove, [map]);
    inMove = true;

    $(map).class('add', 'move');

    offset = {
      left: mx - $data.map.left,
      top: my - $data.map.top
    };

    function move(map, node, event){
      var mx, my;

      if(!inMove) return;

      mx = event.x || event.clientX;
      my = event.y || event.clientY;

      $data.map.left = mx - offset.left;
      $data.map.top = my - offset.top;

      map.style.left = $data.map.left + 'px';
      map.style.top = $data.map.top + 'px';
    }

    function stopMove(){
      var left, top, scale;

      if(inMove){
        inMove = false;
        moveEvent.unBind();
        stopEvent.unBind();

        $(map).class('remove', 'move');

        left = $data.map.left;
        top = $data.map.top;

        scale = $mod / $ds.sector;
        $data.point.x = trimNumber((($data.window.w / 2) - left) / scale);
        $data.point.y = trimNumber((($data.window.h / 2) - top) / scale);

        setFollow($('.map-footer').node(), false);
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function scaleMap(scale, node, event){
    var map, speed;

    event.preventDefault();
    map = $(node).find('.map-outland').node();

    speed = 0.05;
    if($data.scale >= 1.5) speed = 0.1;
    if($data.scale >= 2) speed = 0.25;

    if(event.deltaY < 0){
      if($data.scale >= 3) return;
      $data.scale = trimNumber($data.scale + speed);
    }else{
      if($data.scale <= 0.7) return;
      $data.scale = trimNumber($data.scale - speed);
    }

    scale.innerHTML = Math.round($data.scale * 100);
    calculatesMapPosition(map);
    moveLabels(map);

    $(node).find('div[class*="position-"]').each((mark, index)=>{
        calculatesMarkPosition(mark, $marks[index]);
    });
  }

  function setFollow(window, mode){
    var box, state;

    box = $(window).find('input[type="checkbox"]').node();
    state = mode == 'auto' ? !box.checked : mode;

    box.checked = state;
    $data.point.follow = state;

    if(mode == "auto"){
      //calculatesMapPosition(map);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function calculatesMapPosition(map){
    var width, height, left, top, backgroundSize, scale;

    width = $ds.w * $data.scale;
    height = $ds.h * $data.scale;

    $mod = $data.scale < 1 ? width / 6 * $data.scale : $ds.sector * $data.scale;

    if($data.point.follow){
      $data.point.x = $sid.x * 98 + 49;
      $data.point.y = $sid.y * 98 + 49;
    }

    scale = $mod / $ds.sector;
    left = ($data.window.w / 2) - ($data.point.x * scale);
    top = ($data.window.h / 2) - ($data.point.y * scale);

    backgroundSize = 100 * $data.scale;
    if(backgroundSize > 100) backgroundSize = 100;

    $data.map.w = trimNumber(width);
    $data.map.h = trimNumber(height);
    $data.map.left = trimNumber(left);
    $data.map.top = trimNumber(top);
    $data.map.bs = trimNumber(backgroundSize);

    map.setAttribute('style', `left: ${$data.map.left}px; top: ${$data.map.top}px; width: ${$data.map.w}px; height: ${$data.map.h}px; background-size: ${$data.map.bs}%`);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function calculatesMarkPosition(nodeMark, mark){
    var left, top, scale;

    console.log(mark);

    scale = $mod / $ds.sector;

    left = $sectors[mark.name].x * $mod;
    top = $sectors[mark.name].y * $mod;

    left = left + mark.x * scale - 7;
    top = top + mark.y * scale - 7;

    left = trimNumber(left);
    top = trimNumber(top);

    nodeMark.setAttribute('style', `left: ${left}px; top: ${top}px;`);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function moveLayers(nodes, width, height){
    var left, top, map, scale;

    $data.window.w = width < 150 ? 150 : width;
    $data.window.h = height < 150 ? 150 : height;

    map = nodes[0];

    scale = $mod / $ds.sector;
    left = ($data.window.w / 2) - ($data.point.x * scale);
    top = ($data.window.h / 2) - ($data.point.y * scale);

    $data.map.left = trimNumber(left);
    $data.map.top = trimNumber(top);

    map.style.left = $data.map.left + 'px';
    map.style.top = $data.map.top + 'px';
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function createLabel(map){
    var sector, name, labels, style, left, top;

    labels = '';

    for(name in $sectors){
      sector = $sectors[name];
      left = trimNumber(sector.x * $mod);
      top = trimNumber(sector.y * $mod);

      style = `style="left: ${left}px; top: ${top}px; width: ${$mod}px; height: ${$mod}px;"`;

      labels += `<div class="map-label" ${style}><span>${name}</span></div>`;
    }

    $(map).find('#map-labels').html(labels);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function moveLabels(map){
    var name, sector, left, top;

    $(map).find('.map-label').each((label)=>{
      name = label.firstElementChild.textContent;
      sector = $sectors[name];
      left = trimNumber(sector.x * $mod);
      top = trimNumber(sector.y * $mod);

      label.setAttribute('style', `left: ${left}px; top: ${top}px; width: ${$mod}px; height: ${$mod}px;`);
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function getSector(){
    return $('nobr:contains("~Сектор:")').find('b').text();
  }

  function getGPS(){
    var gps;

    gps = $('b:contains("~GPS:")').find('font').text();
    if(!gps) return null;
    gps = gps.split(',');
    gps = {x: Number(gps[0]), y: Number(gps[1])};

    return gps;
  }

  function trimNumber(number){
    return Number(number.toFixed(2));
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}