const $ = require('./dom.js');
const setStyle = require('./style.js');
const bindEvent = require('./events.js');
const $c = require('./common.js')();
const $pause = require('./pause.js');
const shadow = require('./shadow.js')();

function ProgressDisplay(callback){
  this._window = null;
  this._nodes = null;
  this._data = null;
  this._task = [];
  this._finished = false;
  this._callback = callback;
  this._insert();
  this._setNodes();
  this._reset();

  this._icon = {
    work: "data:image/gif;base64,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",
    pause: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAQMAAAD+JxcgAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAGUExURQAzAAAAAEPme5kAAAACdFJOU/8A5bcwSgAAABZJREFUCNdj+P//fwMDOiFTTwMC0yIAmbw/ozmt7gYAAAAASUVORK5CYII=",
    done: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAQMAAAD+JxcgAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAGUExURQAzAP///0NYXYsAAAACdFJOU/8A5bcwSgAAAFJJREFUCNdj+P//fwMDBvEcRBwGEY0gggFI/GNsYPj5h7mB4cMP9gaGBwX8DQwHFOSBBIM9kMtQD5RgAOr9wQgk/jADiX/sIKP4QcR8bHb8bwAAVCpFwPt0lwgAAAAASUVORK5CYII="
  }
}

ProgressDisplay.prototype = {
  _insert: function(){
    this._window = $('#progress-window').node(); if(this._window) return;
    this._window =
      $('<div>')
        .class("set", "window center-screen hide")
        .attr('id', "progress-window")
        .attr('state', "done")
        .html('@include: ./../../html/progressWindow.html, true')
        .node();

    document.body.appendChild(this._window);
  },

  _setNodes: function(){
    var rows, text, extra, time, queue, bar, buttons;

    rows = $(this._window).find('tr').nodes();
    text = $(rows[2]).find('span').nodes();
    extra = $(rows[3]).find('span').nodes();
    time = $(rows[4]).find('span').node();
    bar = $(rows[5]).find('div').nodes();
    queue = $(rows[6]).find('span').node();
    buttons = $(rows[7]).find('input').nodes();

    this._nodes = {
      main:{
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
        bar: bar[1],
        icon: bar[3]
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

    bindEvent(this._nodes.buttons.pause, 'onclick', this._doPause, [], this);
    bindEvent(this._nodes.buttons.cancel, 'onclick', this._doCancel, [], this);
  },

  _reset: function(){
    this._data = {
      main:{
        text: "",
        now: 0,
        max: 0
      },
      extra:{
        text: "",
        now: 0,
        max: 0
      },
      now: 0,
      max: 0,
      time: 0,
      queue: "",
      state: ""
    };

    this._nodes.buttons.pause.value = "Пауза";
    this._nodes.buttons.cancel.value = "Отмена";
    $pause.reset();
  },

  /**
   * @param {string} text
   * @param {Number|Number[]} count
   * @param {Number} interval
   * @param {Number=} max
   * @param {boolean=} extra
   */
  start: function(text, count, interval, max, extra){
    if(count[0] == null) count = [0, count];
    if(!extra){
      $(this._window).class("remove", "hide").attr("state", "work");
      shadow.open();
      this._reset();
      this._finished = false;
      this._data.main.text = text;
      this._data.main.now = count[0];
      this._data.main.max = count[1];
      this._data.max = max ? max : count[1];
      this._data.time = this._data.max * (interval + 500);
      this._data.state = "work";
      this._timeUpdate();
    }else{
      this._data.extra.text = text;
      this._data.extra.now = count[0];
      this._data.extra.max = count[1];
    }
    this._render(true);
  },

  /**
   * @param {boolean=} extra
   * @param {Number=} t
   */
  work: function(extra, t){
    !extra ? this._data.main.now++ : this._data.extra.now++;
    this._data.now++;
    this._correctTime(t);
    this._render();
  },

  /**
   */
  done: function(){
    this._finished = true;
    this._data.extra.text = "";
    this._data.state = "done";
    $(this._window).attr("state", "done");
    this._render(true);

    if(this._task.length) this._doTask();
  },

  /**
   * @param {Function} f
   * @param {Arguments} args
   * @returns {boolean}
   */
  isWork: function(f, args){
    return $pause.isStop(()=>{this._cancel()}) || $pause.isActive(f, args) ? true : false;
  },

  /**
   * @param {Function} f
   * @param {*[]}a
   * @param {string} d
   * @param {*[]=}s
   */
  addTask: function(f, a, d, s){
    this._task.push({
      func: f,
      args: a,
      desc: d,
      start: s
    });
  },

  _render: function(start){
    if(start){
      this._nodes.main.text.innerHTML = this._data.main.text;
      if(this._task.length){
        this._nodes.queue.tr.style.display = "table-row";
        this._nodes.queue.text.innerHTML = this._queue();
      }else{
        this._nodes.queue.tr.style.display = "none";
      }
      this._setStateIcon();
    }

    this._nodes.main.now.innerHTML = this._data.main.now;
    this._nodes.main.max.innerHTML = this._data.main.max;
    this._nodes.progress.bar.style.width = this._bar();

    if(this._data.extra.text != ""){
      if(start){
        this._nodes.extra.tr.style.display = "table-row";
        this._nodes.extra.text.innerHTML = this._data.extra.text;
      }
      this._nodes.extra.now.innerHTML = this._data.extra.now;
      this._nodes.extra.max.innerHTML = this._data.extra.max;
    }else{
      if(start) this._nodes.extra.tr.style.display = "none";
    }
  },

  _timeUpdate: function(){
    var p = this;
    if(this._finished == false){
      this._data.time = this._data.time - 1000;
      if(this._data.time < 0) this._data.time = 0;
      this._nodes.time.text.innerHTML = $c.getNormalTime(this._data.time);
      setTimeout(()=>{p._timeUpdate()}, 1000);
    }
  },

  _queue: function(){
    var text = "";

    this._task.forEach((task)=>{
      text += task.desc + ", ";
    });
    text = text == "" ? "-" : text.substring(0, text.length - 2);

    return text;
  },

  _bar: function(){
    return $c.getPercent(this._data.now, this._data.max, false) + "%";
  },

  _setStateIcon: function(){
    this._nodes.progress.icon.style.backgroundImage = `url(${this._icon[this._data.state]})`;
  },

  _cancel: function(){
    shadow.close();
    this._task = [];
    this.done();
    this._callback();
  },

  _doPause: function(){
    var t, s, f;

    if(this._data.state == "done") return;
    if($pause.isActive()){
      $pause.deactivate();
      t = "Пауза";
      s = "work";
      f = false;
    }else{
      $pause.activate();
      t = "Продолжить";
      s = "pause";
      f = true;
    }

    this._nodes.buttons.pause.value = t;
    $(this._window).attr("state", s);
    this._data.state = s;
    this._finished = f;
    this._setStateIcon();
    this._timeUpdate();
  },

  _doCancel: function(){
    if(this._data.state == "done") return;
    this._nodes.buttons.cancel.value = "Отменено";
    if(this._data.state == "pause"){
      this._cancel();
    }else{
      $pause.stop();
    }
  },

  _doTask: function(){
    var task, p;

    p = this;
    task = p._task.shift();
    setTimeout(()=>{
      if(task.start) p.start.apply(p, task.start);
      task.func.apply(null, task.args);
    }, 1200);
  },

  _correctTime(t){
    if(!t) return;
    if(t > 500){
      this._data.time = this._data.time + (t - 500);
    }else if(t < 500){
      this._data.time = this._data.time - (500 - t);
    }
  }
};

module.exports = function (callback){
  setStyle('progress.js', '@include: ./../../css/progressWindow.css, true');
  return new ProgressDisplay(callback);
};

