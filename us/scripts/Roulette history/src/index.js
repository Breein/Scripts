var $ = require('./../../../js/dom');
const $ls = require('./../../../js/ls.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(location.href == "http://sidio.ru/rul/last.php?s=72"){
  collectData();
}

if(location.search.match(/\?results=\[(.+)]/)){
  saveData();
}

if(location.href == "http://www.ganjawars.ru/roulette.php"){
  getDataFromFrame();
  setTimeout(waitForDone, 50);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function collectData(){
  var results;

  results = [];

  $('span').each((node)=>{
    results.push(Number(node.textContent));
  });
  results.reverse();
  results = JSON.stringify(results);

  location.href = "http://www.ganjawars.ru/roulette.php?results=" + results;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDataFromFrame(){
  var nowGame, game;

  nowGame = $('a:contains("~Результат прошлой игры")').node();

  if(nowGame){
    game = $ls.load("gk_rh_game")[0];
    nowGame = Number(nowGame.href.match(/(\d+)/)[1]);

    if(game != nowGame){
      $ls.save("gk_rh_game", [nowGame, false]);
      document.body.appendChild(
        $('<iframe>')
          .attr('src', 'http://sidio.ru/rul/last.php?s=72')
          .attr('style', 'display: none;')
          .attr('id', 'rh_frame')
          .node()
      );
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function waitForDone(){
  var frame;

  if($ls.load("gk_rh_game")[1]){
    frame = $("#rh_frame").node();
    if(frame) document.body.removeChild(frame);
  }else{
    setTimeout(waitForDone, 25);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveData(){
  var results, game;

  results = location.search.match(/\?results=(.+)/)[1];
  game = $ls.load("gk_rh_game");
  game[1] = true;

  localStorage.setItem("gk_rh_data", results);
  $ls.save("gk_rh_game", game);
}
