<template>
  <div style="margin-top: 180px;">
    <div style="display: flex; flex-direction: row; justify-content: space-between; gap: 10px;">
        <!-- form for adding movement -->
        <div style="display: flex; flex-direction: column; background-color: #2C2C2C; color: white; border-radius: 8px; padding: 10px; flex: 6;">
          <div style="display: flex; flex-direction: row">
            <div style="border-right: 1px solid white; padding-right: 10px; margin-right: 10px; flex: 3;">
              <h2>Add movement</h2>
              <div style="display: flex; flex-direction: row; gap: 5px;">
                <div style="display: flex; flex-direction: row; gap: 10px; background-color: #C5C5C5; padding: 7px 15px; border-radius: 8px; color: #1E1E1E; flex: 1;">               <span>Income</span>
                  <input type="checkbox" name="movementType" v-model="selectedType" />
                  <label>Outcome</label>
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
              <select v-model="selectedCategory" style="width: 100%; flex: 1; border-radius: 8px; padding: 5px; background-color: #C5C5C5; border: none;">
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
      <MovementsSection style="flex: 1;" :name="'+ Incomes'" />
      <MovementsSection style="flex: 1;" :name="'- Outcomes'" />
      <MovementsSection style="flex: 1;" :name="'/ Subscriptions'" />
    </div>
    <CategoriesSection :type="2" />

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
  </div>
</template>

<script>
import { addMovement, setBalance } from '../api/economy.js';
import CategoriesSection from '../components/CategoriesSection.vue';
import MovementsSection from '../components/MovementsSection.vue';
import { useUserStore } from '../stores/user';
import { getEconomyCategories } from '../api/general.js';
export default {
  name: 'Economy',
  components: {
    CategoriesSection,
    MovementsSection,
  },
  data() {
    return {
      availableCategories: [],
      selectedCategory: 0,
      selectedType: false,
      name: '',
      amount: 0,
      newUserBalance: null,
      userBalance: 0,
      showFirstTimeModal: false,
    };
  },
  mounted() {
    this.fetchAvailableCategories();
    const userStore = useUserStore();
    if (userStore.user.balance != null) {
      this.userBalance = userStore.user?.balance;
    } else{
      console.log('User balance is null', userStore.user);
      this.showFirstTimeModal = true;
    }
  },
  methods: {
    async addMovement() {
      try {
        const response = await addMovement({
          amount: this.amount,
          categoryId: this.selectedCategory,
          type: this.selectedType,
        });
        console.log('Movement added:', response);
      } catch (error) {
        console.error('Error adding movement:', error);
      }
    },
    async setUserBalance() {
      const userStore = useUserStore();
      userStore.user.balance = this.newUserBalance;
      userStore.setUser(userStore.user);
      try {
        await setBalance({
          balance: this.newUserBalance
        });
      } catch (error) {
        console.error('Error setting balance:', error);
      }
      this.userBalance = this.newUserBalance;
      this.showFirstTimeModal = false;
    },
    async fetchAvailableCategories() {
      try {
        const response = await getEconomyCategories();
        this.availableCategories = response.data.categories;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
  },
  computed: {
    createMovementFieldsFilled() {
      return this.selectedCategory && this.amount > 0 && this.name != '';
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
</style>