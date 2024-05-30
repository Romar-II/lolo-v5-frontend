<template>
  <Modal ref="modalRef">
    <template #title>
      Delete feed?
    </template>

    <template #body>
      <p>
        Name:{{name}}
      </p>
      <p>
        Link:{{link}}
      </p>
    </template>


    <template #buttons>
      <button type="submit" class="action-button" @click="deleteFeed">Delete</button>
    </template>


  </Modal>
</template>


<script>

import Modal from "@/components/Modal.vue";


export default {
  name: "DeleteFeedModal",
  components: {Modal},
  data() {
    return {
      name: '',
      link: '',
      index:0,
    }
  },

  methods: {
    deleteFeed() {
      this.$emit('event-delete-feed',this.index);
      this.closeModal()
    },
    closeModal() {
      this.$refs.modalRef.closeModal();
    }

  }

}
</script>

<style scoped>

</style>