<template>
    <div style="margin-top: 130px;">
      <h1 class="text-2xl font-bold">Productivity</h1>
      <TimeRecorder />
    </div>
  </template>
  
  <script>
  import TimeRecorder from '../components/TimeRecorder.vue'
  export default {
    name: 'Productivity',
    components: {
      TimeRecorder
    },
  }
  </script>
  