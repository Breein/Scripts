module.exports = function (url, method, param) {
  return new Promise((onsuccess, onfailure) => {
    var request = new XMLHttpRequest();
    var time = new Date().getTime();

    request.open(method, url, true);
    if (method == 'POST') request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(param);

    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        time = new Date().getTime() - time;
        onsuccess({text: request.responseText, time: time});
      } else if (request.readyState == 4 && request.status != 200) {
        onfailure(request);
      }
    }
  });
};