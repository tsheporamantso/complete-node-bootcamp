const fs = require("fs"); // file reading and reading module(fs stands for File System)
const http = require("http"); // Networking capabilities we use this module
const url = require("url"); // Routing
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");
/*
              ! FILES
*/
/*
! nodejs is a JavaScript runtime built on google open-source V8 JavaScript engine.
* Single-threaded, based on event driven non-blocking I/O(Input / Output) model 🤯
* Perfect for building fast and scalable data intensive apps
* To start node REPL(Read, Evaluate, Print and Loop) just type node on the terminal
* To exit node REPL type .exit
* Node is built around the concept of module, where additional functionalities are stored in a module.
*/

// We use node modules to read and write files.
// File can be read Synchronously or Asynchronously, fs.readFileSync, takes 2 arguments 1 is the file path and the second is utf-8[Charactar encoding], if you dont specify charactor encoding you get the buffer.
// console.log(fs);

/*
! SYNCHRONOUS(BLOCKING) FILE READ AND WRITE 
*/
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// const textOut = fs.readFileSync(`${__dirname}/txt/input.txt`, "utf-8");
// console.log(textOut);

// const textOut = `This is what I know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut, "utf-8");
// console.log("File written");

/*
! SYNCHRONOUS AND ASYNCHRONOUS CODE (BLOCKING AND NON-BLOCKING)
* Synchronous each code is processed one aftre the other, line by line(Single thread)
* Asynchronous or NON-BLOCKING code, uses CallBack functions. 
*/

/*
! ASYNCHRONOUS(NON-BLOCKING) FILE READ AND WRITE
*/
fs.readFile(`${__dirname}/txt/start.txt`, "utf-8", (err, data1) => {
  fs.readFile(`${__dirname}/txt/${data1}.txt`, "utf-8", (err, data2) => {
    if (err) {
      throw err;
    } else {
      // console.log(data2);
    }
    fs.readFile(`${__dirname}/txt/append.txt`, "utf-8", (err, data3) => {
      if (err) {
        throw err;
      } else {
        // console.log(data3);
      }
      fs.writeFile(
        `${__dirname}/txt/final.txt`,
        `${data2}\n${data3}`,
        "utf-8",
        (err) => {
          if (err) {
            throw err;
          } else {
            // console.log("File written!");
          }
        }
      );
    });
  });
});

/*
              ! SERVER
*/
/*
! In order to build the server we need to do two things. We 1)CREATE and 2)START the server to listen for incoming request.
* We use http module, just like we did with fs module for file reading and writting.
* http.createServer accept a CallBack function that takes two arguments i.e. request(req) and response(res)
* Receiving a request from server we can use listen()method, it received a couple of parameters and the first one is the 1)port, 2)host, 3) pass callBack annoymous function
*/

/*
! ROUTING
? Express is used for routing in huge projects.
? For routing we require url module. 
*/

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

// console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //root and Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "Hello Tshepi",
    });
    res.end("<h1>Page could not be found!</h1>");
  }
});

server.listen(8000, "localhost", (err) => {
  if (err) {
    throw err;
  } else {
    console.log("Listening to request on localhost 127.0.0.1 port 8000.");
  }
});
