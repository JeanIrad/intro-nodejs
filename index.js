const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');
///////////////////////////////////

// FILES

// Blocking Synchronous way
// const textIn = fs.readFileSync('./input.txt', 'utf-8')
// const textOut = `In facts, ${textIn}. \n  this is a new line added using JS character escape on ${Date.now()}`
// fs.writeFileSync('./input.txt', textOut)
// const readMe = fs.readFileSync('./input.txt', 'utf-8')

// console.log(readMe)

// non-blocking asynchronous way

// fs.readFile("./inputAsync.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error");
//   fs.readFile(`./${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.writeFile("./final.txt", `${data1}\n${data2}`, "utf-8", (err) => {
//       console.log("your file has been written!");
//     });
//   });
// });

// console.log("Will read the file!");

//////////////////////////////////////

// SERVIER
const checkContent =
  '<div style="background: #666; padding: 20px; text-align: center;"> <h1 style="color: #222;"> this is to check my website</h1></div>';

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugs);
const overviewTemp = fs.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  'utf-8'
);
const cardTemp = fs.readFileSync(
  `${__dirname}/templates/template_card.html`,
  'utf-8'
);
const productTemp = fs.readFileSync(
  `${__dirname}/templates/template_product.html`,
  'utf-8'
);

// my checking for writing a brand new static html file
const html = fs.writeFileSync(
  `${__dirname}/templates/check.html`,
  checkContent
);
const readHtml = fs.readFileSync(`${__dirname}/templates/check.html`, 'utf-8');

const server = http.createServer((req, res) => {
  // console.log(req.url);
  // console.log(url.parse(req.url, true))
  // const pathname = req.url;
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(cardTemp, el))
      .join('');
    const output = overviewTemp.replace('{%PRODUCT_CARDS%}', cardsHtml);
    // console.log(cardsHtml)
    res.end(output);
  }
  // PRODUCT PAGE
  else if (pathname === '/product') {
    const product = dataObj[query.id];
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    const output = replaceTemplate(productTemp, product);
    res.end(output);
  }
  // API
  else if (pathname === '/api') {
    //    codes
    res.writeHead(200, {
      'content-type': 'application/json',
    });
    res.end(data);
  }
  // NOT FOUND PAGE
  else {
    res.writeHead(404, {
      'content-type': 'text/html',
      // "my-own-header": "Hello World!",
    });
    res.end(readHtml);
  }
  //   res.end("Hello From the server!");
});

server.listen(8000, '127.0.0.2', () => {
  console.log('Listening to requests on port 8000');
});
/*


run npm install slugify
run npm install nodemon --save-dev
installing globally: npm i nodemon --global
*/
