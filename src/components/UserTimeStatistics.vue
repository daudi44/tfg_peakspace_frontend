<template>
    <div class="stats-container">
        <div class="stat">
            <p>Today's time</p>
            <p>{{formatElapsed(today)}}</p>
        </div>
        <div class="stat">
            <p>Week time</p>
            <p>{{formatElapsed(thisWeek)}}</p>
        </div>
        <div class="stat">
            <p>Month time</p>
            <p>{{formatElapsed(thisMonth)}}</p>
        </div>
    </div>
</template>
<script>
import { getTotalTime } from '../api/productivity';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
export default {
    data() {
        return {
            today: null,
            thisWeek: null,
            thisMonth: null,
        };
    },
    async mounted() {
        await this.fetchTodayStats();
        await this.fetchThisWeekStats();
        await this.fetchThisMonthStats();
    },
    methods: {
        async fetchTodayStats() {
            const response = await getTotalTime({ 
                start_date: startOfDay(new Date()),
                end_date: endOfDay(new Date()),
            });
            this.today = Math.floor(response.data.total_time);
        },
        async fetchThisWeekStats() {
            const response = await getTotalTime({ 
                start_date: startOfWeek(new Date()),
                end_date: endOfWeek(new Date()),
            });
            this.thisWeek = Math.floor(response.data.total_time);
        },
        async fetchThisMonthStats() {
            const response = await getTotalTime({ 
                start_date: startOfMonth(new Date()),
                end_date: endOfMonth(new Date()),
            });
            this.thisMonth = Math.floor(response.data.total_time);
        },
        
        formatElapsed(eSeconds) {
            const hours = String(Math.floor(eSeconds / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((eSeconds % 3600) / 60)).padStart(2, '0');
            const seconds = String(Math.floor(eSeconds % 60)).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }
    },
}
</script>
<style scoped>
    .stats-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px 20px;
        background-color: #CDCDCD;
        border-radius: 8px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
        font-weight: 700;
        font-size: 20px;
    }
    .stat {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: #fff 1px solid;
    }

    .stat.stat:last-child {
        border-bottom: none;
    }
</style>