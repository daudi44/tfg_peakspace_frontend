import axios from '../lib/axios'

export function addTask(data) {
    return axios.post('/add-task', data)
}
export function deleteTask(data) {
    return axios.post('/delete-task', data)
}
export function allTasks() {
    return axios.get('/all-tasks')
}
export function tasksByStatus(data) {
    return axios.post('/tasks', data)
}
export function updateTaskStatus(data) {
    return axios.post('/update-task-status', data)
}