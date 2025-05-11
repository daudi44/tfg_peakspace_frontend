<template>
    <div class="movements-section">
        <div class="movements-section-title" style="background-color: #7E4DF6">
            <h3>/ Subscriptions</h3>
            <button style="background-color: #5438DC; color: white;" @click="showSubscriptionModal = true">Add +</button>
        </div>
        <div class="movements-section-list">
            <div v-if="subscriptions.length > 0" v-for="(subscription, index) in subscriptions" :key="subscription.id" class="movements-section-item" :class="{ even: index % 2 === 0, odd: index % 2 !== 0,
                        last: index === subscriptions.length - 1 }">
                <span>{{ subscription.name }} - {{ getMovementCategory(subscription.category_id) }}</span>
                <span>
                    {{subscription.amount }} €
                </span>
                <div style="display: flex; flex-direction: row; gap: 5px;">
                    <!-- <button>Edit</button> -->
                    <button style="background-color: #FF4F4D; color: white; padding: 5px 10px;" @click="removeSubscriptions(subscription.id)">Delete</button>
                </div>
            </div>
            <p style="padding-left: 10px;" v-else>There are no subscriptions yet.</p>
        </div>


        <div v-if="showSubscriptionModal" class="overlay">
            <div class="content">
                <h2>{{ creation ? 'Create subscription' : 'Edit subscription' }}</h2>

                <div style="display: flex; flex-direction: row; gap: 10px;">
                    <div class="item">
                        <label for="name">Name</label>
                        <input type="text" id="name" v-model="subscriptionName" />
                    </div>

                    <div class="item">
                        <label for="category">Category</label>
                        <select id="category" v-model="subscriptionCategory">
                            <option :value="null" selected>Select a category</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                        </select>
                    </div>
                </div>

                <div style="display: flex; flex-direction: row; gap: 10px;">
                    <div class="item">
                        <label for="amount">Amount</label>
                        <input type="number" id="amount" v-model="subscriptionAmount" />
                    </div>

                    <div style="display: flex; flex-direction: row; gap: 10px;">
                        <div class="item">
                            <label for="startDate">Start Date</label>
                            <input type="date" id="startDate" v-model="subscriptionStartDate" />
                        </div>  

                        <div class="item">
                            <label for="endDate">End Date</label>
                            <input type="date" id="endDate" v-model="subscriptionEndDate" />
                        </div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: row; gap: 10px;">
                    <button style="color: white; background-color: #009951;" :disabled="!creationAllowed" @click="createSubscription()">Save</button>
                    <button style="color: white; background-color: #FF4F4D;" @click="showSubscriptionModal = false">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { addSubscription, deleteSubscription, getSubscriptions } from '../api/economy.js';
export default {
    name: 'MovementsSection',
    props: {
        categories: {
            type: Array,
            required: true
        },
    },
    mounted() {
        this.getSubscriptions();
    },  
    data() {
        return {
            subscriptions: [],
            showSubscriptionModal: false,
            subscriptionName: '',
            subscriptionAmount: 0,
            subscriptionCategory: null,
            subscriptionStartDate: null,
            subscriptionEndDate: null,
            creation: true,
        }
    },
    computed: {
        creationAllowed() {
            return this.subscriptionName != '' && this.subscriptionAmount > 0 && this.subscriptionCategory && this.subscriptionStartDate && this.subscriptionEndDate;
        }
    },
    methods: {
        async getSubscriptions() {
            try {
                const response = await getSubscriptions();
                this.subscriptions = response.data;
            } catch (error) {
                console.error('Error fetching movements:', error);
            }
        },
        async createSubscription() {
            try {
                const response = await addSubscription({
                    name: this.subscriptionName,
                    amount: this.subscriptionAmount,
                    category_id: this.subscriptionCategory,
                    start_date: this.subscriptionStartDate,
                    end_date: this.subscriptionEndDate
                });
                console.log(response.data); 
                this.subscriptions.push(response.data.subscription);
                this.showSubscriptionModal = false;
            } catch (error) {
                console.error('Error adding subscription:', error);
            }
        },
        async editSubscription() {
            try {
                // const response = await editMovement({
                //     id: this.subscriptionId,
                //     name: this.subscriptionName,
                //     amount: this.subscriptionAmount,
                //     category_id: this.subscriptionCategory,
                //     start_date: this.subscriptionStartDate,
                //     end_date: this.subscriptionEndDate
                // });
                // this.movements = this.movements.map(movement => movement.id === response.data.id ? response.data : movement);
                this.showSubscriptionModal = false;
            } catch (error) {
                console.error('Error editing subscription:', error);
            }
        },
        getMovementCategory(categoryId) {
            const category = this.categories.find(category => category.id === categoryId);
            return category ? category.name : 'Unknown';
        },
        removeSubscriptions(subscriptionId) {
            deleteSubscription({subscription_id: subscriptionId})
            .then(() => {
                this.subscriptions = this.subscriptions.filter(subscription => subscription.id !== subscriptionId);
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
    display: flex; 
    flex-direction: row;
    align-items: center;
    gap: 10px;
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

  .last {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

    .content {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 20;
        width: 100%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .item {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 10px;
    }

    input {
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ccc;
        width: 100%;
    }

    select {
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ccc;
        width: 100%;
    }
</style>