require('./../../../js/protoDelay.js')();

var $ = require('./../../../js/dom.js');
var bindEvent = require('./../../../js/events.js');
var ajax = require('./../../../js/request.js');

const $c = require('./../../../js/common.js')();


parseLogData();

var $data;

$data = {
  pts:{
    in:{},
    out:{},
    sum:{
      in: 0,
      out: 0
    }
  }
};

function parseLogData(){



  $('font[color="green"]').each((node)=>{
    var action, date;

    action = $(node).up('nobr').next('nobr').text();

    date = node.textContent.match(/(\d+)/g);
    date = `${date[1]}/${date[0]}/20${date[2]} ${date[3]}:${date[4]}`;
    date = Date.parse(date) / 1000;

    console.log(action);
  });
}