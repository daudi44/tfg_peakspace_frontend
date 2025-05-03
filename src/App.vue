<template>
  <div :class="{ 'auth-background': !showHeader }">  
    <Header v-if="showHeader" />
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

button {
  border-radius: 4px;
  background-color: white;
  border: none;
  margin: 0px;
  padding: 5px 10px;
  cursor: pointer;
  height: fit-content;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

button:hover {
  background-color: #F1F1F1;
}

button:disabled {
  background-color: #E0E0E0;
  cursor: not-allowed;
}


.auth-background {
  background-color: #545454;
  min-height: 100vh;
}

</style>
