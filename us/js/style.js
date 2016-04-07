var $ = require('./dom.js');

/**
 * @param {string} name
 * @param {string} code
 */
module.exports = function(name, code){
  document.head.appendChild(
    $("<style>")
      .attr("type", "text/css")
      .attr("script", name)
      .html(code)
      .node()
  );
};
