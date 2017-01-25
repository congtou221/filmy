    <template>
        <div id="landing">
            <landing-view :config="config"></landing-view>
            <content :categories="categories"></content>
        </div>
    </template>
    <script>
        import LandingView from '../components/LandingView.vue'
        import Content from '../components/Content.vue'
        import Config from '../models/Config'
        import Category from '../models/Category'

        export default {
            components: {
                LandingView,
                Content
            },
            data(){
                return {
                    config: {},
                    categories: []
                }
            },
            ready(){
                Promise.all([
                    Config.load(),
                    Category.load()
                ]).then(([config, categories]) => {
                    this.config = config;
                    this.categories = categories;
                })
            }
        }
    </script>