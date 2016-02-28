function Pause(){
  this.work = true;
  this.cancel = false;
  this.func = null;
  this.args = [];
  this.context = null;
}

Pause.prototype = {
  /**
   * @param {Function} f
   * @param {[]=}a
   * @param {*=}c
   */
  freeze: function(f, a, c){
    this.func = f;
    this.args = a || [];
    this.context = c || null;
  },
  /**
   */
  unfreeze: function(){
    this.func.apply(this.context, this.args);
  },
  /**
   * @param {Function=} f
   * @param {[]=}a
   * @param {*=}c
   * @returns {boolean}
   */
  isActive: function(f, a, c){
    if(f != null){
      if(!this.work){
        this.freeze(f, a, c);
        return true;
      }else{
        return false;
      }
    }else{
      return !this.work;
    }
  },
  /**
   */
  activate: function(){
    this.work = false;
    //console.log("Pause!");
  },
  /**
   */
  deactivate: function(){
    this.work = true;
    this.unfreeze();
    //console.log("Resume!");
  },

  /**
   * @returns {boolean}
   */
  isStop: function(){
    if(this.cancel){
      this.cancel = false;
      return true;
    }else{
      return false;
    }
  },

  /**
   */
  stop: function(){
    this.cancel = true;
    this.work = true;
    //console.log("Cancel!");
  }
};

module.exports = new Pause();