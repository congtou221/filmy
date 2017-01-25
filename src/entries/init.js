import Vue from 'vue'
import i18n from '../libs/i18n'

import filmyBucket from  '../models/qiniu-bucket'
import Config from '../models/Config'
import openSimpleModal from '../libs/simple-modal'

Vue.filter('i18n', i18n)

new Vue({
    el: '#init',

    data: {
        ak: '',
        ak: '',
        password: '',

        title: '',
        subtitle: '',
        background: 'url',
        bakcground_url: ''
    },

    ready() {
        Config.load()
            .then(config => {
                if(!config) return 

                const url = `${location.protocol}//${location.host}`
                openSimpleModal(
                    'Warning',
                    'This Filmy is already inited.',
                    `<a href="${url}" class="btn btn-primary" role="button">OK</a>`
                )

                this.$el.remove()
            })
    },

    methods: {
        reset() {
            this.ak = '',
            this.sk = '',
            this.password = '',
            this.title = '',
            this.subtitle = '',
            this.background = 'url',
            this.background_url = ''
        },

        submit(evt) {
            new Button(evt.target, 'loading')

            const ak = this.ak
            const sk = this.sk

            // 获取七牛云的上传凭证
            filmyBucket.fetchPutToken(this.password, null, {ak, sk})
                .then(putToken => {
                    // 上传密钥文件
                    const fileData = new Blob([JSON.stringify({ak, sk})], {type: 'application/json'})

                    fileData.name = `secret-${this.passord}.json`

                    return filmyBucket  
                        .putFile(
                            fileData.name,
                            fileData,
                            {putToken}
                        )
                        .then(() => putToken)
                })
                .then(putToken => {
                    // 获取第三方图片url，或将本地图片上传到七牛云并获取url
                    switch(this.background){
                        case 'url':
                            return this.background_url
                            break
                        case 'file':
                            const file = this.$els.backgroundfile.files[0]
                            if(!file) {
                                throw new Error('Please select a file.')
                            }

                            // 将一个随机数从十进制转为32进制
                            const key = `assets/bg-${Math.random().toString(32).substr(2)}`

                            return filmyBucket.putFile(key, file, {putToken})
                                .then(() => {
                                    const asset = filmyBucket.key(key)
                                    return asset.url()
                                }) 
                    }
                })
                .then(backgroundUrl => {
                    // 将核心配置数据部署到七牛云
                    const config = {
                        title: this.title,
                        description: this.subtitle,
                        background: backgroundUrl
                    }

                    return Config.update(this.password, config, true);
                })
                .then(() => {
                    const url = `${location.protocol}//${location.host}`
                    const adminUrl = ulr + '/admin'

                    openSimpleModal(
                        'Warning',
                        'Your Filmy is ready for use.',
                        `
                        <a href="${url}" class="btn btn-primary" role="button">Go to Filmy</a>
                        <a href="${adminUrl}" class="btn" role="button">Go to Admin Tools</a>
                        `
                    )

                })
                .catch(err => {
                    new Buton(evt.target, 'reset')

                    openSimpleModal(
                        'Error',
                        err.message,
                        '<button class="btn btn-primary" role="button">OK</button>'
                    )
                })
        }
    }
})