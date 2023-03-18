<template>
  <div v-if="options.length > 1" class="dropdown-center">
    <button type="button" class="me-1 btn btn-sm btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
      Switch Role
    </button>
    <ul class="dropdown-menu">
      <li v-for="roleOption in options" :key="roleOption">
        <button type="button" :class="['dropdown-item', { active: roleOption === role }]"
          :aria-current="roleOption === role" @click="confirmRole(roleOption)">
          {{ roleOption }}
        </button>
      </li>
    </ul>

    <div ref="confirmModal" class="modal fade" tabindex="-1"
      role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-body">
            <p>
              Changing role to <strong>{{ selectedRole }}</strong> will reset this model's wargear.
            </p>
            <p class="mb-0">
              Are you sure you want to continue?
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-light" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-sm btn-primary" @click="onClickConfirm">
              OK
            </button>
          </div>
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
    role: {
      type: String,
      default: null,
    },
    options: {
      type: Array<string>,
      required: true,
    },
  },
  emits: ['update:role'],
  data() {
    return {
      selectedRole: null,
      modal: null,
    } as {
      selectedRole: string | null,
      modal: Modal | null
    };
  },
  methods: {
    confirmRole(role: string) {
      this.selectedRole = role;
      const options = {};
      const { confirmModal } = this.$refs;
      this.modal ??= new Modal(confirmModal as Element, options);
      this.modal.show();
    },
    onClickConfirm() {
      if (this.selectedRole) this.$emit('update:role', this.selectedRole);
      this.modal?.hide();
      this.selectedRole = null;
    },
  },
});
</script>
