<template>
    <div>
        <h2 style="margin-top: 10px; margin-bottom: 0;">Last 30 days</h2>
        <div style="background-color: white; border-radius: 8px; padding: 20px; height: 300px;">
            <Line :data="chartData" :options="chartOptions" :key="chartKey" />
        </div>
    </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js'
import { lastMonthMovements } from '../api/economy.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler)

export default {
  name: 'EconomyChart',
  components: {
    Line
  },
  data() {
    return {
        chartKey: 0,
        chartData: {
            labels: [],
            datasets: [
                {
                    label: 'Balance',
                    data: [],
                    borderColor: '#7E4DF6',
                    backgroundColor: 'rgba(84, 56, 220, 0.2)',
                    fill: true,
                    tension: 0,
                }
            ]
        },
        chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 10,
                        }
                    },
                    y: {
                        beginAtZero: false
                    }
                }
            }
        };
    },
    props: {
        balance: {
            type: Number,
            required: true
        }
    },
  async mounted() {
    const { labels, data } = await this.generateBalanceHistory();
    this.chartData.labels = labels;
    this.chartData.datasets[0].data = data;

    this.chartData = {
        labels,
        datasets: [
            {
                label: 'Balance',
                data,
                borderColor: '#5438DC',
                backgroundColor: 'rgba(84, 56, 220, 0.2)',
                fill: true,
                tension: 0.3
            }
        ]
    };

    this.chartKey += 1; 
    console.log('Chart Data:', this.chartData);
  },
  methods: {
    async generateBalanceHistory() {
        const initialBalance = this.balance;
        const response = await lastMonthMovements();
        const movements = response.data;
        console.log('Movements:', movements);   

        const dailyChanges = {};
        movements.forEach(movement => {
            const date = movement.created_at.slice(0, 10);
            const amount = parseFloat(movement.amount);
            if (!dailyChanges[date]) dailyChanges[date] = 0;

            dailyChanges[date] += movement.type == 1 ? parseFloat(movement.amount) : -parseFloat(movement.amount);
        });
        console.log('Daily Changes:', dailyChanges);

        const labels = [];
        const data = [];
        let currentBalance = Number(initialBalance);

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().slice(0, 10);

            labels.unshift(dateStr);
            data.unshift(currentBalance); 

            if (dailyChanges[dateStr]) {
                currentBalance -= dailyChanges[dateStr];
            }
        }

        return { labels, data };
    }
  }
}
</script>
