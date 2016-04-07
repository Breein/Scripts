var $ = require('./dom.js');
const $c = require('./common.js')();

function Graphics(id, w, h, step){
  this.node = $(id).node();
  this.node.width = w;
  this.node.height = h;

  this.ctx = this.node.getContext("2d");
  this.width = w;
  this.height = h;
  this.step = step;
  this.w = this.width - 75;
  this.h = this.height - 20;
  this.lines = parseInt(this.h / this.step, 10);

  this.rect = {
    x: 50,
    y: 5,
    xx: this.w,
    yy: this.h - 20
  };

  this.colors = ['#526B12', '#265185', '#A0241A', '#FCD873', '#0099FF', '#E896E9', '#EFEE52', '#0B2B5C', '#E9D2D4', '#869DD5', '#ADD338'];
  this.dataX = [];
  this.dataY = [];
  this.data = {};
  this.show = [];
  this.max = 0;
  this.min = 0;
}

Graphics.prototype = {

  processingData: function(){
    var cells, max = 0, min = 0;

    this.dataX = [];
    this.dataY = [];

    Object.keys(this.data).forEach((key)=>{
      this.dataX.push(key);
      cells = this.data[key];
      Object.keys(cells).forEach((k, index)=>{
        if(this.show[index]){
          if(this.dataY[index] == null) this.dataY[index] = [];
          if(max < cells[k]) max = cells[k];
          if(min > cells[k]) min = cells[k];
          this.dataY[index].push(cells[k]);
        }
      });
    });

    this.max = getRound(max, false);
    this.min = min == 0 ? 0 : getRound(min, true);

    function getRound(value, negative){
      var string, residue;
      var i, length;

      string = '4';
      residue = '1';
      if(negative) value = Math.abs(value);

      for(i = 0, length = (value.toString()).length - 2; i < length; i++){
        string += '0';
        residue += '0';
      }
      value += Number(string);
      value = value - (value % Number(residue));

      return value;
    }
  },

  draw: function(data, show){
    this.data = {};
    this.data = data;
    this.show = show;

    this.ctx.clearRect(0, 0, this.width + 10, this.height);

    this.ctx.rect(this.rect.x, this.rect.y, this.rect.xx, this.rect.yy);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();

    this.processingData();
    this.drawGridY();
    this.drawGridX();

    this.dataY.forEach((data, index)=>{
      this.drawLine(data, this.colors[index], this.max);
    });
  },

  drawGridX: function(){
    var step, text, x, y, ty;
    var i, length = this.dataX.length;

    step = parseFloat((this.w / (length - 1)).toFixed(1));
    y = this.rect.yy + this.rect.y;
    ty = y + 20;

    this.ctx.beginPath();
    this.ctx.font = "10pt Calibri";
    this.ctx.lineWidth = 0.8;
    this.ctx.strokeStyle = "#c0c0c0";
  
    for(i = 0; i < length; i++){
      x = i * step + this.rect.x;
      text = $c.getNormalDate(this.dataX[i]).d;

      this.ctx.moveTo(x, this.rect.y);
      this.ctx.lineTo(x, y);
      this.ctx.fillText(text, x, ty);
    }

    this.ctx.stroke();
    this.ctx.closePath();
  },

  drawGridY: function(){
    var step, stepNum, value;
    var lineStart, lineStop, textStart, y;

    value = 0;
    step = this.rect.yy / this.lines;
    step = parseFloat(step.toFixed(1));
    stepNum = (this.max + this.min) / this.lines;

    lineStart = this.rect.x;
    lineStop = this.rect.x + this.rect.xx;
    textStart = 25;
  
    this.ctx.beginPath();
    this.ctx.textAlign = "center";
    this.ctx.font = "10pt Calibri";
    this.ctx.fillStyle = 'black';

    this.ctx.fillText(this.max, textStart, this.rect.y + 5);

    for(var i = 1; i < this.lines; i++){
      value = Math.round((this.max - i * stepNum));
      y = step * i + this.rect.y;

      this.ctx.moveTo(lineStart, y);
      this.ctx.lineTo(lineStop, y);
      this.ctx.fillText(value, textStart, y + 3);
    }
    this.ctx.fillText(this.min > 0 ? "-" + this.min : "" + this.min, textStart, this.rect.y + this.rect.yy);
  
    this.ctx.lineWidth = 0.8;
    this.ctx.strokeStyle = "#c0c0c0";
    this.ctx.stroke();
    this.ctx.closePath();
  },

  drawLine: function(data, color){
    var step, percent, p;
    var i, count;

    count = data.length;
    step = parseFloat((this.w / (count - 1)).toFixed(1));
    percent = (this.h - 20) / (this.max + this.min);

    p = [{x: 50, y: (this.h - 20) - ((data[0] + this.min) * percent)}];
  
    this.ctx.beginPath();
    this.ctx.moveTo(p[0].x, p[0].y);
    for(i = 1; i < count; i++){
      p.push({x: (i * step) + 50, y: (this.h - 20) - ((data[i] + this.min) * percent)});
      this.ctx.lineTo(p[i].x, p[i].y);
    }
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
  
    for(i = 0; i < count; i++){
      this.ctx.beginPath();
      this.ctx.arc(p[i].x, p[i].y, 4, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
      this.ctx.closePath();
  
      //createSenseTile(x[i] + canvas[iTab].left, y[i] + canvas[iTab].top, 'st_' + line + '_' + i + '_' + iTab, label + ': ' + data[i], iTab);
  
      //tId = BID('st_' + line + '_' + i + '_' + iTab);
      //bindEvent(tId, 'mousemove', (function(text_){return function(event){showTooltip(event, text_)}})(tId.alt));
      //bindEvent(tId, 'mouseout', hideTooltip);
    }
  }

};

/**
 * @param {string} id
 * @param {number} w
 * @param {number} h
 * @param {number} step
 * @returns {Graphics}
 */
module.exports = function(id, w, h, step){
  return new Graphics(id, w, h, step);
};