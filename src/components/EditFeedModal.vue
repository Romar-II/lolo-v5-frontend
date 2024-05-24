<template>
  <Modal ref="modalRef">
    <template #title>
      Edit feed
    </template>

    <template #body>
      <div class="container text-start">
        <div class="row justify-content-center">
          <div class="col">
            <div class="mb-3">
              <label for="username" class="form-label ">Feed name:</label>
              <input v-model="name" type="text">
              <small v-if="!name && formInvalid" class="text-danger">insert feed name</small>
            </div>
            <div class="mb-3">
              <label for="username" class="form-label ">URL:</label>
              <input v-model="link" type="text">
              <small v-if="!link && formInvalid" class="text-danger">Insert url</small>
            </div>
          </div>
        </div>
      </div>
    </template>


    <template #buttons>
      <button type="submit" class="action-button" @click="saveNewFeed">Save</button>
      <button type="button" class="action-button" @click="closeModal">Cancel</button>
    </template>


  </Modal>
</template>


<script>

import Modal from "@/components/Modal.vue";


export default {
  name: "EditFeedModal",
  components: {Modal},
  data() {
    return {
      name: '',
      link: '',
      index:0,
      message: '',
      formInvalid: false
    }
  },

  methods: {
    saveNewFeed() {
      this.formInvalid=false
      if (this.name == "" || this.link == "") {
        this.displayErrormessage()
      } else {
        this.$emit('event-edit-feed',this.index, this.name, this.link);
        this.resetForm()
        this.closeModal()
      }

    },
    displayErrormessage(){
      this.formInvalid=true
      setTimeout(this.resetErrorMessage, 3000);
    },
    resetForm(){
      this.name=''
      this.link=''
    },
    resetErrorMessage(){
      this.formInvalid=false;
    },
    closeModal() {
      this.$refs.modalRef.closeModal();
    }

  }

}
</script>

<style scoped>

</style>