<template>
  <div>
    <table v-if="rssFeeds.length" class="table">
      <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Link</th>
        <th scope="col">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="feed in rssFeeds" :key="feed.id">
        <td>{{ feed.name }}</td>
        <td><a :href="feed.link" target="_blank">{{ feed.link }}</a></td>
        <td>
          <button class="button me-md-2" @click="openEditModal(feed)"><font-awesome-icon :icon="['fas', 'edit']" /></button>
          <button class="button" @click="openDeleteModal(feed)"><font-awesome-icon :icon="['fas', 'trash']" /></button>
        </td>
      </tr>
      </tbody>
    </table>

    <button class="button mt-3" @click="openAddModal">Add RSS Feed</button>

    <!-- Edit Modal -->
    <div v-if="isEditModalOpen" class="modal">
      <div class="modal-content">
        <h3>Edit RSS Feed</h3>
        <label>Name:</label>
        <input v-model="currentFeed.name" />
        <label>Link:</label>
        <input v-model="currentFeed.link" />
        <button @click="updateFeed">Save</button>
        <button @click="closeEditModal">Cancel</button>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="isDeleteModalOpen" class="modal">
      <div class="modal-content">
        <h3>Delete RSS Feed</h3>
        <p>Are you sure you want to delete {{ currentFeed.name }}?</p>
        <button @click="deleteFeed">Yes</button>
        <button @click="closeDeleteModal">No</button>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="isAddModalOpen" class="modal">
      <div class="modal-content">
        <h3>Add RSS Feed</h3>
        <label>Name:</label>
        <input v-model="newFeed.name" />
        <label>Link:</label>
        <input v-model="newFeed.link" />
        <button @click="addFeed">Add</button>
        <button @click="closeAddModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rssFeeds: [
        // Example feeds
        { id: 1, name: 'Feed 1', link: 'http://feed1.com/rss' },
        { id: 2, name: 'Feed 2', link: 'http://feed2.com/rss' },
      ],
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isAddModalOpen: false,
      currentFeed: {},
      newFeed: { name: '', link: '' },
    };
  },
  methods: {
    openEditModal(feed) {
      this.currentFeed = { ...feed };
      this.isEditModalOpen = true;
    },
    closeEditModal() {
      this.isEditModalOpen = false;
      this.currentFeed = {};
    },
    updateFeed() {
      // Find the feed and update it
      const index = this.rssFeeds.findIndex(f => f.id === this.currentFeed.id);
      if (index !== -1) {
        this.$set(this.rssFeeds, index, this.currentFeed);
      }
      this.closeEditModal();
    },
    openDeleteModal(feed) {
      this.currentFeed = { ...feed };
      this.isDeleteModalOpen = true;
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.currentFeed = {};
    },
    deleteFeed() {
      this.rssFeeds = this.rssFeeds.filter(f => f.id !== this.currentFeed.id);
      this.closeDeleteModal();
    },
    openAddModal() {
      this.isAddModalOpen = true;
    },
    closeAddModal() {
      this.isAddModalOpen = false;
      this.newFeed = { name: '', link: '' };
    },
    addFeed() {
      const newId = Math.max(...this.rssFeeds.map(f => f.id)) + 1;
      this.rssFeeds.push({ id: newId, ...this.newFeed });
      this.closeAddModal();
    },
  },
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}

button {
  margin: 5px;
}
</style>
