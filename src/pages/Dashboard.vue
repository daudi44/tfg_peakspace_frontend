<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <p class="mt-2">Welcome to the dashboard! Here you can find various statistics and information.</p>
    <p class="mt-2">Token actual:</p>
    <code class="text-sm break-all">{{ token }}</code>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      token: ''
    }
  },
  mounted() {
    this.token = localStorage.getItem('token')
  }
}
</script>
