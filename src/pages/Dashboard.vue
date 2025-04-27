<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <p class="mt-2">Welcome to the dashboard! Here you can find various statistics and information.</p>

    <!-- temporal elements -->
    <p class="mt-2">Token actual:</p>
    <code class="text-sm break-all">{{ token }}</code>
    <button class="bg-red-500 text-white p-2 rounded mt-4" @click="logout">Logout</button>
  </div>
</template>

<script>
import { logoutUser } from '../api/auth'
import { useUserStore } from '../stores/user';
export default {
  name: 'Dashboard',
  data() {
    return {
      token: ''
    }
  },
  mounted() {
    this.token = localStorage.getItem('token')
  },
  methods: {
    logout() {
      const userStore = useUserStore()
      logoutUser({
          token: this.token
        });
      userStore.logout()
      
      this.$router.push('/login')
    }
  }
}
</script>
