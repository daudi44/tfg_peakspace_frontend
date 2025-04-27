<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold">Login</h1>
      <input type="email" name="email" id="email" placeholder="Email" class="border p-2 mb-4 w-full" v-model="email"/>
      <input type="password" name="password" id="password" placeholder="Password" class="border p-2 mb-4 w-full" v-model="password"/>
      <button class="bg-blue-500 text-white p-2 rounded" @click="login">Login</button>
      <p class="mt-4">Don't have an account? <a href="/register" class="text-blue-500">Register</a></p>
    </div>
  </template>
  
<script>
import { loginUser, getUser } from '../api/auth'
import { useUserStore } from '../stores/user';
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  mounted() {
  },
  methods: {
    async login() {
      const userStore = useUserStore()
      try {
        const loginData = await loginUser({
          email: this.email,
          password: this.password,
        })
        userStore.setToken(loginData.data.token)

        const userData = await getUser(loginData.data.token)
        userStore.setUser(userData.data)

        this.$router.push('/dashboard')
      }catch (error) {
        alert('Login failed. Please check your credentials.')
      }
    },
  },
}


</script>
  