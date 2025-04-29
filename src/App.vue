<template>
  <div :class="{ 'auth-background': !showHeader }">  
    <Header v-if="showHeader" />
    <!-- conditionally set padding top if showHeader -->
    <router-view style="padding: 0 30%;" />
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showHeader = computed(() => {
  const hiddenHeaderRoutes = ['/login', '/register']
  return !hiddenHeaderRoutes.includes(route.path)
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: "Josefin Sans", sans-serif;
}

.auth-background {
  background-color: #545454;
  min-height: 100vh;
}

</style>
