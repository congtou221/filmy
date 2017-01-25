<template>
    <div class="content-category" :class="'as-title': asTitle">
        <div class="card-image">
            <img :src="category.cover">
            <span class="card-title">{{category.title}}</span>
            <span class="card-desc">{{category.subtitle}}</span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        category: {
            type: Object,
            default: () => {}
        },
        asTitle: {
            type: Boolean,
            default: false
        }
    }
}
</script>
<style scoped>
</style>