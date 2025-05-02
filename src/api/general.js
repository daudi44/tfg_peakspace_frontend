import axios from '../lib/axios'

// Categories actions
export function addCategory(data) {
  return axios.post('/add-category', data)
}
export function deleteCategory(data) {
  return axios.post('/delete-category', data)
}

export function getEconomyCategories() {
  return axios.get('/economy-categories')
}
export function getProductivityCategories() {
    return axios.get('/productivity-categories')
}