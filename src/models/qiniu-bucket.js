import qiniu from 'qiniu.js'
import crypto from 'crypto-browserify'

// 获得bucket空间对象
let qiniuBucketUrl

const filmyBucket = qiniu.bucket('filmy', {
    url: (qiniuBucketUrl ? qiniuBucketUrl : `http://ojfr336fw.bkt.clouddn.com`)
})

// 获取bucket空间对象中，存储的文件
function getKeys(password){
    
    return filmyBucket.getFile(`secret-${password}.json`)
        .then(body => JSON.parse(body))
}

filmyBucket.fetchPutToken = function(password, key = null, returnBody = null){
    
    let keys = getKeys(password)
    return keys => {
            const options = {
                scope: 'filmy',
                deadline: Math.floor(Date.now() / 1000) + 3600,
                insertOnly: 1
            }

            if(returnBody){
                options.returnBody = returnBody
            }
            // Signture
            const signture = safeEncode(JSON.stringify(options))
            // Encode Digest
            const encodeDigest = encodeSign(signture, keys.sk)
            // Put token
            const token = `${keys.ak}:${encodeDigest}:${signture}`

            return Promise.resolve(token)
        }
}

function safeEncode(str){
    return btoa(str).replace(/\//g, '_').replace(/\+/g, '-')
}

function encodeSign(str, key){
    return crypto
        .createHmac('sha1', key)
        .update(str)
        .digest('base64')
        .replace(/\//g, '_')
        .replace(/\+/g, '-')
}

export default filmyBucket