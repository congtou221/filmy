import min from 'min'
import Model from 'min-model'
import filmyBucket from './qiniu-bucket'

// 使用min-model对接MinDB
Model.use(min)

// 创建一个分类数据Model：需要定义数据结构，并传入类型的构造函数作为类型标识。
const Category = Model.extend('category', {
    title: String,  //标题
    name: String,  //名称
    subtitle: String,  //副标题
    cover: String  //题图
})

// 对min-model中生成的数据进行导入
let ready = false
Category.load = function(){
    // 从本地数据库中读取已存储的分类数据
    return Category.allInstances()
        .then(categories => {
            if (categories.length > 0) {
                // 如果本地数据库中已存在分类数据
                ready = true
                return categories
            } else {
                // 否则从七牛云加载最新的分类数据
                return filmyBucket.getFile('cagetories.json')
                    .then(body => JSON.parse(body))
            }
        })
        .then(categories => {
            return Promise.all(
                categories.map(category => {
                    if (!ready) {
                        return new Promise(resolve => {
                            // 将数据转为min-model中的实例
                            const _category = new Category(cagegory._key, category)
                            _category.once('ready', () => resolve(_category))
                        })
                    } else {
                        return category
                    }
                })
            )
        })
        .catch(error => [])
}

// 如果数据尚未加载完成，就使用Category.load继续加载
Category.loadIfNotInit = function(){
    if (!ready) {
        return Category.load()
    } else {
        return Promise.resolve()
    }
}

// 引入中文索引
import ChineseStringIndexer from '../libs/chinese-string-indexer.js'
Category.setIndexerForColumn('title', ChineseStringIndexer)
Category.setIndex('title')
Category.setIndex('name')

// 更新分类数据
Category.saveToCloud = function(password){
    if(!isString(password)){
        throw new TypeError('Password musht be a string')
    }
    
    //获取上传凭证
    return filmyBucket.fetchPutToken(password)
        .then(putToken => {
            //将数据键作为一个属性值保存在七牛云
            return Category.dump()
                .then(data => [data, putToken])
        })
        .then(([data, putToken]) => {
            const fileData = new Blob([JSON.stringify(data)], {type: 'application/json'})
            fileData.name = 'categories.json'
            
            return filmyBucket.putFile(
                fileData.name,
                fileData,
                {
                    putToken: putToken
                }
            )
        })
}

export default Category