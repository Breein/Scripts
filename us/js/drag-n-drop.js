var bindEvent = require('./bindEvents.js');
var $ls = require('./ls.js');

function DragNDrop(element, id, dragZone){
  this._inDrag = false;
  this._x = null;
  this._y = null;
  this._dragZone = dragZone;
  this._element = element;
  this._id = id;
  this._layer = window.document.body;
  this._dragEvent = null;
  this._left = 0;
  this._top = 0;
  this._data = {};

  this._load();
}

DragNDrop.prototype = {
  _dragStart: function(node, event){
    var pos, mx, my;

    if(event.button) return;

    if(!this._inDrag)
      this._dragEvent = bindEvent(this._layer, 'onmousemove', this._drag, [], this, true);

    this._inDrag = true;
    pos = this._element.getBoundingClientRect();

    mx = event.x || event.clientX;
    my = event.y || event.clientY;
    this._x = mx - pos.left;
    this._y = my - pos.top;
  },

  _drag: function(node, event){
    if(!this._inDrag) return;

    this._left = ( window.document.body.scrollLeft + ( event.x || event.clientX ) - this._x );
    this._top = ( window.document.body.scrollTop  + ( event.y || event.clientY ) - this._y );

    this._setCoordinates();
  },

  _setCoordinates: function(){
    this._element.style.left = this._left + 'px';
    this._element.style.top = this._top + 'px';
  },

  _dragStop: function(){
    this._inDrag = false;
    this._dragEvent.unBind();
    this._save();
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

  bind: function(){
    bindEvent(this._dragZone, 'onmousedown', this._dragStart, [], this, true);
    bindEvent(this._dragZone, 'onmouseup', this._dragStop, [], this);
    //window.document.ondragstart = function() { return false  };
    //window.document.body.onselectstart = function() { return false };
  }
};

module.exports = function(element, id, dragZone){
  return new DragNDrop(element, id, dragZone);
};