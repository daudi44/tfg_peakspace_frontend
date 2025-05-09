<template>
  <div style="margin: 180px 0px;">
    <div style="display: flex; flex-direction: row; gap: 15px; min-height: 50vh">
      <div style="display: flex; flex-direction: column; gap: 15px; flex: 2;">
        <TimeRecorder style="flex: 3;" :key="reloadKey" />
        <UserTimeStatistics style="flex: 2" />
        <button style="background-color: #5438DC; color: white; font-size: 20px; font-weight: bold; padding: 20px;" @click="openTaskCreationModal">Add Task +</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 15px; flex: 4;">
        <TasksSection :status="0" :deployed="activeDeployStatus === 0" :key="reloadKey" @task-updated="reloadKey++"
          @toggle-deploy="toggleDeploy(0)" :availableCategories="availableCategories" :availableTasks="availableTasks" />
        <TasksSection :status="1" :deployed="activeDeployStatus === 1" :key="reloadKey" @task-updated="reloadKey++"
          @toggle-deploy="toggleDeploy(1)" :availableCategories="availableCategories" :availableTasks="availableTasks" />
        <TasksSection :status="2" :deployed="activeDeployStatus === 2" :key="reloadKey" @task-updated="reloadKey++"
          @toggle-deploy="toggleDeploy(2)" :availableCategories="availableCategories" :availableTasks="availableTasks" />
      </div>
    </div>
    <Separator />
    <CategoriesSection :type="1" @category-updated="reloadKey++" />
    <Separator />
    <div>
      <h2>Time entries log</h2>
      <div v-if="timeEntriesLog.length > 0" class="time-entries-table">
        <table>
          <thead>
            <tr>
              <th>Identifier</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Time Elapsed</th>
              <th>Registered Element</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(timeEntry, index) in timeEntriesLog" :key="timeEntry.id"
              :class="{ even: index % 2 === 0, odd: index % 2 !== 0 }">
              <td>{{ timeEntry.id }}</td>
              <td>{{ formatDate(timeEntry.start_time) }}</td>
              <td>{{ timeEntry.end_time ? formatDate(timeEntry.end_time) : 'Not finished' }}</td>
              <td>{{ formatElapsed(timeEntry.seconds_elapsed) }}</td>
              <td>
                <span v-if="timeEntry.registrable_type === 'App\\Models\\Task'">
                  {{availableTasks.find(task => task.id === timeEntry.registrable_id)?.name || 'Task'}}
                </span>
                <span v-else>
                  {{availableCategories.find(cat => cat.id === timeEntry.registrable_id)?.name || 'Category'}}
                </span>
              </td>
              <td>
                <button style="background-color: #FF4F4D; color: white;" @click="deleteTimeEntry(timeEntry.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>No time entries reigstered yet!</p>

    </div>

    <TaskModal v-if="showTaskCreationModal" :availableCategories="availableCategories"
            :aTasks="availableTasks" @close="showTaskCreationModal = false" :creation="true" @task-created="closeTaskCreationModal()" />

    <div v-if="loading" class="overlay" style="z-index: 11;">
      <div class="spinner"></div>
    </div>

  </div>
</template>

<script>
import TimeRecorder from '../components/TimeRecorder.vue'
import UserTimeStatistics from '../components/UserTimeStatistics.vue';
import CategoriesSection from '../components/CategoriesSection.vue';
import Separator from '../components/Separator.vue';
import TasksSection from '../components/TasksSection.vue';
import TaskModal  from '../components/TaskModal.vue';
import { allTasks, timeEntries, deleteTimeEntry } from '../api/productivity';
import { getProductivityCategories } from '../api/general';
import { format } from 'date-fns';
export default {
  name: 'Productivity',
  components: {
    TimeRecorder,
    UserTimeStatistics,
    CategoriesSection,
    TasksSection,
    Separator,
    TaskModal
  },
  data() {
    return {
      showTaskCreationModal: false,
      timeEntriesLog: [],
      availableTasks: [],
      availableCategories: [],
      reloadKey: 0,
      loading: false,
      activeDeployStatus: 0,
    }
  },
  mounted() {
    this.fetchAvailableTasks();
    this.fetchAvailableCategories();
    this.fetchTimeEntriesLog();
  },
  methods: {
    async openTaskCreationModal() {
      this.loading = true;
      await this.fetchAvailableCategories();
      this.loading = false;
      this.showTaskCreationModal = true;
    },
    closeTaskCreationModal() {
      this.showTaskCreationModal = false;
      this.reloadKey++;
    },
    formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy HH:mm');
    },
    async fetchAvailableTasks() {
      try {
        const response = await allTasks();
        this.availableTasks = response.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    async fetchAvailableCategories() {
      try {
        const response = await getProductivityCategories();
        this.availableCategories = response.data.categories;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchTimeEntriesLog() {
      const response = await timeEntries();
      this.timeEntriesLog = response.data;
    },
    toggleDeploy(status) {
      this.activeDeployStatus = this.activeDeployStatus === status ? null : status;
    },
    formatElapsed(eSeconds) {
      const hours = String(Math.floor(eSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((eSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(Math.floor(eSeconds % 60)).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
    deleteTimeEntry(timeEntryId) {
      this.loading = true;
      deleteTimeEntry({ time_entry_id: timeEntryId }).then(() => {
        this.timeEntriesLog = this.timeEntriesLog.filter(entry => entry.id !== timeEntryId);
        this.loading = false;
      }).catch(error => {
        console.error('Error deleting time entry:', error);
        this.loading = false;
      });
    }
  },
}
</script>

<style scoped>
.time-entries-table {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 20px;
}

.time-entries-table table {
  width: 100%;
  border-collapse: collapse;
}

.time-entries-table thead {
  background-color: #57B8FF;
  color: white;
}

.time-entries-table th,
.time-entries-table td {
  padding: 12px 16px;
  text-align: left;
}

.time-entries-table tbody tr.even {
  background-color: #CECECE;
}

.time-entries-table tbody tr.odd {
  background-color: #ECECEC;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.modal-content input,
select,
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-content textarea {
  resize: none;
}

.modal-content div {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 8px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #2C2C2C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>