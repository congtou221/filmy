<template>
    <div id="album">
        <h1 id="album-title">{{album.title}}</h1>

        <album-info :content="album.content"></album-info>
        <photo-list :photos="album.photos"></photo-list>
    </div>
</template>
<script>
    import Album from '../models/Album';
    import Category from '../models/Category';

    import AlbumInfo from '../components/AlbumInfo.vue';
    import PhotoList from '../components/PhotoList.vue';

    export default {
        data() {
            return {
                album: {}
            }
        },
        ready() {
            Album.loadIfNotInit()
                .then(() => Album.fetch(this.$route.params.key))
                .then(res => res.getCacheData())
                .then(album => this.album = album)
        },
        components: {
            AlbumInfo,
            PhotoList
        }
    }
</script>
<style scoped>
</style>