<template>
    <div id="content">
        <div id="content-categories">
            <category
                v-for="category in categories"
                :category="category.getCacheData()"
                //通过vue-router，跳转到/category/:name
                v-link="{path: '/category/' + category.getCacheData('name')}" 
            ></category>
        </div>
    </div>
</template>
<script>
    import CategoryItem from './Category.vue';

    export default {
        props: {
            categories: {
                type: Object,
                default: () => {}
            }
        },
        components: {
            Category: CategoryItem
        }
    }
</script>
<style scoped>
</style>