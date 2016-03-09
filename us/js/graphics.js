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

  this.colors = ['#526B12', '#265185', '#A0241A', '#FCD873', '#0099FF', '#E896E9', '#EFEE52', '#0B2B5C', '#E9D2D4', '#869DD5', '#ADD338'];
  this.dataX = [];
  this.dataY = [];
  this.data = {};
  this.max = 0;
}

Graphics.prototype = {

  processingData: function(){
    var cells, max = 0;
    var i, length;
    var maxString, maxResidue;

    this.dataX = [];
    this.dataY = [];

    Object.keys(this.data).forEach((key)=>{
      this.dataX.push(key);
      cells = this.data[key];
      Object.keys(cells).forEach((k, index)=>{
        if(this.dataY[index] == null) this.dataY[index] = [];
        if(max < cells[k]) max = cells[k];
        this.dataY[index].push(cells[k]);
      });
    });

    maxString = '4';
    maxResidue = '1';

    for(i = 0, length = (max.toString()).length - 2; i < length; i++){
      maxString += '0';
      maxResidue += '0';
    }

    max += Number(maxString);
    this.max = max - (max % Number(maxResidue));
  },

  draw: function(data){
    this.data = {};
    this.data = data;

    //BID('mainSenseDiv_' + iTab).innerHTML = '';
    this.ctx.clearRect(0, 0, this.width + 10, this.height);

    this.ctx.rect(50, 1, this.w, this.height - 42);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();

    this.processingData();
    this.drawGridY(this.max);
    this.drawGridX();

    this.dataY.forEach((data, index)=>{
      this.drawLine(data, this.colors[index], this.max);
    });
  },

  drawGridX: function(){
    var step, text;
    var i, length = this.dataX.length;

    step = parseFloat((this.w / (length - 1)).toFixed(1));
    this.ctx.beginPath();
  
    for(i = 0; i < length; i++){
      this.ctx.moveTo((i * step) + 50, 0);
      this.ctx.lineTo((i * step) + 50, this.h - 20);
  
      text = $c.getNormalDate(this.dataX[i]).d;
      //text = text.d + ", " + text.t;
  
      this.ctx.font = "10pt Calibri";
      this.ctx.fillText(text, (i * step) + 50, this.h + 5);
    }
  
    this.ctx.lineWidth = 0.8;
    this.ctx.strokeStyle = "#c0c0c0";
    this.ctx.stroke();
    this.ctx.closePath();
  },

  drawGridY: function(maxValue){
    var step = parseFloat(((this.h - 20) / this.lines).toFixed(1));
    var stepNum = maxValue / this.lines;
    var n = 0;
  
    this.ctx.beginPath();
  
    for(var i = 1; i < this.lines; i++){
      this.ctx.moveTo(50, step * i);
      this.ctx.lineTo((this.w + 50), step * i);
  
      n = Math.round((maxValue - (i * stepNum)));
  
      this.ctx.textAlign = "center";
      this.ctx.font = "10pt Calibri";
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(n.toString(), 25, (step * i) + 3);
    }
  
    this.ctx.lineWidth = 0.8;
    this.ctx.strokeStyle = "#c0c0c0";
    this.ctx.stroke();
    this.ctx.closePath();
  },

  drawLine: function(data, color, maxValue){
    var step, percent, p;
    var i, count;

    count = data.length;
    step = parseFloat((this.w / (count - 1)).toFixed(1));
    percent = (this.h - 20) / maxValue;

    p = [{x: 50, y: (this.h - 20) - (data[0] * percent)}];
  
    this.ctx.beginPath();
    this.ctx.moveTo(p[0].x, p[0].y);
    for(i = 1; i < count; i++){
      p.push({x: (i * step) + 50, y: (this.h - 20) - (data[i] * percent)});
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