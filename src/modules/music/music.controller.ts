import { Controller, Get, Post, Query, UploadedFiles, UseInterceptors, Response } from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { join } from 'path'
import * as fs from 'fs'

@Controller('music')
export class MusicContoller {
  @Get('song/url')
  findMusicUrl(@Query() query, @Response() res) {
    const dirPath = join(__dirname, '..', '..', '..', 'public', 'daily')
    if (fs.existsSync(`${dirPath}/${query.id}.json`)) {
      const readUrl = fs.createReadStream(`${dirPath}/${query.id}.json`)
  
      let arr =[]
      readUrl.on('data', function (chunk) {
        arr.push(chunk)
      })
      readUrl.on('end', function (chunk) {
        res.send({
          status: 'success',
          message: JSON.parse(Buffer.concat(arr).toString())
        })
      })
      readUrl.on('err', function (err) {
        console.log(err)
      })
    } else {
      res.send({
        status: 'error',
        message: '未发布'
      })
    }
  }

  @Post('song/upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'cover', maxCount: 1 },
    { name: 'bgi', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'lyric', maxCount: 1 }
  ]))
  upload(@UploadedFiles() files: { cover?: Express.Multer.File[], bgi?: Express.Multer.File[], audio?: Express.Multer.File[], lyric?: Express.Multer.File[] }, @Response() res) {
    //创建文件夹目录
    let publishTime = new Date()
    publishTime.setHours(8)
    publishTime.setMinutes(0)
    publishTime.setSeconds(0)
    publishTime.setMilliseconds(0)
    const dirPath = join(__dirname, '..', '..', '..', 'public', 'daily', String(+publishTime))

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
      console.log("文件夹创建成功")
    } else {
      let files = fs.readdirSync(dirPath)
      files.forEach(file => {
        const filePath = dirPath + '/' + file
        fs.unlinkSync(filePath)
      })
      console.log("文件夹已存在, 清空完毕")
    }

    const readurl = 'http://127.0.0.1:3000/daily'
    let urlJson = {}

    for(let key in files) {
      const filename = files[key][0].originalname.replace(/.+\./, key + '.')
      let newPath = dirPath + "/" + filename
      if (key !== 'lyric') {
        const writeStream = fs.createWriteStream(newPath)
        writeStream.write(files[key][0].buffer)
        urlJson[key] = `${readurl}/${+publishTime}/${filename}`
      } else {
        console.log(JSON.parse(files[key][0].buffer.toString()))
        urlJson[key] = JSON.parse(files[key][0].buffer.toString()).lyric
      }
    }
    const writeImage = fs.createWriteStream(join(dirPath, '..', `${+publishTime}.json`))
    writeImage.write(JSON.stringify(urlJson))
    res.send({ data: "上传成功！" })
  }
}