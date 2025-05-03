<template>
    <div style="margin-top: 130px;">
      <h1 class="text-2xl font-bold">Economy</h1>
      <CategoriesSection :type="2"/>
    </div>
  </template>
  
  <script>
  import CategoriesSection from '../components/CategoriesSection.vue';
  export default {
    name: 'Economy',
    components: {
      CategoriesSection
    },
  }
  </script>
  