<template>
  <div v-if="isOpen" class="modal-backdrop fade show d-block"/>
  <FocusTrap v-if="isOpen" class="modal fade show" tabindex="-1" style="display: block;">
    <div class="modal-dialog" ref="Modal">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            <slot name="title">
              <!-- Title-->
            </slot>
          </h1>
        </div>
        <div class="modal-body">
          <slot name="body">
            <!-- body-->
          </slot>
        </div>
        <div class="modal-footer justify-content-center">
          <slot name="buttons">
            <!-- button -->
          </slot>
        </div>
      </div>
    </div>
  </FocusTrap>
</template>

<script>
import {FocusTrap} from "focus-trap-vue";

export default {
  name: 'Modal',
  components: {FocusTrap},
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    closeModal() {
      this.isOpen = false
    },
    openModal() {
      this.isOpen = true
    }
  }
}
</script>

<style scoped>

</style>