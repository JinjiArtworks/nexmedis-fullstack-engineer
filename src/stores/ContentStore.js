import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from '../stores/UserStore' // Adjust the import according to your structure

const userStore = useUserStore()
export const useContentStore = defineStore('contentStore', {
    state: () => ({
        contents: {},
        users: {},        // Stores user info
        comments: {},
        loading: false,
        title: '',
        description: '',
        author: '',
        like: 0,
    }),
    getters: {
        favs(state) {
            return state.tasks.filter(t => t.isFav); // Example of a getter for favorite tasks
        },
    },
    actions: {
        async getContent() {
            this.loading = true
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    throw new Error('No token found, please login.')
                }
                const response = await axios.get('http://localhost:3000/content', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                this.contents = response.data.map(content => ({
                    ...content,
                    comments: content.comments ? JSON.parse(`[${content.comments}]`) : []
                }));
            } catch (error) {
                console.error('Error fetching user:', error.message)
            } finally {
                this.loading = false
            }
        },

        async createContent() {
            await userStore.getUser(); // Ensure user data is available
            const currentUsername = userStore.users.username // Get the logged-in user
            this.loading = true
            try {
                const response = await axios.post('http://localhost:3000/create-content', {
                    title: this.title,
                    description: this.description,
                    author: currentUsername,
                    likes_count: 0
                })
                this.message = response.data.msg
            } catch (error) {
                this.message = error.response?.data?.msg || 'An error occurred'
            } finally {
                this.loading = false
                await this.getContent()
                this.title = ''
                this.description = ''
            }
        },
        async editContent(content) {
            this.loading = true;
            try {
                const response = await axios.put(`http://localhost:3000/update-content/${content.id}`, {
                    title: content.title,
                    description: content.description
                });
                this.message = response.data.msg;
            } catch (error) {
                this.message = error.response?.data?.msg || 'An error occurred';
            } finally {
                this.loading = false;
                await this.getContent(); // Refresh content after editing
                this.title = '';
                this.description = '';
            }
        },

        // Create a delete content function
        async deleteContent(contentId) {
            this.loading = true;
            try {
                const response = await axios.delete(`http://localhost:3000/delete-content/${contentId}`);
                this.message = response.data.msg;
            } catch (error) {
                this.message = error.response?.data?.msg || 'An error occurred';
            } finally {
                this.loading = false;
                await this.getContent(); // Refresh content after deletion
            }
        },
        async likeContent(contentId) {
            try {
                const response = await axios.post(`http://localhost:3000/like-content/${contentId}`);
                if (response.data.success) {
                    // Find the content and increment likes_count locally
                    const content = this.contents.find(item => item.id === contentId);
                    if (content) {
                        content.likes_count++;
                    }
                }
            } catch (error) {
                console.error('Error liking content:', error.message);
            }
        },
        async dislikeContent(contentId) {
            try {
                const response = await axios.post(`http://localhost:3000/dislike-content/${contentId}`);
                if (response.data.success) {
                    // Find the content and increment likes_count locally
                    const content = this.contents.find(item => item.id === contentId);
                    if (content) {
                        content.likes_count--;
                    }
                }
            } catch (error) {
                console.error('Error liking content:', error.message);
            }
        },
        async likeContent(contentId) {
            try {
                const response = await axios.post(`http://localhost:3000/like-content/${contentId}`);
                if (response.data.success) {
                    // Find the content and increment likes_count locally
                    const content = this.contents.find(item => item.id === contentId);
                    if (content) {
                        content.likes_count++;
                    }
                }
            } catch (error) {
                console.error('Error liking content:', error.message);
            }
        },
        async addComment(contentId) {
            await userStore.getUser();  // Ensure user data is available
            const currentUserId = userStore.users.id;  // Get the logged-in user
            const commentMessage = this.comments[contentId];  // Get the comment for this specific post
            if (!commentMessage) {
                return alert('Please enter a comment');
            }
            this.loading = true;
            try {
                await axios.post(`http://localhost:3000/add-comment/${contentId}`, {
                    comments: commentMessage,
                    id_content: contentId,
                    id_user: currentUserId
                });
                this.comments[contentId] = '';  // Clear the message after submission
                this.getContent();  // Reload content if needed
            } catch (error) {
                console.error('Error adding comment:', error.response?.data?.msg || 'An error occurred');
            } finally {
                this.loading = false;
            }
        }
    },
})