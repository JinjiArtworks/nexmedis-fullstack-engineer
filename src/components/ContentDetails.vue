<script setup>
import { ref } from 'vue'
import { useContentStore } from '@/stores/ContentStore.js'
import { storeToRefs } from 'pinia';

const contentStore = useContentStore()
const { comments } = storeToRefs(contentStore) // jgn sampe typo disini

const createComments = async (postId) => {
    await contentStore.addComment(postId)
}
const isModalOpen = ref(false)
const content = ref({})
const likedPosts = ref([]) // Store IDs of liked content
// Function to open the edit modal and populate fields
const openEditModal = (item) => {
    content.value = { ...item }
    isModalOpen.value = true
}

// Function to submit the edited content
const submitEdit = async () => {
    await contentStore.editContent(content.value)
    closeModal()
}

// Function to close the modal
const closeModal = () => {
    isModalOpen.value = false // Hide modal
}

// Fetch contents when the component mounts
const hasLiked = (postId) => likedPosts.value.includes(postId);

const toggleLike = async (postId) => {
    if (hasLiked(postId)) {
        // Dislike the post
        likedPosts.value = likedPosts.value.filter(id => id !== postId);
        await contentStore.dislikeContent(postId) // Send like request to backend
    } else {
        // Like the post
        likedPosts.value.push(postId);
        await contentStore.likeContent(postId) // Send like request to backend
    }
}
defineProps({
    contents: Array,
    user: Object,
})
</script>

<template>
    <!-- Post Section -->
    <div v-for="item in contents" class="bg-white shadow rounded-lg p-4 mb-4">
        <small>{{ item.author }}</small>
        <div class="task">
            <h4 class="text-md font-bold">{{ item.title }}</h4>
            <div class="icons">
                <i class="material-icons" @click="openEditModal(item)">edit</i>
                <i class="material-icons" @click="contentStore.deleteContent(item.id)">delete</i>
            </div>
        </div>
        <p class="text-gray-700">{{ item.description }}</p>

        <!-- Like Button -->
        <div class="flex items-center space-x-4 mt-4">
            <button @click="toggleLike(item.id)" :class="{
                'px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600': !hasLiked(item.id),
                'px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600': hasLiked(item.id)
            }">
                {{ hasLiked(item.id) ? 'Dislike' : 'Like' }}
            </button>
            <span>{{ item.likes_count }} Likes</span>
        </div>

        <!-- Comment Section -->
        <h3 class=" text-md font-bold mt-4">Comments :</h3>
        <ul class="mb-4">
            <li v-for="(comment, index) in item.comments" :key="index" class="mb-2">
                <div class="flex items-center">
                    <span class="text-blue-500 font-bold mr-2">{{ comment.name }}:</span>
                    <span class="text-gray-700">{{ comment.com }}</span>
                </div>
            </li>
        </ul>
        <!-- Comment Section for each post -->
        <form @submit.prevent="createComments(item.id)">
            <textarea v-model="comments[item.id]" placeholder="Add Comment"
                class="shadow appearance-none border rounded w-full mt-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            <button class="px-4 py-2 bg-green-500 text-white rounded mt-2">
                Submit
            </button>
        </form>
        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 class="text-lg mb-4">Edit Content</h2>
                <form @submit.prevent="submitEdit">
                    <div class="mb-4">
                        <label class=" text-gray-700 text-sm mb-2">Title</label>
                        <input v-model="content.title" type="text" placeholder="Username"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div class="mb-4">
                        <label class=" text-gray-700 text-sm mb-2">Description</label>
                        <textarea v-model="content.description" type="text" placeholder="Username"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div class="flex justify-end">
                        <button @click="closeModal"
                            class="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded">Cancel</button>
                        <button type="submit"
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</template>
