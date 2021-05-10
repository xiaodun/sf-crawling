const puppeteer = require("puppeteer");
const axios = require("axios");
const querystring = require("querystring");
const fs = require("fs");

(async () => {
  const audioInfoList = [];
  const [
    reqUrl,
    search,
  ] = "http://mp.weixin.qq.com/mp/homepage?__biz=Mzg5MTE0OTgxMA==&hid=3&sn=05d74ba6405bd21684c2f27ac3d305aa&scene=18&cid=3&begin=0&count=5&action=appmsg_list&f=json&r=0.3611643210315847&appmsg_token=".split(
    "?"
  );
  let params = Object.assign({}, querystring.parse(search), {
    begin: 20,
    count: 10,
  });
  const audioRsp = await axios.post(
    reqUrl + "?" + querystring.stringify(params)
  );

  audioRsp.data.appmsg_list.forEach((item) => {
    audioInfoList.push({
      name: item.title,
      url: item.link,
    });
  });
  audioInfoList.forEach(async (audioItem, audioIndex) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(audioItem.url);
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
      `${audioIndex}/${audioInfoList.length}  ${audioItem.name} : ${downloadSrc}`
    );
    await browser.close();
  });
})();
