<template>
  <div style="background-color: #545454; color: white; display: flex; justify-content: center; align-items: center">
    <div style="display: flex; flex-direction: column; width: 40%; gap: 25px; padding-top: 40px;">
      <img src="/logo3.svg" alt="Logo" style="height: 226px;"/>
      <h1 class="text-2xl font-bold">Register</h1>
      <div>
        <label for="username">Username</label>
        <input type="text" name="username" id="username" placeholder="" v-model="username"/>
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="" v-model="email"/>
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" name="password" id="password" placeholder="" v-model="password"/>
      </div>
      <div>
        <label for="confirmedPassword">Confirm Password</label>
        <input type="password" name="confirmedPassword" id="confirmedPassword" placeholder="" v-model="confirmedPassword"/>
        <p v-if="!isPasswordMatching">Passwords do not match</p>
        <p v-if="!isPasswordLongEnough">Password must be at least 8 characters long</p>
      </div>
      <div style="justify-content: center; align-items: center; display: flex; flex-direction: column;">
        <button @click="register" :disabled="!isPasswordLongEnough && !isPasswordMatching" style="border-radius: 4px; background-color: white; border: none; padding: 10px 10px; cursor: pointer; width: 70%;">Register</button>
        <p><a href="/login" style="color: white;">Already have an account?</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser } from '../api/auth'
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      confirmedPassword: '',
      username: '',
    };
  },
  mounted() {
  },
  methods: {
    async register() {
      try {
        await registerUser({
          name: this.username,
          email: this.email,
          password: this.password,
          password_confirmation: this.confirmedPassword,
        })

        this.$router.push('/login')
      }catch (error) {
        alert('Registration failed.')
      }
    },
  },
  computed: {
    isPasswordMatching() {
      return this.password === this.confirmedPassword;
    },
    isPasswordLongEnough() {
      return this.password.length >= 8;
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