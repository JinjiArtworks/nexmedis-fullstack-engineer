<script setup>
import { useUserStore } from '../stores/UserStore'
import { useContentStore } from '../stores/ContentStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import ContentDetails from '@/components/ContentDetails.vue';
import ContentForm from '@/components/ContentForm.vue';

// Use the user store
const userStore = useUserStore()
const contentStore = useContentStore()

// Destructure user and loading from store using storeToRefs
const { users } = storeToRefs(userStore)
const { contents, loading } = storeToRefs(contentStore)
// Fetch the user data when the component is mounted
onMounted(() => {
    userStore.getUser()
    contentStore.getContent()
})
</script>

<template>
    <main>
        <header>
            <!-- <img src="@/assets/pinia-logo.svg" alt=""> -->
            <img src="@/assets/nex-logo.png" alt="">
            <h1>Social Media</h1>
        </header>

        <!-- New task form -->
        <div class="new-task-form">
            <p class="flex justify-center mb-4">Create New Post</p>
            <ContentForm />
        </div>

        <!-- Loading -->
        <div class="loading" v-if="loading">Loading ...</div>
        <div class="flex justify-center mt-4">
            Hello {{ users.username }}~
        </div>
        <div class="task-list">
            <!-- There is 2 way to sending props. one : -->
            <ContentDetails :user="users" :contents="contents" />
        </div>
    </main>
</template>
