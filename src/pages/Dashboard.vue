<template>
  <div style="margin-top: 180px;">
    <div style="display: flex; flex-direction: row; gap: 10px;">
      <div
        style="flex: 2; background-color: #2C2C2C; border-radius: 8px; color: white; align-items: center; display: flex; flex-direction: column; gap: 10px;">
        <h2 style="margin: 10px 0px 0px 0px;">Today's productive time</h2>
        <div
          style="border-radius: 50%; border: 4px solid white; width: 75%; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; flex-direction: column;">
          <p style="font-size: 70px; font-weight: bold; margin:0px">{{ formatElapsed(today) }}</p>
          <p style="margin: 0;">hours:minutes</p>
        </div>
        <button style="padding: 10px 20px;" @click="navigateTo('/productivity')">Navigate to productivity zone</button>
        <div style="width: 100%; background-color: #5438DC; border-radius: 8px;">
          <div style="display: flex; flex-direction: row; padding: 15px 40px; justify-content: space-between;">
            <p style="font-size: 20px; font-weight: bold; margin: 0">This week</p>
            <div>
              <p style="font-size: 40px; font-weight: bold; margin: 0;">{{ formatElapsed(thisWeek) }}</p>
              <p style="margin: 0">hours:minutes</p>
            </div>
          </div>

        </div>
      </div>

      <div style="display: flex; flex-direction: column; flex: 5; width: fit-content;">
        <EconomyChart v-if="userBalance != 0" :dashboard="true" :balance="userBalance" style="margin-bottom: 0;" />
        <p style="font-size: 35px; font-weight: bold; margin: 0; padding: 0; align-self: center;">
          {{ getNowDate() }}
        </p>

      </div>
    </div>
  </div>
</template>

<script>
import {  getBalance } from '../api/economy.js';
import EconomyChart from '../components/EconomyChart.vue';
import { getTotalTime } from '../api/productivity';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useUserStore } from '../stores/user.js';
export default {
  name: 'Dashboard',
  components: {
    EconomyChart
  },
  data() {
    return {
      today: null,
      userBalance: 0,
      thisWeek: null,
    };
  },
  async mounted() {
    this.fetchTodayStats();
    this.fetchThisWeekStats();
    await this.getUserBalance();
  },
  methods: {
    getNowDate() {
      const now = new Date();
      return format(now, 'dd MMMM yyyy HH:mm');
    },
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
    formatElapsed(eSeconds) {
      const hours = String(Math.floor(eSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((eSeconds % 3600) / 60)).padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    async getUserBalance() {
      try {
        const balance = await getBalance();
        if (balance.data.balance == null) {
          this.userBalance = 0;
          return;
        } else {
          this.userBalance = balance.data.balance;
        }
        const userStore = useUserStore();
        userStore.user.balance = balance.data.balance;
        userStore.setUser(userStore.user);
        this.userBalance = userStore.user.balance;
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },
    navigateTo(route) {
      this.$router.push(route)
    },
  },
}
</script>