const puppeteer = require("puppeteer");
const axios = require("axios");
const querystring = require("querystring");
const fs = require("fs");

(async () => {
  const [reqUrl, search] = "".split("?");
  let params = Object.assign({}, querystring.parse(search), {
    begin: 0,
    count: 30,
  });
  const audioRsp = await axios.post(
    reqUrl + "?" + querystring.stringify(params)
  );

  const audioInfoList = audioRsp.data.appmsg_list.map((item) => ({
    name: item.title,
    url: item.link,
  }));
  for (let i = 0; i < audioInfoList.length; i++) {
    const audioItem = audioInfoList[i];
    try {
      const browser = await puppeteer.launch();

      const page = await browser.newPage({});
      await page.goto(audioItem.url, {
        waitUntil: "networkidle0",
      });
      page.waitForSelector(".audio_card_switch");
      await page.click(".audio_card_switch");

      const downloadSrc = await page.evaluate(() => {
        return document.querySelector("audio").src;
      });
      const audioContent = await axios.get(downloadSrc, {
        responseType: "arraybuffer",
      });
      fs.writeFileSync(`download/${audioItem.name}.mp3`, audioContent.data);
      console.log(
        `${i}/${audioInfoList.length - 1}  ${audioItem.name} : ${downloadSrc}`
      );
      await browser.close();
    } catch (error) {
      console.log(
        "下载失败:" + i + " " + audioItem.name + "  " + audioItem.url
      );
    }
  }
})();
