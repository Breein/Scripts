function GeneratorData(){
  this.object = null;
}

GeneratorData.prototype = {
  /**
   * @param {number} id
   * @returns {object}
   */
  player: function(id){
    return {
      id: id,
      name: "",
      status: 0,
      date: 0,
      forums: {},
      bl: 0,
      desc: 0,
      _ch: true
    }
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  forum: function(id){
    return {
      id: id,
      name: "",
      sid: 0,
      posts: 0,
      words: 0,
      page: [0, 0],
      themes: [0, 0],
      log: [0, 0],
      _ch: true
    }
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  theme: function(id){
    return {
      id: id,
      name: "",
      author: [0, ""],
      posts: [0, 0],
      pages: [0, 0],
      start: 0,
      _ch: true
    }
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  member: function(id){
    return {
      id: id,
      posts: 0,
      last: 0,
      start: [],
      write: [],
      words: 0,
      wordsAverage: 0,
      carma: 0,
      carmaAverage: 0,
      sn: 0,
      enter: 0,
      exit: 0,
      kick: 0,
      invite: 0,
      _ch: true
    }
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  timestamp: function(id){
    return {
      id: id,
      data: {},
      _ch: true
    }
  },

  /**
   * @param {{}} m - member (упакованный)
   * @param {{}} p - player (упакованный)
   * @param {{}=} mc - member-combine (упакованный)
   * @returns {{}}
   */
  characters: function(m, p, mc){
    var member, sNumber, enter, exit, kick, invite;

    if(mc){
      member = mc.i != 0;
      sNumber = mc.i;
      enter = mc.j;
      exit = mc.k;
      kick = mc.l;
      invite = mc.m;
    }else{
      member = m.i != 0;
      sNumber = m.i;
      enter = m.j;
      exit = m.k;
      kick = m.l;
      invite = m.m;
    }

    return {
      id: m.id,
      name: p.a,
      member: member,
      status: p.b,
      date: p.c,
      posts: m.a,
      lastMessage: m.b,
      starts: m.c,
      start: m.c.length,
      writes: m.d,
      write: m.d.length,
      words: m.e,
      wordsAverage: m.f,
      carma: m.g,
      carmaAverage: m.h,
      sNumber: sNumber,
      enter: enter,
      exit: exit,
      kick: kick,
      invite: invite,
      bl: p.e != 0,
      check: false
    };
  },

  /**
   * @param {{}} t - theme (упакованный)
   * @returns {{id:number, name:string, author:[number,string], start:number, postsNew:number, postsDone:number, postsAll:number, pageAll:number}}
   */
  thread: function(t){
    return {
      id: t.id,
      name: t.a,
      author: [t.b[0], t.b[1]],
      start: t.e,
      postsNew: t.c[1] - t.c[0],
      postsDone: t.c[0],
      postsAll: t.c[1],
      pageAll: t.d[1],
      check: false
    };
  },

  /**
   * @param {{}} t
   * @returns {{id: number, name: string, date: number, desc: number|string, checked: boolean}}
   */
  blackList: function(t){
    return {
      id: t.id,
      name: t.a,
      date: t.e,
      desc: t.f,
      check: false
    };
  },

  /**
   * @param {Array|{}=} a
   * @param {Array=} b
   * @returns {[number,...]}
   */
  stamp: function(a, b){
    var aa = [];
    if(a == null){
      return [0, 0, 0, 0, 0, 0, 0];
    }else{
      if(a[0] == null){
        aa[0] = a.a; aa[1] = a.c; aa[2] = a.d;
        aa[3] = a.e; aa[4] = a.f; aa[5] = a.g;
        aa[6] = a.h; a = aa;
      }
      a[0] += b[0]; a[1] += b[1]; a[2] += b[2];
      a[3] += b[3]; a[4] += b[4]; a[5] += b[5];
      a[6] += b[6];

      return a;
    }
  }
};

/**
 * @returns {GeneratorData}
 */
module.exports = function(){
  return new GeneratorData();
};
