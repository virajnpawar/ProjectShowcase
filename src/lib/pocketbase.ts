import PocketBase from 'pocketbase';

export const pb = new PocketBase(import.meta.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Helper to check if user is admin
export const isAdmin = () => {
    return pb.authStore.isValid && pb.authStore.isAdmin;
};
