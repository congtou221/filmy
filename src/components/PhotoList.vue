<template>
    <section id="album-photos">
        <img v-for="photo in photos" :src="photo" class="album-photo">
    </section>
</template>
<script>
    export default {
        props: {
            photos: {
                type: Array,
                default: () => []
            }
        }
    }
</script>
<style scoped>
</style>