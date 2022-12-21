<template>
  <div v-if="options.length > 1" class="dropdown-center">
    <button type="button" class="me-1 btn btn-sm btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
      Switch Role
    </button>
    <ul class="dropdown-menu">
      <li v-for="(r) in options" :key="r" :value="r">
        <a :class="['dropdown-item', { active: r === value }]" :aria-current="r === value" @click="selectedRole = r">
          {{ r }}
        </a>
      </li>
    </ul>

    <div ref="confirmModel" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel"
    <div ref="confirmModel" class="modal fade" tabindex="-1"
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          Changing role to {{ currentRole }} will reset this model's wargear, are you sure you want to continue?
        </div>
        <div class="Modal-footer">
          <button type="button" class="btn btn-sm btn-light">
            Cancel
          </button>
          <button type="button" class="btn btn-sm btn-primary">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Modal } from 'bootstrap';

export default defineComponent({
  props: {
    value: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentRole: null,
      modal: null,
    };
  },
  computed: {
    selectedRole: {
      get() {
        return this.value;
      },
      set(value) {
        this.currentRole = value;

        const options = {};
        const { confirmModal } = this.$refs;
        this.modal = new Modal(confirmModal, options);
        // or
      },
    },
  },
});
</script>
