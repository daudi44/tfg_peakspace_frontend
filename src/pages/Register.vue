<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Register</h1>
    <input type="text" name="username" id="username" placeholder="Username" class="border p-2 mb-4 w-full" v-model="username"/>
    <input type="email" name="email" id="email" placeholder="Email" class="border p-2 mb-4 w-full" v-model="email"/>
    <input type="password" name="password" id="password" placeholder="Password" class="border p-2 mb-4 w-full" v-model="password"/>
    <input type="password" name="confirmedPassword" id="confirmedPassword" placeholder="Confirm Password" class="border p-2 mb-4 w-full" v-model="confirmedPassword"/>
    <p class="text-red-500" v-if="!isPasswordMatching">Passwords do not match</p>
    <p class="text-red-500" v-if="!isPasswordLongEnough">Password must be at least 8 characters long</p>
    <button class="bg-blue-500 text-white p-2 rounded" @click="register" :disabled="!isPasswordLongEnough && !isPasswordMatching">Register</button>
    <p class="mt-4">You already have an account? <a href="/login" class="text-blue-500">Log in</a></p>
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
