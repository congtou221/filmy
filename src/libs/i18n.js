import config from './i18n.config.json'

function i18n(config){
    // 用户操作系统中的首选显示语言
    const lang = navigator.language;
    // 默认显示语言
    const defaultLang = config._default;

    // 返回一个作为过滤器的函数
    return function(key, language = lang){
        key = key.toLowerCase()
        // 检索适配标签
        const translations = config[key]
        // 如果适配配置不存在，直接返回键
        if(!translations) return key

        // 如果适配存在，则返回适配内容
        if(translations) return translations[language]

        // 如果笼统的适配存在，则返回适配内容
        language = language.split('-')[0]
        if(translations[language]) return translations[language]

        if(translations[defaultLang]) return translations[defaultLang]

        return key
    }
}

export default i18n(config)