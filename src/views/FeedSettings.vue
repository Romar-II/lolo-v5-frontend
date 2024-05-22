<template>
  <AddSourceModal ref="addSourceModalRef" @event-save-new-feed="saveNewFeed"/>
  <EditFeedModal ref="editFeedModalRef" @event-edit-feed="editFeed"/>
  <div class="table-container">
    <div class="header">
      <button class="add-button" @click="openAddFeedModal">Add Feeds</button>
    </div>
    <table class="styled-table">
      <thead>
      <tr>
        <th>Name</th>
        <th>Link</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(feed, index) in feeds" :key="index">
        <td>{{ feed.name }}</td>
        <td><a :href="feed.link" target="_blank">{{ feed.link }}</a></td>
        <td>
          <button class="action-button" @click="openEditFeedModal(index)">Edit</button>
          <button class="action-button" @click="deleteFeed(index)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  {{name}}
</template>

<script>
import AddSourceModal from "@/components/AddSourceModal.vue";
import EditFeedModal from "@/components/EditFeedModal.vue";


export default {
  components: {EditFeedModal, AddSourceModal},
  data() {
    return {
      feeds: [
        { name: "Named feed", link: "https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss" },
      ],
      name:'test',
      link:''
    };
  },
  methods: {

    saveNewFeed(name, link) {
      this.feeds.push({ name: name, link: link });
      this.name=name
      this.saveFeeds()
    },
    editFeed(index, name, link) {
      this.feeds[index] = { name, link };
      this.saveFeeds();
    },
    deleteFeed(index) {
      this.feeds.splice(index, 1);
      this.saveFeeds()
    },
    saveFeeds() {
      localStorage.setItem('feeds', JSON.stringify(this.feeds));
    },
    loadFeeds() {
      this.feeds = JSON.parse(localStorage.getItem('feeds'));
      const savedFeeds = localStorage.getItem('feeds');
      this.feeds = JSON.parse(savedFeeds);
    },
    openAddFeedModal() {
      this.$refs.addSourceModalRef.$refs.modalRef.openModal()

    },
    openEditFeedModal(index){
      this.$refs.editFeedModalRef.$refs.modalRef.openModal()
      this.$refs.editFeedModalRef.name=this.feeds[index].name;
      this.$refs.editFeedModalRef.link=this.feeds[index].name;
    }
  },
  beforeMount() {
    this.feeds={ name: "Named feed", link: "https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss" }
    this.loadFeeds()
  }
};
</script>

<style scoped>

</style>
