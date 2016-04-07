const $ = require('./dom.js');
const setStyle = require('./style.js');
const bindEvent = require('./events.js');

function ProgressDisplay(){
  this.window = null;
  this.nodes = null;
  this.insert();
  this.setNodes();
}

ProgressDisplay.prototype = {
  insert: function(){
    this.window =
      $('<div>')
        .class("set", "window center-screen")
        .attr('id', "progress-window")
        .html('@include: ./../../html/progressWindow.html, true')
        .node();

    document.body.appendChild(this.window);
  },

  setNodes: function(){
    var rows, text, extra, time, queue, bar, buttons;

    rows = $(this.window).find('tr').nodes();

    console.log(rows);

    text = $(rows[2]).find('span').nodes();
    extra = $(rows[3]).find('span').nodes();
    time = $(rows[4]).find('span').node();
    bar = $(rows[5]).find('div').nodes();
    queue = $(rows[6]).find('span').node();
    buttons = $(rows[7]).find('input').nodes();

    this.nodes = {
      text:{
        tr: rows[2],
        text: text[0],
        now: text[1],
        max: text[2]
      },
      extra:{
        tr: rows[3],
        text: extra[0],
        now: extra[1],
        max: extra[2]
      },
      time:{
        tr: rows[4],
        text: time
      },
      progress:{
        tr: rows[5],
        bar: bar[0],
        icon: bar[2]
      },
      queue:{
        tr: rows[6],
        text: queue
      },
      buttons:{
        tr: rows[7],
        pause: buttons[0],
        cancel: buttons[1]
      }
    };

    console.log(this.nodes);
  },

  start: function(){

  },

  work: function(){

  },

  done: function(){

  }
};

module.exports = function (){
  setStyle('progress.js', '@include: ./../../css/progressWindow.css, true');
  return new ProgressDisplay();
};

