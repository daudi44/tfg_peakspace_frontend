<template>
    <div style="margin: 130px 0px;">
      <div style="display: flex; flex-direction: row; gap: 15px; min-height: 50vh">
        <div style="display: flex; flex-direction: column; gap: 15px; flex: 2;">
          <TimeRecorder style="flex: 3;"/>
          <UserTimeStatistics style="flex: 2" />
          <button style="flex: 1;">add task +</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 15px; flex: 4;">
          <p>In progress</p>
          <p>Not started</p>
          <p>Finished</p>
        </div>
      </div>
      <CategoriesSection :type="1"/>
      <p>time entries log</p>
    </div>
  </template>
  
  <script>
  import TimeRecorder from '../components/TimeRecorder.vue'
  import UserTimeStatistics from '../components/UserTimeStatistics.vue';
  import CategoriesSection from '../components/CategoriesSection.vue';
  export default {
    name: 'Productivity',
    components: {
      TimeRecorder,
      UserTimeStatistics,
      CategoriesSection
    },
  }
  </script>
  