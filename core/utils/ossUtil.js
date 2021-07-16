const OSS = require('ali-oss')
const client = new OSS({
  region: 'oss-cn-shenzhen',
  accessKeyId: 'LTAI4GGYQxBjeW4JpAku7Eti',
  accessKeySecret: 'odkvkHQXs6R6me5S23ja2WtP6ZCLJN',
  bucket: '3jyun-plms'
})

async function download (objectName,start, end) {
  // yourObjectName表示不包含Bucket名称在内的Object的完整路径，例如destfolder/examplefile.txt。
  // 获取目标Object的1~900字节范围内的数据，包含1和900，共900字节的数据。
  // 如果指定范围的首端或末端不在有效区间，则下载整个文件的内容，返回HTTP Code为200。
  let result = await client.get(objectName, {
    headers: {
      Range: `bytes=${start}-${end}`
    }
  })
  console.log(result.content.toString())
  console.log(Buffer.from(result.content).toString('hex'))
  return result.content
}

exports.download = download
