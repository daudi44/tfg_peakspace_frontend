<template>
    <div>
        <p>{{ tasks }}</p>
        <p>{{ status }}</p>
    </div>
</template>
<script>
import { tasksByStatus } from '../api/productivity';
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
            selectedType: null,
            selectedPeriod: null,
            showModal: false,
            newCategoryName: '',
            newCategoryParent: null,
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
    },
}
</script>
<style scoped></style>