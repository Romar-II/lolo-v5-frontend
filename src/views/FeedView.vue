<template>
  <div>
    <h1>filter</h1>
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
.text-container {
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow: hidden;
}

.headline {

  padding: 8px;
  border-radius: 8px;
  max-height: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description-box {

  padding: 8px;
  border-radius: 8px;
  flex: 1; /* Fill remaining space */
  overflow: hidden; /* Hide overflow */
}

.info-box {
  padding: 8px;
  border-radius: 8px;

  bottom: 0;
}

h1 {
  font-size: 2em;
  margin-bottom: 0.5em;
}

button {
  margin-bottom: 1em;
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.news-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, background-color 0.2s;
  max-height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.news-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #e0f7fa;
}

.text-container {
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure the text container fills the height */
  padding: 16px;
  background-color: transparent; /* Transparent background */
  flex-grow: 1; /* Ensure it takes up available space */
}

.headline {
  padding: 8px;
  border-radius: 8px;
  flex-shrink: 0; /* Prevent headline from shrinking */
}

.description-box {
  padding: 8px;
  border-radius: 8px;
  flex-grow: 1; /* Allow the description box to take up remaining space */
  overflow: hidden; /* Hide overflow */
}

.info-box {
  padding: 8px;
  border-radius: 8px;
  margin-top: auto; /* Push info box to the bottom */
  flex-shrink: 0; /* Prevent info box from shrinking */
}

.content {
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure the content fills the height of the news item */
}

.image-container {
  max-height: 30%; /* Limit image height to 30% of news item height */
  width: auto;
  overflow: hidden;
}

img {
  max-height: 100%; /* Ensure the image respects the container's max-height */
  width: auto;
  border-radius: 8px;
}

.news-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, background-color 0.2s;
  max-height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.news-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #e0f7fa;
}

h2 {
  font-size: 1.2em;
  margin: 0 0 0.5em 0;
  color: #333;
}

.description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Number of lines to show */
  -webkit-box-orient: vertical;
  margin: 0.5em 0;
}

.info p {
  margin: 0.2em 0;
}

a {
  color: #007BFF;
  text-decoration: none;
}

</style>
