const puppet = require("puppeteer");

(async () => {
  console.log("launching puppet...");
  const browser = await puppet.launch({
    headless: true,
    args: ["--proxy-server=localhost:3000", "--proxy-bypass-list=*"],
    pipe: false
  });

  console.log("getting new page...");
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1
  });
  console.log("going to page...");
  await page.goto("http://localhost:3000", {
    waitUntil: "load",
    timeout: 0
  });

  await page.waitFor(".video-react-big-play-button");
  await page.click(".video-react-big-play-button");
  await page.waitFor(".video-react-play-control");
  await page.click(".video-react-play-control");
  await page.waitFor(".video-react-fullscreen-control");
  await page.click(".video-react-fullscreen-control");

      process.stdout.write("taking screens in ");

  for (let i = 3; i >= 1; i--) {
		await page.waitFor(1000)
    process.stdout.write(`${i}... `);
  }
  await page.evaluate(() => {
    document.querySelector(".video-react-control-bar").style.opacity = 0;
  });

  await page.click(".video-react-play-control");
  await page.click('.video-react-fullscreen-control')
''
  let time = 0
  let counter = 0
  let duration = await page.$eval(
    ".video-react-duration-display",
    e => e.innerText
  );
  duration = duration.split("\n");
  duration = duration[1].split(":");
  duration = parseInt(duration[0]) * 60 + parseInt(duration[1]);
  console.log(duration)

  while (time <= duration) {
     time = await page.$eval(
      ".video-react-current-time-display",
      e => e.innerText
    );
    time = time.split("\n");
    time = time[1].split(":");
    time = parseInt(time[0]) * 60 + parseInt(time[1]);

    if (time >= counter) {
      await page.click(".video-react-play-control"); // pause
      await page.waitForSelector(".video-react-loading-spinner", {
        hidden: true,
        timeout: 0
      });

      process.stdout.write(`snap ${time}/${duration} `);
      await page.screenshot({
        path: `screencaps/${time}.png`
      });

      await page.waitForSelector(".video-react-loading-spinner", {
        hidden: true
      });
      await page.click(".video-react-play-control"); // pause
      counter = time + 1;
    }
  }
  console.log("closing browser!");
  await browser.close();
})();
