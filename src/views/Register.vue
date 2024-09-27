<script setup>
import { useUserStore } from '../stores/UserStore'
import { storeToRefs } from 'pinia'

// Access the store and its properties
const userStore = useUserStore()
const { username, email, password, message, loading } = storeToRefs(userStore)

// Function to register the user
const registerUser = async () => {
    await userStore.register()
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="card bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
            <h1 class="text-2xl mb-6 text-center">Login</h1>
            <!-- Registration form -->
            <!-- Login form -->
            <form @submit.prevent="registerUser">
                <div class="mb-4">
                    <label class=" text-gray-700 text-sm mb-2">Username</label>
                    <input v-model="username" type="text" placeholder="Username"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="mb-6">
                    <label class=" text-gray-700 text-sm mb-2">Email</label>
                    <input v-model="email" type="email" placeholder="Email"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="mb-6">
                    <label class=" text-gray-700 text-sm mb-2">Password</label>
                    <input v-model="password" type="password" placeholder="Password"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" :disabled="loading"
                    class="w-full text-white py-2 px-4 rounded hover:bg-yellow-200  focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Register
                </button>
            </form>
            <!-- Loading state -->
            <div v-if="loading">Registering...</div>

            <!-- Registration message -->
            <div v-if="message">{{ message }}</div>
        </div>
    </div>
</template>