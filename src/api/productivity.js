import axios from '../lib/axios'

export function addTask(data) {
    return axios.post('/add-task', data)
}
export function updateTask(data) {
    return axios.post('/update-task', data)
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

export function startTimeEntry(data) {
    return axios.post('/start-time-entry', data)
}
export function stopTimeEntry(data) {
    return axios.post('/stop-time-entry', data)
}
export function timeEntries() {
    return axios.get('/time-entries')
}
export function lastTimeEntry() {
    return axios.get('/last-time-entry')
}
export function getTotalTime(data) {
    return axios.post('/total-time', data)
}
export function deleteTimeEntry(data) {
    return axios.post('/delete-time-entry', data)
}