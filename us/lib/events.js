module.exports = function bindEvent(element, event, callback) {
  if (!element) {
    return;
  }
  if (element.addEventListener) {
    if (event.substr(0, 2) == 'on') {
      event = event.substr(2);
    }
    element.addEventListener(event, callback, false);
  } else if (element.attachEvent) {
    if (event.substr(0, 2) != 'on') {
      event = 'on'+event;
    }
    element.attachEvent(event, callback, false);
  }
};