var bindEvent = require('./bindEvents.js');
var $ls = require('./ls.js');

function Resize(element, id, resizeZone){
  this._inResize = false;
  this._x = null;
  this._y = null;
  this._resizeZone = resizeZone;
  this._element = element;
  this._id = id;
  this._layer = window.document.body;
  this._resizeEvent = [];
  this._width = 0;
  this._height = 0;
  this._data = {};
  this._content = null;
  this._callback = null;
  this._args = null;

  //this._load();
}

Resize.prototype = {
  _resizeStart: function(node, event){
    var pos, mx, my;

    if(event.button) return;

    if(!this._inResize){
      this._resizeEvent[0] = bindEvent(this._layer, 'onmousemove', this._resize, [], this, true);
      this._resizeEvent[1] = bindEvent(this._layer, 'onmouseup', this._resizeStop, [], this);
    }

    this._inResize = true;
    pos = this._element.getBoundingClientRect();

    mx = event.x || event.clientX;
    my = event.y || event.clientY;

    this._x = pos.left + (mx - pos.right);
    this._y = pos.top + (my - pos.bottom);
  },

  _resize: function(node, event){
    if(!this._inResize) return;
    var mx, my;

    mx = event.x || event.clientX;
    my = event.y || event.clientY;

    this._width = mx - this._x ;
    this._height = my - this._y ;
    this._setCoordinates();

    if(this._callback)
      this._callback.apply(null, [this._args, this._width, this._height]);
  },

  _setCoordinates: function(){
    if(this._width > 150)
    this._element.style.width = this._width + 'px';

    if(this._height > 150)
    this._element.style.height = this._height + 'px';
  },

  _resizeStop: function(){
    this._inResize = false;
    this._resizeEvent[0].unBind();
    this._resizeEvent[1].unBind();
    //this._save();
  },

  _load: function(){
    this._data = $ls.load('gk_dnd-positions');

    if(this._data[this._id] == null){
      this._save();
    }

    this._left = this._data[this._id][0];
    this._top = this._data[this._id][1];

    this._setCoordinates();
  },

  _save: function(){
    this._data[this._id] = [this._left, this._top];
    $ls.save('gk_dnd-positions', this._data);
  },

  bind: function(callback){
    if(callback){
      this._callback = callback[0];
      this._args = [callback[1], callback[2]];
    }

    bindEvent(this._resizeZone, 'onmousedown', this._resizeStart, [], this, true);
    //window.document.ondragstart = function() { return false  };
    //window.document.body.onselectstart = function() { return false };
  }
};

module.exports = function(element, id, resizeZone){
  return new Resize(element, id, resizeZone);
};