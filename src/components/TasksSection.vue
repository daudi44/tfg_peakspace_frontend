<template>
    <div class="task-list-container">
        <div
            style="display: flex; flex-direction: row; align-items: center; color: white; padding: 0px 20px; justify-content: space-between;">
            <h2>{{ statusName }} <span>▶️</span></h2>
            <p>Total tasks: {{ tasks.length }}</p>
        </div>
        <div class="task-list-delimiter">
            <div v-for="(task, index) in tasks" :key="task.id" class="task-list-content" :class="{
                'even': index % 2 === 0, 'odd': index % 2 !== 0,
                last: index === tasks.length - 1
            }">
                <div>
                    <h3>{{ task.name }} - {{ task.category.name }}</h3>
                    <p>{{ task.description }}</p>
                </div>
                <div>
                    <div>
                        <p>Start Date: {{ formatDate(task.start_date) }}</p>
                        <p>Due Date: {{ formatDate(task.due_date) }}</p>
                    </div>
                    <div>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { tasksByStatus } from '../api/productivity';
import { format } from 'date-fns';
export default {
    props: {
        status: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            tasks: [],
            loading: false,
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
</style>