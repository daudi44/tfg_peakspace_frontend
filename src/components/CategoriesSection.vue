<template>
    <div>
        <h2>{{ type == 1 ? 'Productivity' : 'Economy' }} Categories</h2>
        <div class="section-container">
            <div
                style="display: flex; flex-direction: row; gap: 25px; background-color: #2C2C2C; border-radius: 8px; color: white; padding: 0px 15px;">
                <div v-if="type == 2" style="display: flex; flex-direction: row; gap: 15px; align-items: center;">
                    <h3>Type</h3>
                    <button>Outcomes</button>
                    <button>Subscriptions</button>
                    <button>All</button>
                </div>
                <div style="display: flex; flex-direction: row; gap: 15px; align-items: center;">
                    <h3>Period</h3>
                    <button>Today</button>
                    <button>Week</button>
                    <button>Month</button>
                </div>
            </div>
            <div
                style="background-color: #F1F1F1; border-radius: 8px; padding: 20px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);">
                <div class="category-grid">
                    <div v-for="category in categories" :key="category.id"
                        style="display: flex; justify-content: space-between; align-items: center; background-color: white;  padding: 5px 15px; border-radius: 8px;">
                        <h3>{{ category.name }}</h3>
                        <button @click="deleteCategory(category.id)"
                            style="background-color: #FF4F4D; color: white; padding: 5px 10px;">Delete</button>
                    </div>
                </div>
                <div>
                    <h3>Add category</h3>
                    <div style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div style="display: flex; gap: 20px;">
                            <input type="text" name="categoryName" id="categoryName" placeholder="Name"
                                v-model="newCategoryName" style="border: 1px solid #D9D9D9; padding: 10px 20px; border-radius: 8px; color: #2C2C2C; font-weight: bold;" />
                            <select name="parentCategory" id="parentCategory" v-model="newCategoryParent" style="border: 1px solid #D9D9D9; padding: 10px 20px; border-radius: 8px;color: #2C2C2C; font-weight: bold;">
                                <option value="" selected>Select parent category</option>
                                <option v-for="category in categories" :key="category.id" :value="category.id">{{
                                    category.name }}</option>
                            </select>
                        </div>
                        <button @click="addCategory"
                            style="background-color: #5438DC; color: white; padding: 5px 10px;">Add +</button>
                    </div>
                </div>
            </div>
            <div v-if="loading" class="overlay">
                <div class="spinner"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { addCategory, deleteCategory, getProductivityCategories, getEconomyCategories } from '../api/general'
export default {
    name: 'CategoriesSection',
    props: {
        type: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            categories: [],
            selectedType: null,
            selectedPeriod: null,
            showModal: false,
            newCategoryName: '',
            newCategoryParent: '',
            loading: false,
        };
    },
    async mounted() {
        this.loading = true;
        await this.loadCategories();
        this.loading = false;
    },
    methods: {
        loadCategories() {
            if (this.type == 1) {
                return getProductivityCategories().then((data) => {
                    this.categories = data.data.categories;
                });
            } else if (this.type == 2) {
                return getEconomyCategories().then((data) => {
                    this.categories = data.data.categories;
                });
            }
        },
        addCategory() {
            try {
                this.loading = true;
                addCategory({
                    type: this.type,
                    name: this.newCategoryName,
                    parent_category_id: this.newCategoryParent
                }).then(async (data) => {
                    await this.loadCategories();
                    this.loading = false;
                    this.newCategoryName = '';
                    this.newCategoryParent = null;
                    this.$emit('categoryUpdated')
                });
            } catch (error) {
                console.error('Error adding category:', error);
            }
        },
        deleteCategory(categoryId) {
            try {
                this.loading = true;
                deleteCategory({
                    category_id: categoryId
                }).then(async () => {
                    await this.loadCategories();
                    this.loading = false;
                    this.$emit('categoryUpdated')
                });
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        },
    }
}
</script>
<style scoped>
.section-container {
    position: relative;
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* Dos columnas iguales */
    gap: 10px;
    margin-bottom: 20px;
    max-height: 40vh;
    overflow-y: auto;
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
    border-top-color: #2C2C2C;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>