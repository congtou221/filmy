<template>
    <div id="landing">
        <div id="landing-background" :style="backgroundStyle"></div>
        <div id="landing-content">
            <h1 id="landing-title" v-if="config.title">{{config.title}}</h1>
            <p id="landing-desc">{{{config.description || '' | cr2br}}}</p>
        </div>
        <a class="scroll-down icon-arrow-left"></a>
    </div>
</template>
<script>
    export default {
        props: ['config'],
        filters: {
            // 将网站简介中的换行符转换为html中的换行符
            cr2br(str){
                return str.replace(/n/g, '<br />')
            }
        },
        computed: {
            bakcgroundStyle(){
                return {backgroundImage: `url('${this.config.background}')`}
            }
        }
    }
</script>
<style scoped>
</style>