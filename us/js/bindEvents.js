function Event(element, textEvent, callback, args, context, e){
  this._realCallback = null;
  this._element = element;
  this._textEvent = textEvent;
  this._callback = callback;
  this._args = args;
  this._context = context;
  this._e = e;

  this._bind();
}

Event.prototype = {
  _bind: function(){
    var index;

    if (!this._element) return;
    if(this._element.node) this._element = this._element.node();

    this._args == null ? this._args = [this._element] : this._args.push(this._element);
    if(!this._context) this._context = null;
    index = this._args.length;

    if(this._element.addEventListener){
      if(this._textEvent.substr(0, 2) == 'on') this._textEvent = this._textEvent.substr(2);

      this._element.addEventListener(this._textEvent, this._realCallback = (event)=>{
        if(this._e != null) this._args[index] = event;
        this._callback.apply(this._context, this._args);
      }, false);
    }else if(this._element.attachEvent){
      if(this._textEvent.substr(0, 2) != 'on') this._textEvent = 'on' + this._textEvent;

      this._element.attachEvent(this._textEvent, this._realCallback = (event)=>{
        if(this._e != null) this._args[index] = event;
        this._callback.apply(this._context, this._args);
      }, false);
    }
  },

  /**
   * @returns {Function}
   */
  getFunction: function(){
    return this._realCallback;
  },

  unBind: function(){
    this._element.removeEventListener(this._textEvent, this._realCallback, false);
  }
};

module.exports = function(element, textEvent, callback, args, context, e){
  return new Event (element, textEvent, callback, args, context, e)
};