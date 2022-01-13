/**
 * 转换文件标题
 * 1 - 测试  => 1.测试-集合
 */
const args = process.argv.slice(2);
const folderPath = args[0];
const topicName = args[1];
const fs = require("fs");
const path = require("path");

const readDir = fs.readdirSync(folderPath);
readDir.forEach((item) => {
  const itemPath = path.join(folderPath, item);
  const stat = fs.lstatSync(itemPath);
  if (stat.isFile()) {
    const pattern = /(\d+?)\s*?\-\s*?([\w\u4e00-\u9fa5]+)/;

    const result = pattern.exec(item);
    console.log(`${result[1]}.${result[2]}-${topicName}`);
  }
});
