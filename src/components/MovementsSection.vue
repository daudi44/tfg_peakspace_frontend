<template>
    <div class="movements-section">
        <div class="movements-section-title" :style="{ backgroundColor: type == 1 ? '#009951' : '#FF4F4D' }">
            <h3>{{ name }}</h3>
        </div>
        <div class="movements-section-list">
            <div v-if="movements.length > 0" v-for="(movement, index) in movements" :key="movement.id" class="movements-section-item" :class="{ even: index % 2 === 0, odd: index % 2 !== 0 }">
                <span>{{ movement.name }} - {{ getMovementCategory(movement.category_id) }}</span>
                <span>
                    <span v-if="type == 1">+</span>
                    <span v-else>-</span>
                    {{movement.amount }} €
                </span>
                <div style="display: flex; flex-direction: row; gap: 5px;">
                    <button>Edit</button>
                    <button style="background-color: #FF4F4D; color: white; padding: 5px 10px;" @click="removeMovement(movement.id)">Delete</button>
                </div>
            </div>
            <p v-else>There are no movements of this type.</p>
        </div>
    </div>
</template>
<script>
import { movementsByType, deleteMovement } from '../api/economy.js';
export default {
    name: 'MovementsSection',
    props: {
        name: {
            type: String,
            required: true
        },
        type: {
            type: Number,
            required: true
        },
        categories: {
            type: Array,
            required: true
        },
    },
    mounted() {
        this.getMovements();
    },  
    data() {
        return {
            movements: [],
        }
    },
    methods: {
        async getMovements() {
            try {
                const response = await movementsByType({
                    type: this.type
                });
                this.movements = response.data;
            } catch (error) {
                console.error('Error fetching movements:', error);
            }
        },
        getMovementCategory(categoryId) {
            const category = this.categories.find(category => category.id === categoryId);
            return category ? category.name : 'Unknown';
        },
        removeMovement(movementId) {
            deleteMovement({id: movementId})
            .then(() => {
                this.movements = this.movements.filter(movement => movement.id !== movementId);
            }).catch(error => {
                console.error('Error deleting movement:', error);
            });
        }
    }
}
</script>
<style scoped>
.movements-section {
    margin: 20px;
    border-radius: 8px;
    background-color: #F1F1F1;
}
.movements-section-title {
    font-size: 24px;
    font-weight: bold;
    border-radius: 8px 8px 0 0;
    color: white;
}

h3 {
    margin: 0;
    padding: 10px;
}

.movements-section-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 15px 20px;
}

.even {
    background-color: #CDCDCD;
}

.odd {
    background-color: #F1F1F1;
}

.movements-section-list{
    max-height: 45;
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
    border-top-color: #5438DC;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>