<template>
  <div>
    <slot name="trigger" :show="show" />
    <div ref="confirmModal" class="modal fade" tabindex="-1"
      role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-body">
            <slot name="content" />
            <p class="mb-0">
              Are you sure you want to continue?
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="onClickConfirm">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Modal } from 'bootstrap';

const emit = defineEmits(['confirm']);

const confirmModal = ref();
const modal = ref();

function show() {
  // const { confirmModal } = this.$refs;
  const options = {};
  const el = confirmModal.value;
  modal.value ??= new Modal(el as Element, options);
  modal.value.show();
}

function onClickConfirm() {
  modal.value.hide();
  emit('confirm');
}
</script>
