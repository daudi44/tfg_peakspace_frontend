<template>
  <div style="margin: 180px 0px;">
    <div style="display: flex; flex-direction: row; gap: 15px; min-height: 50vh">
      <div style="display: flex; flex-direction: column; gap: 15px; flex: 2;">
        <TimeRecorder style="flex: 3;" :key="reloadKey" />
        <UserTimeStatistics style="flex: 2" />
        <button style="flex: 1;" @click="openTaskCreationModal">add task +</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 15px; flex: 4;">
        <TasksSection :status="0" :deployed="activeDeployStatus === 0" :key="reloadKey" @task-updated="reloadKey++"
          @toggle-deploy="toggleDeploy(0)" />
        <TasksSection :status="1" :deployed="activeDeployStatus === 1" :key="reloadKey + 1" @task-updated="reloadKey++"
          @toggle-deploy="toggleDeploy(1)" />
        <TasksSection :status="2" :deployed="activeDeployStatus === 2" :key="reloadKey + 2" @task-updated="reloadKey++"
          @toggle-deploy="toggleDeploy(2)" />
      </div>
    </div>
    <Separator />
    <CategoriesSection :type="1" />
    <Separator />
    <div>
      <div v-for="timeEntry in timeEntriesLog">
        <p>{{ timeEntry }}</p>
      </div>
    </div>

    <div v-if="showTaskCreationModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Create New Task</h2>
        <div>
          <label for="name">Name <span v-if="taskForm.name.length == 0">*</span></label>
          <input v-model="taskForm.name" placeholder="Name" />
        </div>
        <div>
          <label for="description">Description</label>
          <textarea v-model="taskForm.description" placeholder="Description"></textarea>
        </div>
        <div>
          <label for="category">Category <span v-if="taskForm.category_id.length == 0">*</span></label>
          <select v-model="taskForm.category_id">
            <option disabled value="">Select category</option>
            <option v-for="category in availableCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="parent_task">Parent task</label>
          <select v-model="taskForm.parent_task_id">
            <option value="">Select parent task</option>
            <option v-for="task in availableTasks" :key="task.id" :value="task.id">
              {{ task.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="start_date">Start Date <span v-if="taskForm.start_date.length == 0">*</span></label>
          <input type="date" v-model="taskForm.start_date" />
        </div>
        <div>
          <label for="due_date">Due date <span v-if="taskForm.due_date.length == 0">*</span></label>
          <input type="date" v-model="taskForm.due_date" />
        </div>

        <div style="margin-top: 20px; display: flex; flex-direction: row; gap: 5px;">
          <button @click="submitTask" :disabled="!isTaskFormValid"
            style="background-color: #009951; color: white; font-weight: bold;">Save</button>
          <button @click="closeTaskCreationModal"
            style="background-color: #FF4F4D; color: white; font-weight: bold;">Cancel</button>
        </div>
      </div>
    </div>

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
import { allTasks, addTask, timeEntries } from '../api/productivity';
import { getProductivityCategories } from '../api/general';
export default {
  name: 'Productivity',
  components: {
    TimeRecorder,
    UserTimeStatistics,
    CategoriesSection,
    TasksSection,
    Separator
  },
  data() {
    return {
      showTaskCreationModal: false,
      taskForm: {
        name: '',
        description: '',
        category_id: '',
        parent_task_id: '',
        start_date: '',
        due_date: ''
      },
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
      this.taskForm = {
        name: '',
        description: '',
        category_id: '',
        parent_task_id: '',
        start_date: '',
        due_date: ''
      };
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
    async submitTask() {
      try {
        const response = await addTask(this.taskForm);
        if (response.status === 201) {
          this.closeTaskCreationModal();
          this.fetchAvailableTasks();
          this.reloadKey++;
        }
      } catch (error) {
        console.error('Error creating task:', error);
      }
    },
    async fetchTimeEntriesLog() {
      const response = await timeEntries();
      console.log(response)
      this.timeEntriesLog = response.data;
    },
    toggleDeploy(status) {
      this.activeDeployStatus = this.activeDeployStatus === status ? null : status;
    }
  },
  computed: {
    isTaskFormValid() {
      return this.taskForm.name && this.taskForm.category_id && this.taskForm.start_date && this.taskForm.due_date;
    }
  }
}
</script>

<style scoped>
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
  position: absolute;
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