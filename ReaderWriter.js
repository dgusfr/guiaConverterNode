const fs = require("fs");
const util = require("util");
const ejs = require("ejs");
const { writer } = require("repl");
var pdf = require("html-pdf");

class Reader {
  constructor() {
    this.reader = util.promisify(fs.readFile);
  }

  async readFile(filePath) {
    try {
      const data = await this.reader(filePath, "utf8");
      return data;
    } catch (error) {
      console.error(`Error reading file from path: ${filePath}`, error);
      return null;
    }
  }
}

class Writer {
  constructor() {
    this.writer = util.promisify(fs.writeFile);
  }

  async writeFile(fileName, data) {
    try {
      await this.writer(fileName, data);
      return true;
    } catch (error) {
      console.error(`Error writing file to path: ${fileName}`, error);
      return false;
    }
  }
}

//Transformando .CSV em arrays
class Processor {
  static Process(data) {
    var lines = data.split("\r\n");
    var rows = [];

    lines.forEach((row) => {
      var arr = row.split(",");
      rows.push(arr);
    });

    return rows; // Adicione esta linha
  }
}

class Table {
  constructor(arr) {
    if (!arr) {
      throw new Error("Array is undefined in Table constructor");
    }
    this.header = arr[0];
    arr.shift();
    this.rows = arr;
  }
  //Adiciona campovirtual que diz quantas linhas possui no arquivo no momento
  get RowCount() {
    return this.rows.length;
  }

  get ColumnCount() {
    return this.header.length;
  }
}

class HtmlParser {
  static ParseToHtml(table) {
    return new Promise((resolve, reject) => {
      ejs.renderFile(
        "./table.ejs",
        { header: table.header, rows: table.rows },
        (err, html) => {
          if (err) {
            reject(err);
          } else {
            resolve(html);
          }
        }
      );
    });
  }
}

class PDFWriter {
  static WritePDF(fileName, html) {
    pdf.create(html, {}).toFile(fileName, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("PDF criado com sucesso!");
      }
    });
    // pdf.fromHTML(html, 0, 0, { width: 210, height: 300 });
    // pdf.save(fileName);
  }
}

module.exports = { Reader, Writer, Processor, Table, HtmlParser, PDFWriter };
