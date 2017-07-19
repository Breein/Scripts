var $ = require('./../../../js/dom.js');
var bindEvent = require('./../../../js/events.js');
var bindObserver = require('./../../../js/mutationObserver.js');
var setStyle = require('./../../../js/style.js');
var $dd= require('./../../../js/drag-n-drop.js');
var $resize = require('./../../../js/resize.js');


setStyle('common.js', '@include: ./../../css/common.css, true');
setStyle("extended_outland.js", '@include: ./html/index.css, true');

bindObserver($('body'), {childList: true}, some);


function some(){
  if($('#mapWindow').length) return;

  var $data, $sector, $gps, $sectors, $mod, $ds, $sid;

  $data = {
    scale: 1,
    map: {
      w: 588,
      h: 686,
      left: 50,
      top: 50,
      bs: 100
    },
    window: {
      w: 300,
      h: 300
    }
  };

  $ds = {
    sector: 98,
    w: 588,
    h: 686
  };

  $sector = getSector();
  $gps = getGPS();



  $sectors = {
    "Nou Lake" :      {x: 0, y: 3},
    "Shoretale":      {x: 0, y: 4},
    "Sector SA98":    {x: 1, y: 1},
    "Ejection Point": {x: 1, y: 2},
    "Dangerous xith": {x: 1, y: 3},
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

  $sid = $sectors[$sector];

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  render();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function render(){
    var mapWindow, mapContent, map, me, header, resize, scale;

    mapWindow = $('<div>').attr('id', 'mapWindow').html('@include: ./html/mapWindow.html, true').node();

    mapContent = $(mapWindow)
      .find('.map-content')
      .attr('style', `width: ${$data.window.w}px; height: ${$data.window.h}px;`)
      .node();

    map = $(mapContent).find('.map-outland').node();
    me = $(mapContent).find('.position-me').node();
    header = $(mapWindow).find('.map-header').node();
    resize = $(mapWindow).find('.map-resize').node();
    scale = $(mapWindow).find('#map-scale').node();

    if(!$gps){
      $(me).class('add', 'hidden');
    }

    calculatesMapPosition(map);
    calculatesMarkPosition(me, $gps);

    document.body.appendChild(mapWindow);


    bindEvent(mapContent, 'onwheel', scaleMap, [scale], null, true);

    $dd(mapWindow, 'mapWindow', header).bind();
    $resize(mapContent, 'mapContent', resize).bind([moveLayers, map, mapContent]);
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

    $(node).find('div[class*="position-"]').each((mark, index)=>{
      if(index == 0 && $gps)
        calculatesMarkPosition(mark, $gps);


    });
  }

  function calculatesMapPosition(map){
    var width, height, left, top, backgroundSize;

    width = $ds.w * $data.scale;
    height = $ds.h * $data.scale;

    if($data.scale < 1){
      $mod = width / 6 * $data.scale;
    }else{
      $mod = $ds.sector * $data.scale;
    }

    left = ($sid.x * $mod - $data.window.w / 2 + $mod / 2) * -1;
    top = ($sid.y * $mod - $data.window.h / 2 + $mod / 2) * -1;

    backgroundSize = 100 * $data.scale;
    if(backgroundSize > 100) backgroundSize = 100;

    $data.map.w = trimNumber(width);
    $data.map.h = trimNumber(height);
    $data.map.left = trimNumber(left);
    $data.map.top = trimNumber(top);
    $data.map.bs = trimNumber(backgroundSize);

    map.setAttribute('style', `left: ${$data.map.left}px; top: ${$data.map.top}px; width: ${$data.map.w}px; height: ${$data.map.h}px; background-size: ${$data.map.bs}%`);
  }

  function calculatesMarkPosition(mark, position){
    var left, top, scale;

    scale = $mod / $ds.sector;

    left = $data.window.w / 2 - $mod / 2 + position.x * scale - 7;
    top = ($data.window.h / 2 - $mod / 2 + position.y * scale - 7) - $data.map.h;

    left = trimNumber(left);
    top = trimNumber(top);

    mark.setAttribute('style', `left: ${left}px; top: ${top}px;`);
  }


  function moveLayers(nodes, width, height){
    var left, top, map, mapContent;

    $data.window.w = width < 150 ? 150 : width;
    $data.window.h = height < 150 ? 150 : height;

    map = nodes[0];
    mapContent = nodes[1];

    left = ($sid.x * $mod - $data.window.w / 2 + $mod / 2) * -1;
    top = ($sid.y * $mod - $data.window.h / 2 + $mod / 2) * -1;

    $data.map.left = trimNumber(left);
    $data.map.top = trimNumber(top);

    map.style.left = $data.map.left + 'px';
    map.style.top = $data.map.top + 'px';

    $(mapContent).find('div[class*="position-"]').each((mark)=>{
      calculatesMarkPosition(mark, $gps);
    });
  }




  //bindEvent(resize, 'onmousedown', startResize, [], null, true);
  //bindEvent(mapContent, 'onmousemove', doResize, [], null, true);
  //bindEvent(resize, 'onmouseup', stopResize);

  //bindEvent(mapContent, 'onmousemove', showInfo, [], null, true);

  //function createLabel(){
  //
  //}

  //function showInfo(node, event){
  //  var offsetX, offsetY, x, y, left, top;
  //
  //  console.log(event);
  //
  //  if(event.target.className == "map-label") return;
  //  offsetX = event.offsetX || event.layerX;
  //  offsetY = event.offsetY || event.layerY;
  //  x = (offsetX - offsetX % mod) / mod + sX;
  //  y = (offsetY - offsetY % mod) / mod + sY;
  //
  //  for(var name in $sectors){
  //    if($sectors[name].X == x && $sectors[name].Y == y){
  //      break;
  //    }
  //  }
  //
  //  left = 12 + (x - sX) * mod;
  //  top = 28 + (y - sY) * mod;
  //
  //  mapLabel.style.left = left + 'px';
  //  mapLabel.style.top = top + 'px';
  //  mapLabel.innerHTML = `<span>${name}</span>`;
  //
  //  console.log(`${x}, ${y}, ${name}, ${sX}, ${sY}, ${left}, ${top}`);
  //}

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
}