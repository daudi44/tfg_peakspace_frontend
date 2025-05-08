<template>
    <div class="recorder-container">
        <h1 class="title">Time Recorder</h1>

        <div class="timer-display">
            {{ formattedTime }}
        </div>

        <div class="button-group">
            <button class="start-button" @click="startTimer" :disabled="isRecording">
                <img src="../assets/play.svg" alt="Start" width="50" height="50" />
            </button>
            <button class="stop-button" @click="stopTimer" :disabled="!isRecording">
                ⏹
            </button>
        </div>

        <div class="selector-group">
            <label for="task">Select Task or Category</label>
            <select v-model="selectedItem" class="selector" :disabled="isRecording">
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

        <div v-if="loading" class="overlay">
            <div class="spinner"></div>
        </div>
    </div>
</template>

<script>
import { getProductivityCategories } from '../api/general';
import { tasksByStatus, startTimeEntry, stopTimeEntry, lastTimeEntry } from '../api/productivity';

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
            lastTimeEntry: null,
            startedAt: null,
            loading: false,
        };
    },
    computed: {
        formattedTime() {
            const hours = String(Math.floor(this.secondsElapsed / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((this.secondsElapsed % 3600) / 60)).padStart(2, '0');
            const seconds = String(this.secondsElapsed % 60).padStart(2, '0');
            console.log('formatted time', hours, minutes, seconds, this.secondsElapsed);
            return `${hours}:${minutes}:${seconds}`;
        }
    },
    async mounted() {
        this.loading = true;
        await this.loadTasksAndCategories();
        await this.getLastTimeEntry();
        this.loading = false;
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

            this.startedAt = new Date();
            this.isRecording = true;
            this.secondsElapsed = 0;

            const [type, id] = this.selectedItem.split('-');
            const data = {
                start_time: new Date(),
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
            this.secondsElapsed = 0;
            clearInterval(this.timer);
            this.timer = null;

            try {
                await stopTimeEntry({ end_time: now });
                console.log('Time entry successfully stopped');
            } catch (error) {
                alert('Could not stop time entry');
            }
        },

        async getLastTimeEntry() {
            try {
                const response = await lastTimeEntry();
                this.lastTimeEntry = response.data;
                if (response.data == null) {
                    this.lastTimeEntry = null;
                    this.isRecording = false;
                    this.secondsElapsed = 0;
                    return;
                }

                if (!this.lastTimeEntry || Object.keys(this.lastTimeEntry).length === 0) {
                    this.isRecording = false;
                    this.secondsElapsed = 0;
                    this.selectedItem = '';
                }else{
                    if (!this.lastTimeEntry.end_time) {
                        this.isRecording = true;

                        this.secondsElapsed = Math.floor(this.lastTimeEntry.seconds_elapsed);

                        this.timer = setInterval(() => {
                            this.secondsElapsed++;
                        }, 1000);
                    }else{
                        console.log('Time entry found', this.lastTimeEntry);
                        this.isRecording = false;
                    }
                        
                    const registrableType = this.lastTimeEntry.registrable_type;
                    const registrableId = this.lastTimeEntry.registrable_id;

                    if (registrableType == 'App\\Models\\Task') {
                        if (this.inProgressTasks.some(task => task.id === registrableId)) {
                            this.selectedItem = `task-${registrableId}`;
                        } else {
                            this.selectedItem = '';
                        }
                    } else {
                        this.selectedItem = `cat-${registrableId}`;
                    }
                }

            } catch (error) {
                console.error('Error fetching last time entry:', error);
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
    position: relative;
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
    border: none;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    cursor: pointer;
}

.start-button {
    background-color: #009951;
    color: white;
}

.start-button:disabled {
    background-color: #E0E0E0;
    cursor: not-allowed;
}

.stop-button {
    background-color: #FF4F4D;
    color: white;
}

.stop-button:disabled {
    background-color: #E0E0E0;
    color: #2C2C2C;
    cursor: not-allowed;
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