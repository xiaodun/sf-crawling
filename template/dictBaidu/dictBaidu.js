const puppeteer = require("puppeteer");

const copyToClipboard = require("sf-copy-to-clipboard");
const args = process.argv.slice(2);
const queryStr = args[0];
const selectedIndex = args[1] || 0;
(async () => {
  const browser = await puppeteer.launch();
  const dicBaiduPage = await browser.newPage();
  await dicBaiduPage.goto("https://dict.baidu.com/");
  await dicBaiduPage.type("#kw", queryStr);
  await dicBaiduPage.waitForSelector(".suggest-content.home a");
  const contentList = await dicBaiduPage.evaluate(() => {
    return [...document.querySelectorAll(".suggest-content.home a")].reduce(
      (pre, cur) => {
        if (cur.querySelector(".his.poem")) {
          pre.push({
            previewContent: cur.querySelector(".his.poem").innerText,
            link: cur.href,
          });
        } else if (cur.querySelector(".his.zici")) {
          pre.push({
            previewContent: cur.querySelector(".his.zici").innerText,
            link: cur.href,
          });
        }
        return pre;
      },
      []
    );
  });
  contentList.map((item, index) => {
    console.log(`第${index + 1}个结果`);
    console.log(item.previewContent);
    console.log("\n------------------------------------------------\n");
  });
  console.log("\n---------------------内容--------------------\n");
  const selectedItem = contentList[selectedIndex];
  const detailPage = await browser.newPage();
  await detailPage.goto(selectedItem.link);
  const contents = await detailPage.evaluate(() => {
    const mainDom = document.querySelector("#poem-detail-header");
    const title = mainDom.querySelector("h1").innerText;
    const authName = mainDom.querySelector(
      ".poem-detail-header-author"
    ).innerText;
    const words = mainDom.querySelector(".poem-detail-item-content").innerText;
    const translation = (
      document.querySelector(".poem-detail-item-content.means-fold") || ""
    ).innerText;
    return {
      title,
      authName,
      words,
      translation,
    };
  });
  console.log(contents.title);
  console.log(contents.authName);
  console.log(contents.words);
  copyToClipboard(
    `${contents.title}\n\n${contents.authName}\n\n${contents.words}`
  );
  console.log(`\n------------------------\n`);
  console.log(contents.translation);

  await browser.close();
})();
