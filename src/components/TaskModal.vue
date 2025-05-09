<template>
    <div class="modal-task-overlay">
      <div class="modal-task-content">
        <h2>{{creation ? "Create New Task" : "Edit task"}}</h2>
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
            <option :value="null">Select parent task</option>
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
          <button @click="this.$emit('close')"
            style="background-color: #FF4F4D; color: white; font-weight: bold;">Cancel</button>
        </div>
      </div>
    </div>
</template>
<script>
import {  addTask } from '../api/productivity';
export default {
    name: 'TaskModal',
    props: {
        availableCategories: {
            type: Array,
            required: true
        },
        aTasks: {
            type: Array,
            required: true
        },
        creation: {
            type: Boolean,
            default: false
        },
        selectedTask: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            taskForm: {
                name: '',
                description: '',
                category_id: '',
                parent_task_id: null,
                start_date: '',
                due_date: ''
            },
            availableTasks: []
        };
    },
    computed: {
        isTaskFormValid() {
            return this.taskForm.name && this.taskForm.category_id && this.taskForm.start_date && this.taskForm.due_date;
        }
    },
    mounted() {
        if (!this.creation && this.selectedTask) {
            this.taskForm = { ...this.selectedTask };

            this.availableTasks = this.aTasks.filter(task => task.id !== this.selectedTask.id);
        }else if (this.creation){
          this.availableTasks = this.aTasks;
        }
    },
    methods: {
        async submitTask() {
            if (this.isTaskFormValid) {                
                if(this.creation) {
                    this.taskForm.id = null; 
                    await this.createTask();
                }else{
                    await this.saveTask();
                }
            }
        },
        async createTask() {
          try {
            const response = await addTask(this.taskForm);
            if (response.status === 201) {
              this.$emit('task-created');
            }
          } catch (error) {
            console.error('Error creating task:', error);
          }
        },
        async saveTask() {
          try {
            const response = await updateTask(this.taskForm);
            if (response.status === 200) {
              this.$emit('task-updated');
            }
          } catch (error) {
            console.error('Error updating task:', error);
          }
        },
    }
}
</script>
<style scoped>
.modal-task-overlay {
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
  z-index: 1000;
}

.modal-task-content {
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

.modal-task-content input,
select,
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-task-content textarea {
  resize: none;
}

.modal-task-content div {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>