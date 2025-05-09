import axios from '../lib/axios'

export function loginUser(data) {
  return axios.post('/login', data)
}

export function registerUser(data) {
    return axios.post('/register', data)
}

export function logoutUser() {
    return axios.post('/logout')
}

export function getUser() {
    return axios.get('/user')
}

export function updateUser(data) {
    return axios.post('/update-user', data)
}

export function deleteAccount() {
    return axios.post('/delete-account')
}