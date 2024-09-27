<script setup>
import { useUserStore } from '../stores/UserStore'
import { storeToRefs } from 'pinia'

// Use the user store
const userStore = useUserStore()

// Destructure email, password, message, and loading from store using storeToRefs
const { email, password, message, loading } = storeToRefs(userStore)

// Function to login the user
const loginUser = async () => {
    await userStore.login()
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="card bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
            <h1 class="text-2xl mb-6 text-center">Login</h1>

            <!-- Login form -->
            <form @submit.prevent="loginUser">
                <div class="mb-4">
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
                    Login
                </button>
            </form>

            <!-- Loading state -->
            <div v-if="loading" class="mt-4 text-blue-500 text-center">Logging in...</div>

            <!-- Login message -->
            <div v-if="message" class="mt-4 text-center text-green-500">{{ message }}</div>
        </div>
    </div>
</template>
