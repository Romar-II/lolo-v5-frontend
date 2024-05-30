<template>
  <AddSourceModal ref="addSourceModalRef" @event-save-new-feed="saveNewFeed"/>
  <EditFeedModal ref="editFeedModalRef" @event-edit-feed="editFeed"/>
  <DeleteFeedModal ref="deleteFeedModalRef" @event-delete-feed="deleteFeed"/>
  <div class="table-container">
    <div class="header">
      <button class="add-button" @click="openAddFeedModal">Add Feeds</button>
    </div>
    <table class="styled-table">
      <thead>
      <tr>
        <th>Name</th>
        <th>Link</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(feed, index) in feeds" :key="index">
        <td>{{ feed.name }}</td>
        <td><a :href="feed.link" target="_blank">{{ feed.link }}</a></td>
        <td v-if="feed.name==='Initial content'"></td>
        <td v-if="feed.name!=='Initial content'">
          <button class="action-button" @click="openEditFeedModal(index)">Edit</button>
          <button class="action-button" @click="openDeleteFeedModal(index)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import AddSourceModal from "@/components/AddSourceModal.vue";
import EditFeedModal from "@/components/EditFeedModal.vue";
import DeleteFeedModal from "@/components/DeleteFeedModal.vue";

export default {
  components: {DeleteFeedModal, EditFeedModal, AddSourceModal},
  data() {
    return {
      feeds: [],
      name: 'test',
      link: ''
    };
  },
  methods: {
    saveNewFeed(name, link) {
      this.feeds.push({ name, link });
      this.name = name;
      this.saveFeeds();
    },
    editFeed(index, name, link) {
      this.name = name;
      this.feeds[index] = { name, link };
      this.saveFeeds();
    },
    deleteFeed(index) {
      this.feeds.splice(index, 1);
      this.saveFeeds();
    },
    saveFeeds() {
      localStorage.setItem('feeds', JSON.stringify(this.feeds));
    },
    loadFeeds() {
      try {
        const storedFeeds = JSON.parse(localStorage.getItem('feeds'));
        if (storedFeeds) {
          this.feeds = storedFeeds;
        }
      } catch (error) {
        console.error('Error loading feeds from localStorage', error);
      }
    },
    openAddFeedModal() {
      this.$refs.addSourceModalRef.$refs.modalRef.openModal();
    },
    openEditFeedModal(index) {
      this.$refs.editFeedModalRef.$refs.modalRef.openModal();
      this.$refs.editFeedModalRef.index = index;
      this.$refs.editFeedModalRef.name = this.feeds[index].name;
      this.$refs.editFeedModalRef.link = this.feeds[index].link;
    },
    openDeleteFeedModal(index) {
      this.$refs.deleteFeedModalRef.$refs.modalRef.openModal();
      this.$refs.deleteFeedModalRef.name = this.feeds[index].name;
      this.$refs.deleteFeedModalRef.link = this.feeds[index].link;
      this.$refs.deleteFeedModalRef.index = index;
    }
  },
  mounted() {
    this.loadFeeds();
  }
};
</script>

<style scoped>

</style>
