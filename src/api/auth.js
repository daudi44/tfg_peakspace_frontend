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
