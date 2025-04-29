<template>
    <div class="header">
      <img src="/logo3.svg" alt="Logo" style="height: 160px;margin: 0px 20%" />
      <div>
        <button @click="navigateTo('/dashboard')">Dashboard</button>
        <button @click="navigateTo('/productivity')">Productivity</button>
        <button @click="navigateTo('/economy')">Economy</button>
      </div>
      <div>
        <button @click="navigateTo('/profile')">Profile</button>
        <button @click="logout">Logout</button>
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
  
  <style scoped>
  .header {
      background-color: #545454;
      padding: 10px;
      position: fixed;
      top: 0;
      width: 100%;
      height: 90px;
      display: flex;
      margin-bottom: 130px;
  }
  </style>
  