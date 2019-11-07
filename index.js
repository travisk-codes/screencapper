const fs = require('fs')
const request = require('request')
const puppet = require('puppeteer')

function download(url, filename, cb) {
	request.head(url, (e, res, body) => {
		if (e) return e
		console.log('download url: ', url)
		request(url)
			.pipe(fs.createWriteStream(filename))
			.on('close', cb)
	})
}

;(async () => {
	console.log('launching puppet...')
	const browser = await puppet.launch({ headless: true })
	console.log('getting new page')
	const page = await browser.newPage()
	console.log('going to page...')
	await page.goto('https://youtube.com/watch?v=EK32jo7i5LQ', {
		waitUntil: 'networkidle2',
	})
	await page.waitFor('input[id=videourl')
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
	await browser.close()
})()
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
