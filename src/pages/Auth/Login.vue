<template>
    <div style="background-color: #545454; color: white; display: flex; justify-content: center; align-items: center;">
      <div style="display: flex; flex-direction: column; width: 25%; gap: 25px; padding-top: 100px;">
        <img src="/logo3.svg" alt="Logo" style="height: 226px;"/>
        <h1 style="font-weight: bold;">Login</h1>
        <div>
          <label for="email">Email</label>
          <input type="email" name="email" id="email" placeholder=""  v-model="email"/>
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" name="password" id="password" placeholder="" v-model="password"/>
        </div>
        <div style="justify-content: center; align-items: center; display: flex; flex-direction: column;">
          <button style="border-radius: 4px; background-color: white; border: none; padding: 10px 10px; cursor: pointer; width: 70%;" @click="login">Login</button>
          <p><a href="/register" style="color: white; cursor: pointer;">Create an account</a></p>
        </div>
      </div>
    </div>
  </template>
  
<script>
import { loginUser, getUser } from '../../api/auth'
import { useUserStore } from '../../stores/user';
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
        console.log('userData:', userData)
        userStore.setUser(userData.data)
        console.log('userStore.user:', userStore.user)

        this.$router.push('/dashboard')
      }catch (error) {
        alert('Login failed. Please check your credentials.')
      }
    },
  },
}
</script>
  
<style scoped>
input {
  border-radius: 4px;
  border: none;
  padding: 10px;
  width: 100%;
  color: white;
  background-color: #1E1E1E;
}
</style>