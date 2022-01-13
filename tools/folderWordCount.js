/**
 * 统计文件夹下文件的字数,不处理嵌套文件夹的情况
 */
const args = process.argv.slice(2);
const folderPath = args[0];
const fs = require("fs");
const path = require("path");

const readDir = fs.readdirSync(folderPath);
let count = 0;
readDir.forEach((item) => {
  const itemPath = path.join(folderPath, item);
  const stat = fs.lstatSync(itemPath);
  if (stat.isFile()) {
    const fileContent = fs.readFileSync(itemPath).toString();
    console.log(item + " : " + fileContent.length);
    count += fileContent.length;
  }
});

console.log("总数: " + count);
