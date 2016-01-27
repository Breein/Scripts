module.exports = function (url, method, param) {
  return new Promise((onsuccess, onfailure) => {
    var request = new XMLHttpRequest();

    request.open(method, url, true);
    if (method == 'POST') request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(param);

    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        onsuccess(request.responseText);
      } else if (request.readyState == 4 && request.status != 200) {
        onfailure(request);
      }
    }
  });
};