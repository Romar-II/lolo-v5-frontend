<template>
  <div>
    <h1>{{ feedTitle }}</h1>
    <button @click="getFeeds">Press for feed</button>
    <div class="news-grid">
      <div v-for="item in feeds" :key="item.guid" class="news-item">
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <a :href="item.link" target="_blank">Read more</a>
        <p><strong>Author:</strong> {{ item.author }}</p>
        <p><strong>Published on:</strong> {{ new Date(item.pubDate).toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export default {
  data() {
    return {
      feedTitle: '',
      feeds: [],
    };
  },
  methods: {
    async getFeeds() {
      try {
        let {data} = await axios.get('https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss');
        const parsedData = await parseStringPromise(data);
        this.feedTitle = parsedData.rss.channel[0].title[0];
        this.feeds = parsedData.rss.channel[0].item.map(item => ({
          title: item.title[0],
          link: item.link[0],
          guid: item.guid[0],
          pubDate: item.pubDate[0],
          description: item.description[0],
          author: item.author ? item.author[0] : 'Unknown',
        }));
      } catch (error) {
        console.error('Error fetching and parsing the RSS feed:', error);
      }
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 2em;
  margin-bottom: 0.5em;
}

button {
  margin-bottom: 1em;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.news-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
}

h2 {
  font-size: 1.5em;
  margin: 0 0 0.5em 0;
}

p {
  margin: 0.5em 0;
}

a {
  color: #007BFF;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>

