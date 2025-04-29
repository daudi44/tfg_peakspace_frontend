<template>
    <div style="margin-top: 130px;">
      <div style="display: flex; flex-direction: row; gap: 15px;">
        <div style="display: flex; flex-direction: column; gap: 15px; flex: 2;">
          <TimeRecorder />
        </div>
        <div style="display: flex; flex-direction: column; gap: 15px; flex: 4;"">
          <p>In progress</p>
          <p>Not started</p>
          <p>Finished</p>
        </div>
      </div>
      <p>productivity categories</p>
      <p>time entries log</p>
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
  