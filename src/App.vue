<template>
  <Header />
  <router-view style="margin: 0 30%; padding-top: 130px;" />
  <Footer />
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: "Josefin Sans", sans-serif;  
}
</style>