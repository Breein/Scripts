/**
 *
 * @returns {object}
 */

module.exports = function(){
  var ts;

  ts = {
    player: {
      id: "id",
      name: "a",
      status: "b",
      date: "c",
      forums: "d"
    },
    forum: {
      id: "id",
      name: "a",
      sid: "b",
      posts: "c",
      words: "d",
      page: "e",
      themes: "f",
      log: "g"
    },
    theme:{
      id: "id",
      name: "a",
      author: "b",
      posts: "c",
      pages: "d",
      start: "e"
    },
    member: {
      id: "id",
      posts: "a",
      last: "b",
      start: "c",
      write: "d",
      words: "e",
      wordsAverage: "f",
      carma: "g",
      carmaAverage: "h",
      sn: "i",
      enter: "j",
      exit: "k",
      kick: "l",
      invite: "m"
    },
    timestamp: {
      id: "id",
      time: "a",
      data: "b"
    }
  };

  makeTS();

  return ts;

  function makeTS(){
    Object.keys(ts).forEach(function(t){
      Object.keys(ts[t]).forEach(function(key){
        ts[t][ts[t][key]] = key;
      });
    });
  }
};

