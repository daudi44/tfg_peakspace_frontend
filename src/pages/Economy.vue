<template>
  <div style="margin-top: 180px;">
    <div style="display: flex; flex-direction: row; justify-content: space-between; gap: 10px;">
        <!-- form for adding movement -->
        <div style="display: flex; flex-direction: row; gap: 25px; background-color: #2C2C2C; color: white; border-radius: 8px; padding: 10px; flex: 6;">
          <div>
            <h2>Add movement</h2>
            <div>
              <div>

              </div>
            </div>
          </div>
          <div>
            <h2>Amount</h2>
            <input type="number" placeholder="Introduce the exact amount" style="width: 100px; border-radius: 8px; padding: 5px; border: 1px solid #CDCDCD;" />
          </div>
          <div>
            <h2>Category</h2>
            
          </div>
        </div>
        <!-- user balance -->
        <div style="background-color: #CDCDCD; border-radius: 8px; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); padding: 10px 20px; flex: 1;">
          <h2 style="color: white; margin: 0;">Your balance:</h2>
          <h2 style="color: #2C2C2C; margin: 0;">2222 €</h2>
        </div>
    </div>
    <div style="flex-direction: row; display: flex; gap: 25px;">
      <MovementsSection style="flex: 1;" :name="'+ Incomes'" />
      <MovementsSection style="flex: 1;" :name="'- Outcomes'" />
      <MovementsSection style="flex: 1;" :name="'/ Subscriptions'" />
    </div>
    <CategoriesSection :type="2" />
  </div>
</template>

<script>
import { addMovement } from '../api/economy.js';
import CategoriesSection from '../components/CategoriesSection.vue';
import MovementsSection from '../components/MovementsSection.vue';
export default {
  name: 'Economy',
  components: {
    CategoriesSection,
    MovementsSection,
  },
}
</script>

<style scoped>
  h2 {
    margin: 0;
  }
  
</style>