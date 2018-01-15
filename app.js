const http = require('http');
const fs = require('fs');

const port = process.argv.length >= 3
  ? process.argv[2]
  : 3000

const ip = process.argv.length >= 4
  ? process.argv[3]
  : '127.0.0.1'

function notFound(response) {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.statusCode = 404;
  response.end('Ресурс не найден!');
}

function internalError(response) {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.statusCode = 500;
  response.end('Что-то пошло не так...');
}

function ok(response, data) {
  response.statusCode = 200;
  response.end(data);
}

http.createServer(function (request,response) {

  var filePath = 'public/' + request.url.substr(1);

  console.log('Запрошен ресурс ' + filePath);

  fs.stat(filePath, function (error, stat) {

    if(error) {
      console.log({ error: error });
      notFound(response);
      return;
    }
    else {
      if(stat.isDirectory()) {
        filePath = filePath + 'index.html';
      }
      else if (!stat.isFile()) {
        notFound(response);
        return;
      }
    }

    fs.readFile(filePath, function (error, data) {

      if(error) {
          console.log('Не найден ресурс: ' + filePath);

          notFound(response);
      }
      else {
          ok(response, data)
      }

      return;
    });
  });

}).listen(port, ip, function () {
  console.log(`Сервер ${ip} начал прослушивание запросов на порту ${port}`);
});
