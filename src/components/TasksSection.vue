<template>
    <div class="task-list-container">
        <div class="task-list-wrapper">
            <div
                style="display: flex; flex-direction: row; align-items: center; color: white; padding: 0px 20px; justify-content: space-between;">
                <h2>{{ statusName }} <span style="cursor: pointer;" @click="$emit('toggle-deploy')">{{ !deployed ? "▶️"
                    :
                        "⤴️" }}</span></h2>
                <p>Total tasks: {{ tasks.length }}</p>
            </div>

            <div class="task-list-delimiter" v-if="deployed">
                <div v-if="tasks.length > 0" v-for="(task, index) in tasks" :key="task.id" class="task-list-content"
                    :class="{
                        'even': index % 2 === 0, 'odd': index % 2 !== 0,
                        last: index === tasks.length - 1
                    }">
                    <div>
                        <h3>{{ task.name }} - {{ task.category.name }}</h3>
                        <p>{{ task.description }}</p>
                        <!-- total time -->
                        <p>Total time: {{ calcTotalTime(task.total_time) }} seconds</p>
                    </div>
                    <div>
                        <div>
                            <p>Start Date: {{ formatDate(task.start_date) }}</p>
                            <p>Due Date: {{ formatDate(task.due_date) }}</p>
                        </div>
                        <div style="display: flex; flex-direction: row; gap: 10px">
                            <button style="background-color: #009951; color: white;"
                                @click="changeStatus(task.id)">Change
                                Status</button>
                            <button>Edit</button>
                            <button style="background-color: #FF4F4D; color: white;"
                                @click="deleteTask(task.id)">Delete</button>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p class="last odd  task-list-content" style="height: 50px; margin: 0; align-items: center;">There
                        are no tasks with this
                        status.
                    </p>
                </div>
            </div>

            <div v-if="loading" class="overlay" style="z-index: 11;">
                <div class="spinner"></div>
            </div>

            <div v-if="showUpdateStatusModal" class="overlay">
                <div class="modal-content">
                    <h2>Change Task "{{ selectedTask.name }}" Status</h2>
                    <select name="newStatus" id="newStatus" v-model="newStatusValue"
                        style="padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px;">
                        <option value="0" :selected="selectedTask.status === 0">To Do</option>
                        <option value="1" :selected="selectedTask.status === 1">In Progress</option>
                        <option value="2" :selected="selectedTask.status === 2">Finished</option>
                    </select>
                    <div style="display: flex; flex-direction: row; gap: 10px;">
                        <button @click="storeChangeStatus(selectedTask.id, newStatusValue)"
                            style="background-color: #009951; color: white;">Yes</button>
                        <button @click="showUpdateStatusModal = false"
                            style="background-color: #FF4F4D; color: white;">No</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import { tasksByStatus, deleteTask, updateTaskStatus } from '../api/productivity';
import { format } from 'date-fns';
export default {
    props: {
        status: {
            type: Number,
            required: true,
        },
        deployed: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            tasks: [],
            loading: false,
            selectedTask: null,
            newStatusValue: null,
            showUpdateStatusModal: false,
        };
    },
    async mounted() {
        this.loading = true;
        await this.loadTasks();
        this.loading = false;
    },
    methods: {
        async loadTasks() {
            return tasksByStatus({ status: this.status }).then((data) => {
                console.log(data.data);
                this.tasks = data.data;
            });
        },
        formatDate(date) {
            return format(new Date(date), 'dd/MM/yyyy');
        },
        async deleteTask(taskId) {
            this.loading = true;
            await deleteTask({ task_id: taskId }).then(() => {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.loading = false;
            });
        },
        changeStatus(taskId) {
            this.selectedTask = this.tasks.find(task => task.id === taskId);
            this.newStatusValue = this.selectedTask.status;
            this.showUpdateStatusModal = true;
        },
        async storeChangeStatus() {
            this.loading = true;
            await updateTaskStatus({
                task_id: this.selectedTask.id,
                status: this.newStatusValue
            }).then(() => {
                this.tasks = this.tasks.map(task => {
                    if (task.id === this.selectedTask.id) {
                        task.status = this.newStatusValue;
                    }
                    return task;
                });
                this.showUpdateStatusModal = false;
                this.selectedTask = null;
                this.newStatusValue = null;
                this.$emit('task-updated');
                this.loading = false;
            });
        },
        calcTotalTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secondsLeft = seconds % 60;
            return `${hours}h ${minutes}m ${secondsLeft}s`;
        }
    },
    computed: {
        statusName() {
            if (this.status === 0) {
                return 'To Do';
            } else if (this.status === 1) {
                return 'In Progress';
            } else if (this.status === 2) {
                return 'Fiinshed';
            }
        }
    }
}
</script>
<style scoped>
.task-list-container {
    border-radius: 8px;
    background-color: #57B8FF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-list-content {
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.task-list-content.even {
    background-color: #CECECE;
}

.task-list-content.odd {
    background-color: #ECECEC;
}

.task-list-content.last {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.task-list-delimiter {
    max-height: 40vh;
    overflow-y: auto;
}

.task-list-wrapper {
    position: relative;
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
</style>