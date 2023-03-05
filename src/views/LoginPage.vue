<template>
  <form class="d-flex justify-content-center" @submit="signInWithGoogle">
    <button type="submit" class="btn btn-primary">
      Sign in with Google
    </button>
  </form>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { getCurrentUser, useFirebaseAuth } from 'vuefire';
import { useRoute, useRouter } from 'vue-router';
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const signInWithGoogle = () => {
  const auth = useFirebaseAuth();
  if (auth) signInWithRedirect(auth, provider);
};

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    const to = route?.query.redirectTo && typeof route?.query.redirectTo === 'string'
      ? route.query.redirectTo
      : '/';

    router.push(to);
  }
});
</script>

<style scoped></style>
