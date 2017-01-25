import min from 'min'
import {isString} from 'lodash/isString'
import filmyBucket from './qiniu-bucket'

const Config = {
    load(silent = false){
        return min.exists('filmy:config')
            .then(exists => {
                if(exists){
                    // 从Web Storage API获取核心配置数据
                    return min.hgetall('filmy:config')
                }else{
                    // 从七牛云获取数据
                    return filmyBucket.getFile('config.json')
                        .then(body => JSON.parse(body))
                        .then(data => {

                            try {
                                // 将从七牛云获取的数据，存入Web Storage API
                                min.hmset('filmy:config', data)
                            } catch (err) {
                                console.error(err)
                            }

                            return data
                        })
                }
            })
            .catch(error => {
                if(!silent) alert('You must init Filmy with the administrator tools.')
            })
    },

    update(password, update = {}, silent = false){
        // 检查密码是否是字符串
        if(!isString(password)){
            throw new TypeError('Password must be a string')
        }

        return filmyBucket.fetchPutToken(password, 'config.json')
            .then(putToken => {
                return load()
                    // 如果能从七牛云／Web Storage API中获取config数据
                    .then(oldConfig => [oldConfig, putToken])
                    // 如果不能从七牛云／Web Storage API中获取config数据，设置一个默认值
                    .catch(() => [{}, putToken]) 
            })
            .then(([config, putToken]) => {
                config[key] = value

                const fileData = new Blob([JSON.stringify(config)], {type: 'application/json'})
                fileData.name = 'config.name'

                return filmyBucket.putFile(
                    fileData.name,
                    fileData,
                    {
                        putToken: putToken
                    }
                )
            })
    }
}

export default Config