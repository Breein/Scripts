function Pause(){
  this.work = true;
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
   * @returns {boolean}
   */
  isActive: function(){
    return !this.work;
  },
  /**
   */
  activate: function(){
    this.work = false;
    console.log("Pause!");
  },
  /**
   */
  deactivate: function(){
    this.work = true;
    this.unfreeze();
    console.log("Resume!");
  }
};

module.exports = new Pause();