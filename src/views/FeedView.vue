<template>
  <button @click="fetchRSSFeed">
    press
  </button>
  <div>
    <h1>Lolo v5</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="articles.length">
      <div v-for="article in articles" :key="article.guid" class="article">
        <h2>{{ article.title }}</h2>
        <img :src="article.enclosure.url" alt="article.title" v-if="article.enclosure && article.enclosure.url">
        <p v-html="article.contentSnippet"></p>
        <a :href="article.link" target="_blank">Read more</a>
      </div>
    </div>
  </div>
</template>

<script>


import axios from "axios";

export default {
  data() {
    return {
      loading: true,
      error: null,
      articles: []
    };
  },
  methods:{
  fetchRSSFeed() {
    axios.get('https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss')
        .then(response => {
          parseString(response.data, (err, result) => {
            if (err) {
              console.error("Error parsing RSS feed:", err);
            } else {
              this.feedItems = result.rss.channel[0].item;
            }
          });
        })
        .catch(error => {
          console.error("Error fetching the RSS feed:", error);
        });
  },
  },
  beforeMount() {
    this.fetchRSSFeed
  }
};
</script>

<style>
/* Add your styles here */
.article {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 1rem;
  padding: 1rem;
}

.article img {
  max-width: 100%;
  height: auto;
}
</style>
