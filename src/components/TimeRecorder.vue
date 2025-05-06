<template>
    <div class="recorder-container">
        <h1 class="title">Time Recorder</h1>

        <div class="timer-display">
            {{ formattedTime }}
        </div>

        <div class="button-group">
            <button class="start-button" @click="startTimer" :disabled="isRecording">
                ▶️
            </button>
            <button class="stop-button" @click="stopTimer" :disabled="!isRecording">
                ⏹
            </button>
        </div>

        <div class="selector-group">
            <label for="task">Select Task or Category</label>
            <select v-model="selectedItem" class="selector">
                <optgroup label="Tasks In Progress">
                    <option v-for="task in inProgressTasks" :key="'task-' + task.id" :value="'task-' + task.id">
                        {{ task.name }}
                    </option>
                </optgroup>
                <optgroup label="Categories">
                    <option v-for="category in categories" :key="'cat-' + category.id" :value="'cat-' + category.id">
                        {{ category.name }}
                    </option>
                </optgroup>
            </select>
        </div>
    </div>
</template>

<script>
import { getProductivityCategories } from '../api/general';
import { tasksByStatus, startTimeEntry, stopTimeEntry } from '../api/productivity';

export default {
    name: 'TimeRecorder',
    data() {
        return {
            isRecording: false,
            secondsElapsed: 0,
            timer: null,
            selectedItem: '',
            inProgressTasks: [],
            categories: [],
            startedAt: null
        };
    },
    computed: {
        formattedTime() {
            const hours = String(Math.floor(this.secondsElapsed / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((this.secondsElapsed % 3600) / 60)).padStart(2, '0');
            const seconds = String(this.secondsElapsed % 60).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }
    },
    async mounted() {
        await this.loadTasksAndCategories();
    },
    methods: {
        async loadTasksAndCategories() {
            const taskResponse = await tasksByStatus({ status: 1 });
            this.inProgressTasks = taskResponse.data;

            const categoryResponse = await getProductivityCategories();
            this.categories = categoryResponse.data.categories;
        },

        async startTimer() {
            if (!this.selectedItem) {
                alert('Please select a task or category to begin tracking.');
                return;
            }

            const now = new Date().toISOString();
            this.startedAt = now;
            this.isRecording = true;
            this.secondsElapsed = 0;

            // Detectar tipo e id
            const [type, id] = this.selectedItem.split('-');
            const data = {
                start_time: now,
            };
            if (type === 'task') data.task_id = id;
            if (type === 'cat') data.category_id = id;

            try {
                await startTimeEntry(data);
                this.timer = setInterval(() => {
                    this.secondsElapsed++;
                }, 1000);
            } catch (error) {
                alert('Could not start time entry');
                this.isRecording = false;
            }
        },

        async stopTimer() {
            if (!this.isRecording) return;

            const now = new Date().toISOString();
            this.isRecording = false;
            clearInterval(this.timer);
            this.timer = null;

            try {
                await stopTimeEntry({ end_time: now });
                console.log('Time entry successfully stopped');
            } catch (error) {
                alert('Could not stop time entry');
            }
        }
    }
};
</script>

<style scoped>
.recorder-container {
    background-color: #2C2C2C;
    color: white;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
}

.title {
    margin-bottom: 10px;
}

.timer-display {
    font-size: 72px;
    font-weight: bold;
    background-color: #737373;
    border-radius: 8px;
    padding: 10px;
    margin: 20px 0;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
}

.start-button,
.stop-button {
    font-size: 32px;
    padding: 20px;
    border: none;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    cursor: pointer;
}

.start-button {
    background-color: #009951;
    color: white;
}

.stop-button {
    background-color: #FF4F4D;
    color: white;
}

.selector-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.selector {
    padding: 10px;
    border-radius: 4px;
    border: none;
    width: 100%;
}
</style>