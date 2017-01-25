import min from 'min'
import Model from 'min-model'
import { isString } from 'lodash'
import filmyBucket from './qiniu-bucket'
import ChineseStringIndexer from '../libs/chinese-string-indexer'

Model.use(min)

const Album = Model.extend('album', {
    title: String,
    content: String,
    category: String,
    created_at: Number,
    photos: Array
})

Album.setIndexerForColumn('title', ChineseStringIndexer)
Album.setIndexerForColumn('content', ChineseStringIndexer)
Album.setIndex('title')
Album.setIndex('content')

let ready = false

Album.load = function(){
    return Album.allInstances()
        .then(albums => {
            if (albums.length > 0) {
                ready = true
                return albums
            } else {
                return filmyBucket.getFile('albums.json')
                    .then(body => JSON.parse(body))
            }
        })
        .then(albums => {
            return Promise.all(
                albums.map(album => {
                    if(!ready){
                        return new Promise(resolve => {
                            const _album = new Album(album._key, album)
                            
                            album.once('ready', () => resolve(_album))
                        })
                    } else {
                        return album
                    }
                })
            )
        })
}

Album.loadIfNotInit = function(){
    if (!ready) {
        return Album.load()
    } else {
        return Promise.resolve()
    }
}

Album.fetchBuCategory = function(categoryName) {
    return Album.loadIfNotInit()
        //根据分类检索相册
        .then(() => Album.search('category', categoryName))
        //根据相册的创建时间排序
        .then(albums => albums.sort((a, b) => {
            return a.created_at < b.created_at
        }))
    
}

Album.saveToCloud = function(password){
    if(!isString(password)){
        throw new TypeError('Password must be a string')
    }
    
    return Album.dump()
        .then(data => {
            return filmyBucket.fetchPutToken(password)
                .then(putToken => [data, putToken])
        })
        .then(([data, putToken]) => {
            const fileData = new Blob([JSON.stringify(data)], {type: 'application/json'})
            
            fileData.name = 'albums.json'
        
            return filmyBucket.putFile(
                fileData.name,
                fileData,
                {
                    putToken: putToken
                }
            )
        })
}

export default Album