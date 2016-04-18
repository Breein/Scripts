const $ = require('./dom.js');
const setStyle = require('./style.js');
const bindEvent = require('./events.js');

function Shadow(){
  this._layer = null;
  this._width = 0;
  this._height = 0;

  this._insert();
  this._getSize();
}

Shadow.prototype = {
  _insert: function(){
    this._layer = $('#shadow-layer').node();
    if(this._layer) return;

    this._layer = $('<div>').attr('id', 'shadow-layer').node();
    document.body.appendChild(this._layer);

    bindEvent(this._layer, 'onclick', this.close, [], this);
  },

  _getSize: function(){
    var s, height;

    s = document.body.getBoundingClientRect();
    height = document.body.clientHeight;

    this._height = height > s.height ? height : s.height;
    this._width = s.width;
  },

  open: function(){
    this._layer.style.display = "block";
    this._layer.style.width = this._width + "px";
    this._layer.style.height = this._height + "px";
  },

  close: function(){
    if($('#progress-window').attr("state") != "done") return;

    this._layer.style.display = "none";
    $('*[class~="window"]').each((window)=>{
      $(window).class("add", "hide");
    });
  }
};

module.exports = function(){
  setStyle('shadow.js', '@include: ./../../css/shadow.css, true');
  return new Shadow();
};
