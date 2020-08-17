import { Message } from 'wechaty'
// import { FileBox } from 'file-box'
import { MessageType } from 'wechaty-puppet'

import { FileBox as FileBoxModel } from '../../models'
const crypto = require('crypto')
const fs = require('fs')
/**
 * saveMsgFile
 */
export async function saveMsgFile(msg: Message, subDir: string) {
  const file = await msg.toFileBox()
  const dir = process.env.FILES_STATIC || 'static/files/msg/'
  // ./static/files/msg/
  const targetDir = `./${dir}${subDir}`
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }
  // const now = moment().format('YYMMDDHH:mm:ss')

  const ext = file.name.split('.')[1]
  let filePath = `${targetDir}/${msg.id}`
  if (ext) {
    filePath += `.${ext}`
  }
  const type = msg.type()
  switch (type) {
    case MessageType.Emoticon:
      filePath += '.gif'
      break
    case MessageType.Audio:
      // https://www.jianshu.com/p/fbccd8a52374
      // todo https://kn007.net/topics/decoding-qq-wechat-silk-v3-encoded-audio-to-mp3-or-other-formats/
      filePath += '.mp3'
      break

    default:
      break
  }

  // await file.toFile(filePath)

  //  确保每个文件只存储一次
  // 读取一个Buffer
  // var fs = require('fs')
  // var path = require('path')
  // var buffer = fs.readFileSync(path.resolve(__dirname, `../../${filePath}`))
  const buffer = await file.toBuffer() // filePath
  const fsHash = crypto.createHash('md5')
  fsHash.update(buffer)
  const md5 = fsHash.digest('hex')

  const [fileBox, created] = await FileBoxModel.findOrCreate({
    where: { md5 },
    defaults: {
      path: filePath.replace('./static/', ''), // remove ./static
      msgId: msg.id
    }
  })
  if (created) {
    file.toFile(filePath)
    // fs.unlinkSync(filePath)
  }
  //  确保每个文件存储一次 end
  return fileBox.path
}
