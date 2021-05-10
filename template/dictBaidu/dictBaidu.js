const puppeteer = require("puppeteer");

const copyUtils = require("../../utils/copyUtils.js");

(async () => {
  const browser = await puppeteer.launch();
  const dicBaiduPage = await browser.newPage();
  await dicBaiduPage.goto("https://dict.baidu.com/");
  await dicBaiduPage.type("#kw", "众里寻他千百度");
  await dicBaiduPage.waitForSelector(".suggest-content.home a");
  const contentList = await dicBaiduPage.evaluate(() => {
    return [...document.querySelectorAll(".suggest-content.home a")].reduce(
      (pre, cur) => {
        pre.push({
          previewContent: cur.querySelector(".his.poem").innerText,
          link: cur.href,
        });
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
  const selectedItem = contentList[1];
  const detailPage = await browser.newPage();
  await detailPage.goto(selectedItem.link);
  const contents = await detailPage.evaluate(() => {
    const mainDom = document.querySelector("#poem-detail-header");
    const title = mainDom.querySelector("h1").innerText;
    const authName = mainDom.querySelector(".poem-detail-header-author")
      .innerText;
    const words = mainDom.querySelector(".poem-detail-item-content").innerText;
    return {
      title,
      authName,
      words,
    };
  });
  console.log(contents.title);
  console.log(contents.authName);
  console.log(contents.words);
  copyUtils.exec(
    `${contents.title}\n\n${contents.authName}\n\n${contents.words}`
  );
  await browser.close();
})();
