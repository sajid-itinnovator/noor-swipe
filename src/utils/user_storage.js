/**
 * User Storage Utility
 * 
 * Manages user identity and profile data.
 * Keys: 'noor_user_profile'
 */

const USER_STORAGE_KEY = 'noor_user_profile';

const defaultUser = {
    name: 'Learner',
    profileType: 'adult', // 'adult' or 'junior'
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1skqy1lwoMBsZrtneEY5yEZ7CEdyD0tETAI4kgQyMeDQwsWKMRNlIytDY_dqLg2oGZ7C_1n-B_VBqkUdv-vOWYM3IKDwSh0acQKDbrP1iFCTVbJqTwz0iDbufFnqyoRbuuva9c_XL1Nnyi87I_BoWOgLH3FdSyT5_2ycB1_HDECHeu7z6JuTTMM5e6unFFHLGBUB7W8zWjkPkf8CYmpv3OJ-CGp9fRxk0rePo1fZaisdhvepTFbsGtaQVysLkA5flLrpHhOK4Sw", // default avatar
    joinedDate: new Date().toISOString()
};

export const getUser = () => {
    try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.warn("Failed to load user profile", e);
        return null;
    }
};

export const saveUser = (user) => {
    try {
        const data = { ...defaultUser, ...user };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
        return data;
    } catch (e) {
        console.error("Failed to save user profile", e);
        return null;
    }
};

export const deleteUser = () => {
    try {
        localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
        console.error("Failed to delete user profile", e);
    }
};
