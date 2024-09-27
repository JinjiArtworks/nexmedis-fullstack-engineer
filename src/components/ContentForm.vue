<script setup>
import { useContentStore } from '@/stores/ContentStore.js';
import { storeToRefs } from 'pinia';
const contentStore = useContentStore()
const { title, description } = storeToRefs(contentStore)
const createContent = async () => {
    await contentStore.createContent()
}
</script>

<template>
    <form class="flex flex-row justify-center" @submit.prevent="createContent">
        <input type="text" placeholder="Title" v-model="title">
        <input type="text" placeholder="Description" v-model="description">
        <button class="px-6"> Create </button>
    </form>
</template>
