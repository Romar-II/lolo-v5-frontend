<template>
  <div class="filter-container">
    <p>Filter:</p>
    <select v-model="selectedCategory" @change="filterNewsByCategories">
      <option value="">All Categories</option>
      <option v-for="category in availableCategories" :key="category" :value="category">{{ category }}</option>
    </select>
  </div>
  <div v-for="content in filteredContents" :key="content.feedTitle">
    <h1>Feed name: {{ content.feedTitle }}</h1>
    <div class="news-grid">
      <a v-for="item in content.news" :key="item.guid" :href="item.link" target="_blank" class="news-item">
        <div class="content">
          <div class="image-container">
            <img :src="item.imageUrl" alt="News image" v-if="item.imageUrl"/>
          </div>
          <div class="text-container">
            <div class="headline">
              <h2>{{ item.title }}</h2>
            </div>
            <div class="description-box">
              <p class="description">{{ item.description }}</p>
            </div>
            <div class="info-box">
              <div class="info">
                <p><strong>Author:</strong> {{ item.author }}</p>
                <p><strong>Published on:</strong> {{ new Date(item.pubDate).toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export default {
  data() {
    return {
      feeds: [],
      contents: [],
      filteredContents: [],
      availableCategories: [],
      selectedCategory: ''
    };
  },
  methods: {
    getFeeds: async function () {
      this.contents = [];
      this.availableCategories = [];
      for (const feed of this.feeds) {
        try {
          let { data } = await axios.get(feed.link);
          const parsedData = await parseStringPromise(data);
          let feedContent = {
            feedTitle: parsedData.rss.channel[0].title[0],
            news: parsedData.rss.channel[0].item.map(item => ({
              title: item.title[0],
              link: item.link[0],
              guid: item.guid[0],
              pubDate: item.pubDate[0],
              description: item.description[0],
              author: item.author ? item.author[0] : 'Unknown',
              imageUrl: item['media:content'] ? item['media:content'][0].$.url : '',
              categories: item.category ? item.category.map(cat => cat._) : []
            }))
          };
          this.sortByDate(feedContent.news); // Sort the news by date
          this.contents.push(feedContent);

          // Update available categories
          feedContent.news.forEach(item => {
            item.categories.forEach(category => {
              if (category &&!this.availableCategories.includes(category)) {
                this.availableCategories.push(category);
              }
            });
          });
        } catch (error) {
          console.error('Error fetching and parsing the RSS feed:', error);
        }
      }
      this.filterNewsByCategories(); // Filter news after fetching
    },
    sortByDate(news) {
      news.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    },
    filterNewsByCategories() {
      if (this.selectedCategory === '') {
        this.filteredContents = this.contents;
      } else {
        this.filteredContents = this.contents.map(content => ({
          ...content,
          news: content.news.filter(item => item.categories.includes(this.selectedCategory))
        }));
      }
    },
    loadFeeds() {
      this.feeds = JSON.parse(localStorage.getItem('feeds'));
    },
  },
  beforeMount() {
    this.loadFeeds();
    this.getFeeds()
  }
};
</script>

<style scoped>


</style>
