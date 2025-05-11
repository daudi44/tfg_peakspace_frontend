<template>
  <div class="header">
    <img src="/logo3.svg" alt="Logo" style="height: 160px;margin: 0px 20%" />
    <div>
      <button :class="{ active: isActive('/dashboard') }" @click="navigateTo('/dashboard')">
        <img :src="isActive('/dashboard') ? '/dashboard-active.svg' : '/dashboard.svg'" alt="Dashboard" />
        Dashboard
      </button>
      <button :class="{ active: isActive('/productivity') }" @click="navigateTo('/productivity')">
        <img :src="isActive('/productivity') ? '/productivity-active.svg' : '/productivity.svg'" alt="Productivity" />
        Productivity
      </button>
      <button :class="{ active: isActive('/economy') }" @click="navigateTo('/economy')">
        <img :src="isActive('/economy') ? '/economy-active.svg' : '/economy.svg'" alt="Economy" />
        Economy
      </button>
    </div>
    <div>
      <button :class="{ active: isActive('/profile') }" @click="navigateTo('/profile')">
        <img :src="isActive('/profile') ? '/user-active.svg' : '/user.svg'" alt="Profile" />
      </button>
      <button @click="logout">
        <img src="/logout.svg" alt="Logout" />
      </button>
    </div>
  </div>
</template>

<script>
import { logoutUser } from '../api/auth'
import { useUserStore } from '../stores/user';
export default {
  name: 'Header',
  data() {
    return {

    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route)
    },
    async logout() {
      const userStore = useUserStore()
      await logoutUser();
      userStore.logout();

      this.$router.push('/login')
    },
    isActive(path) {
      return this.$route.path === path
    },
  }
}
</script>

<style scoped>
.header {
  background-color: #545454;
  padding: 10px;
  position: fixed;
  top: 0;
  width: 100%;
  height: 90px;
  display: flex;
  z-index: 1001;
}

.header div {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.header button {
  color: white;
  border: none;
  background-color: #545454;
  margin: 0 10px;
  cursor: pointer;
  font-size: 20px;
  border-radius: 8px;
  box-shadow: none;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header button img {
  height: 60px;
  stroke: #7E4DF6;
}

button.active  {
  background-color: #2C2C2C;
  color: #7E4DF6;
}
</style>