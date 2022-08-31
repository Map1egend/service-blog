import { Controller, Get, Post, Query, UploadedFiles, UseInterceptors, Response, Body } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { join } from 'path'
import * as fs from 'fs'

@Controller('music')
export class MusicContoller {
  @Get('song/url/v1')
  findMusicUrl(@Query() query): string {
    return `Query 参数是: ${query.id}${query.level}`
  }

  @Post('song/upload')
  @UseInterceptors(FilesInterceptor('files'))
  upload(@UploadedFiles() files: Array<Express.Multer.File>, @Response() res) {
    console.log(files)
    //创建文件夹目录
    const dirPath = join(__dirname, '..', '..', '..', 'public', 'daily', String(+new Date))

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      console.log("文件夹创建成功");
    } else {
      console.log("文件夹已存在");
    }

    files.forEach(file => {
      let newPath = dirPath + "/" + file.originalname
      const writeImage = fs.createWriteStream(newPath)
      writeImage.write(file.buffer)
    })
    res.send({ data: "上传成功！" })
  }
}