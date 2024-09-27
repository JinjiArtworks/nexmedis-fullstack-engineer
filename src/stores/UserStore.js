// stores/UserStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        users: {},        // Stores user info
        // tasks: {},       // Stores tasks (if needed)
        loading: false,  // Tracks loading state
        username: '',    // Stores username for registration
        email: '',       // Stores email for registration and login
        password: '',    // Stores password for registration and login
        message: '',     // Stores response message after registration or login
        token: '',       // Stores the JWT token after login
    }),
    getters: {
        // favs(state) {
        //     return state.tasks.filter(t => t.isFav); // Example of a getter for favorite tasks
        // },
    },
    actions: {
        async getUser() {
            this.loading = true
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    throw new Error('No token found, please login.')
                }

                const response = await axios.get('http://localhost:3000/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                this.users = response.data
            } catch (error) {
                console.error('Error fetching user:', error.message)
            } finally {
                this.loading = false
            }
        },

        async register() {
            this.loading = true
            try {
                const response = await axios.post('http://localhost:3000/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                })

                this.message = response.data.msg
            } catch (error) {
                this.message = error.response?.data?.msg || 'An error occurred'
            } finally {
                this.loading = false
                router.push('/login')  // Use the imported router instance here
            }
        },

        async login() {
            this.loading = true
            try {
                const response = await axios.post('http://localhost:3000/login', {
                    email: this.email,
                    password: this.password,
                })

                // Save the token to localStorage and state
                localStorage.setItem('token', response.data.token)
                this.token = response.data.token
                this.message = 'Login successful!'
            } catch (error) {
                this.message = error.response?.data?.msg || 'An error occurred'
            } finally {
                this.loading = false
                // Redirect to the dashboard
                router.push('/dashboard')  // Use the imported router instance here
            }
        },
    },
})