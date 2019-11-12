const fs = require("fs");
const request = require("request");
const puppet = require("puppeteer");
(async () => {
  console.log("launching puppet...");
  const browser = await puppet.launch({
    headless: false,
    args: ["--proxy-server=localhost:3000", "--proxy-bypass-list=localhost"],
    pipe: false
  });

  console.log("getting new page");
  const page = await browser.newPage();
  await page.setViewport({
    width: 720,
    height: 480,
    deviceScaleFactor: 1
  });
  console.log("going to page...");
  await page.goto("localhost:3000", {
    waitUntil: "load",
    timeout: 0
  });
  await page.waitFor(".video-react-big-play-button");
  await page.click(".video-react-big-play-button");
  await page.waitFor(".video-react-play-control");
  await page.click(".video-react-play-control");
  for (let i = 10; i >= 1; i--) {
    process.stdout.write("taking screens in ");
    process.stdout.write(`${i}...`);
  }
  process.stdout.write("taking screenshots...");
  await page.evaluate(() => {
    document.querySelector(".video-react-control-bar").style.opacity = 0;
  });
  let snaps = 17 * 60 * 1000;
  for (let i = 1; i <= snaps; i++) {
    await page.click(".video-react-play-control"); // play
    await page.waitForSelector(".video-react-loading-spinner", {
      hidden: true
    });
    await page.waitFor(1000);
    await page.click(".video-react-play-control"); // pause
    process.stdout.write("snap! ");
    await page.waitForSelector(".video-react-loading-spinner", {
      hidden: true
    });
    await page.screenshot({
      path: `screencaps/this-problem-seems-hard/screen${i}.png`
    });
  }
  /*
	await page.$eval(
		'input[id=videourl]',
		el => (el.value = 'https://www.youtube.com/watch?v=EK32jo7i5LQ'),
	)
	console.log('input text')
	await page.click('button[id=url-submit]')
	console.log('clicked submit')
	await page.waitForSelector('video')
	console.log('video appeared')
	await page.click('video')
	console.log('started video?')
	await page.waitFor(5000)
	console.log('wait a second')
	await page.click('video')
	console.log('ended video?')
	await page.$eval('input[id=width]', el => (el.value = 1920))
	console.log('changed width')
	await page.click('button[id=snap]')
	console.log('clicked snap')
	await page.waitForSelector('canvas')
	console.log('canvas found?')
	await page.screenshot({ path: 'test.png' })
	/*
	const png = await page.$eval('canvas[id=canvas]', el => {
		return el.toDataURL('image/png')
	})
	console.log('png: ', png)
	download(png, 'image.png', () => console.log('image downloaded'))
	*/
  console.log("closing browser!");
  await browser.close();
})();
/*
- open video page
- wait for pause button to show up?
- pause
- detect ad button
- wait until text is skip ads (or disappears?)
- maximize
- press play
- take screenshot every second

/*
let num = 0
setInterval(() => {
	let canvas = document.getElementById('canvas')
	canvas.setAttribute('crossOrigin', 'anonymous')
	console.log('before')
	let url = canvas.toDataURL()
	console.log('after')
	let w = window.open('about:blank', 'image from canvas')
	w.document.write(`<img src="${url}"/>`)
	num++
}, 5000)
*/
