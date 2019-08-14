const fs = require('fs')
const path = require('path')
const getPixels = require("get-pixels");
const log = console.log;
const {
  createCanvas,
  loadImage
} = require('canvas')
//画布宽高
var canvasdata = {
  "width": 300,
  "height": 300
}
//要截取的图片宽高,名字
// var imgdata = {
//   "width": 7200,
//   "height": 7200,
//   "name": 1002
// }

//图片存放地址 maps文件夹
//图片裁剪输出地址 imgSplit文件夹
var readDir = fs.readdirSync('./maps');
readDir.forEach(item => {
  getPixels(`./maps/${item}`, function (err, px) {
    //获取图片宽高信息
    if (err) log(err)
    let imgdata = {
      "width": px.shape[0],
      "height": px.shape[1],
      "name": item.split('.')[0]
    };
    let num = 1;
    let X_img = Math.ceil(imgdata.width / canvasdata.width); //横着几个
    let Y_img = Math.ceil(imgdata.height / canvasdata.height); //竖着几个
    const canvas = createCanvas(canvasdata.width, canvasdata.height)
    const ctx = canvas.getContext('2d');
    //创建裁剪图片输出文件夹
    fs.mkdirSync(`./imgSplit/${item.split('.')[0]}`)
    //读取并裁剪图片
    loadImage(`./maps/${item}`).then(image => {
      for (let i = 0; i < X_img; i++) {
        for (let j = 0; j < Y_img; j++) {
          (function (n, m) {
            ctx.drawImage(image, n * 300, m * 300, 300, 300, 0, 0, 300, 300)
            var buf = canvas.toBuffer('image/jpeg');
            fs.writeFileSync(`./imgSplit/${item.split('.')[0]}/map_${imgdata.name}_${n}_${m}.jpg`, buf)
            console.log(`已存${num++}张,共${X_img * Y_img}张`)
          }(i, j))
        }
      }
    })
  })
})