<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/feed">Feed</router-link> |
    <router-link to="/feed/settings">Feed Settings</router-link>
  </nav>
  <router-view/>
</template>
<script>
export default {
  data(){
    return{
      feeds:[],
      test:false
    }
  },
  methods:{
    addDefaultFeed(){
      if(this.checkFeedsEmpty()){
        this.feeds=[
          {
            name: "Initial content",
            link: "https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss"
          }
        ]
        localStorage.setItem('feeds', JSON.stringify(this.feeds))
      }
    },
    checkFeedsEmpty(){
      const savedFeeds = localStorage.getItem('feeds')
      return savedFeeds===null
    }
  },
  beforeMount() {
    this.addDefaultFeed()
  }
}
</script>

<style>

</style>
