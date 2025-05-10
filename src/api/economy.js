import axios from '../lib/axios'

export function addMovement(data) {
  return axios.post('/add-movement', data)
}
export function editMovement(data) {
    return axios.post('/edit-movement', data)
}
export function deleteMovement(data) {
  return axios.post('/delete-movement', data)
}
export function movementsByType(data) {
  return axios.post('/movements', data)
}
export function lastMonthMovements() {
  return axios.get('/last-month-movements')
}
export function setBalance(data) {
  return axios.post('/set-balance', data)
}
export function getBalance() {
  return axios.get('/get-balance')
}