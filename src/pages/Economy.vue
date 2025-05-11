<template>
  <div style="margin-top: 180px;">
    <div style="display: flex; flex-direction: row; justify-content: space-between; gap: 10px;">
        <!-- form for adding movement -->
        <div style="display: flex; flex-direction: column; background-color: #2C2C2C; color: white; border-radius: 8px; padding: 10px; flex: 6;">
          <div style="display: flex; flex-direction: row">
            <div style="border-right: 1px solid white; padding-right: 10px; margin-right: 10px; flex: 3;">
              <h2>Add movement</h2>
              <div style="display: flex; flex-direction: row; gap: 5px;">
                
                <div style="display: flex; gap: 10px;">
                  <label 
                    :class="['toggle-option', selectedType === 'income' ? 'active' : '']" 
                    @click="selectedType = 'income'"
                  >
                    Income
                  </label>
                  <label 
                    :class="['toggle-option', selectedType === 'outcome' ? 'active' : '']" 
                    @click="selectedType = 'outcome'"
                  >
                    Outcome
                  </label>
                </div>
                <input type="text" placeholder="Name" v-model="name" style=" border-radius: 8px; padding: 5px; background-color: #C5C5C5; border: none; flex: 2;" />
              </div>
            </div>
            <div style="border-right: 1px solid white; flex: 2; padding-right: 20px; margin-right: 10px; justify-content: space-between; display: flex; flex-direction: column;">
              <h2>Amount</h2>
              <input type="number" placeholder="Introduce the exact amount" v-model="amount" style="width: 100%; flex: 1; border-radius: 8px; padding: 5px;  background-color: #C5C5C5; border: none;" />
            </div>
            <div style="flex: 2; justify-content: space-between; display: flex; flex-direction: column; gap: 5px">
              <h2>Category</h2>
              <!-- category selector -->
              <select v-model="selectedCategory" :key="categoriesListKey" style="width: 100%; flex: 1; border-radius: 8px; padding: 5px; background-color: #C5C5C5; border: none;">
                <option :value="0" selected>Select a category</option>
                <option v-for="category in availableCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>
          </div>
          
          <button v-if="createMovementFieldsFilled" @click="addMovement" style="background-color: #5438DC; color: white; border-radius: 8px; padding: 10px; border: none; flex: 1; cursor: pointer; width: fit-content; margin-top: 5px;">
            Add +
          </button>
        </div>
        
        <div style="background-color: #CDCDCD; border-radius: 8px; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); padding: 10px 20px; flex: 1;">
          <h2 style="color: white; margin: 0;">Your balance:</h2>
          <h2 style="color: #2C2C2C; margin: 0;">{{userBalance}}€</h2>
        </div>
    </div>
    <div style="flex-direction: row; display: flex; gap: 25px;">
      <MovementsSection style="flex: 1;" :name="'+ Incomes'" :type="1" :categories="availableCategories" :key="reloadKey" @refresh-balance="getUserBalance"/>
      <MovementsSection style="flex: 1;" :name="'- Outcomes'" :type="0" :categories="availableCategories" :key="reloadKey+1" @refresh-balance="getUserBalance"/>
      <!-- <MovementsSection style="flex: 1;" :name="'/ Subscriptions'" /> -->
    </div>

    <EconomyChart v-if="userBalance != 0" style="border-top: 1px solid #000;" :key="reloadKey" :balance="userBalance"/>

    <CategoriesSection style="border-top: 1px solid #000;" :type="2"  @category-updated="fetchAvailableCategories"/>

    <div v-if="showFirstTimeModal" class="modal">
      <div class="modal-content">
        <h2>Welcome to the Economy Page!</h2>
        <p>Here you can manage your movements, and track your expenses.</p>
        <p>After start, you must indicate your total balance at this moment: </p>

        <div style="display: flex; flex-direction: column; gap: 20px; align-items: center; justify-content: center;">
          <div>
            <input type="number" v-model="newUserBalance" placeholder="Enter your balance" style="border-radius: 8px; padding: 15px 20px; background-color: #C5C5C5; border: none;" /> €
          </div>
          <button :disabled="newUserBalance == null || newUserBalance <= 0" @click="setUserBalance" style="background-color: #5438DC; color: white; font-weight: bold; padding: 10px 20px;">Continue</button>
        </div>
        
      </div>
    </div>


      <div v-if="loading" class="overlay" style="z-index: 11;">
        <div class="spinner">
        </div>
      </div>
  </div>
</template>

<script>
import EconomyChart from '../components/EconomyChart.vue';
import { addMovement, setBalance, getBalance } from '../api/economy.js';
import CategoriesSection from '../components/CategoriesSection.vue';
import MovementsSection from '../components/MovementsSection.vue';
import { useUserStore } from '../stores/user';
import { getEconomyCategories } from '../api/general.js';
import { getUser } from '../api/auth.js';
export default {
  name: 'Economy',
  components: {
    CategoriesSection,
    MovementsSection,
    EconomyChart
  },
  data() {
    return {
      availableCategories: [],
      selectedCategory: 0,
      selectedType: '',
      name: '',
      amount: 0,
      newUserBalance: null,
      userBalance: 0,
      showFirstTimeModal: false,
      loading: false,
      reloadKey: 0,
      categoriesListKey: 0,
    };
  },
  mounted() {
    this.fetchAvailableCategories();

      this.getUserBalance();
  },
  methods: {
    async addMovement() {
      try {
        const response = await addMovement({
          name: this.name,
          amount: this.amount,
          category_id: this.selectedCategory,
          type: this.selectedType == 'income' ? 1 : 0,
        });
        this.reloadKey += 1;
        this.name = '';
        this.amount = 0;
        this.selectedCategory = 0;
        this.selectedType = '';
        this.getUserBalance();
        console.log('Movement added:', response);
      } catch (error) {
        console.error('Error adding movement:', error);
      }
    },
    async getUserBalance() {
      this.loading = true;
      try {
        const balance = await getBalance();
        if (balance.data.balance == null) {
          this.showFirstTimeModal = true;
        } else {
          this.userBalance = balance.data.balance;
        }
        const userStore = useUserStore();
        userStore.user.balance = balance.data.balance;
        userStore.setUser(userStore.user);
        this.userBalance = userStore.user.balance;
        this.loading = false;
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },
    async setUserBalance() {
      const userStore = useUserStore();
      userStore.user.balance = this.newUserBalance;
      userStore.setUser(userStore.user);
      try {
        this.loading = true;
        await setBalance({
          balance: this.newUserBalance
        });
      } catch (error) {
        console.error('Error setting balance:', error);
      }
      this.userBalance = this.newUserBalance;
      this.showFirstTimeModal = false;
        this.loading = false;
    },
    async fetchAvailableCategories() {
      this.loading = true;
      try {
        const response = await getEconomyCategories();
        this.availableCategories = response.data.categories;
        this.categoriesListKey += 1;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
      this.loading = false;
    },
  },
  computed: {
    createMovementFieldsFilled() {
      return this.selectedCategory && this.amount > 0 && this.name != '' && this.selectedType != '';
    },
  },
}
</script>

<style scoped>
  h2 {
    margin: 0;
  }
  
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 500;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
  }
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px;
    border-radius: 8px;
    text-align: center;
  }

  .toggle-option {
  background-color: #C5C5C5;
  color: #1E1E1E;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;
}
.toggle-option.active {
  background-color: #5438DC;
  color: white;
  font-weight: bold;
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