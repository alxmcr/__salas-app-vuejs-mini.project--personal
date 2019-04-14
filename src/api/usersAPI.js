// Axios
import axios from 'axios';

export default {
    host: 'localhost',
    port: 9090,
    getUsersAPI: async function() {
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resource
            const path = 'users';
            const resource = `${URL_Server}/${path}`;
            // GET
            const response = await axios.get(resource);
            const usersResponse = response.data;
            if (usersResponse !== null) {
                // users
                return usersResponse;
            } else {
                throw new Error('Error. There are any users...');
            }
        } catch (error) {
            throw error;
        }
    },
    postUserAPI: async function(userToSave) {
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resouce: /users
            const path = 'users';
            const resource = `${URL_Server}/${path}`;
            // POST
            const response = await axios.post(resource, userToSave);
            const userResponse = response.data;
            if (userResponse !== null) {
                return userResponse;
            } else {
                throw new Error('Error. Cannot to save this user...');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    putUserAPI: async function(id, userToUpdate){
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resouce: /users
            const path = 'users';
            const resource = `${URL_Server}/${path}/${id}`;
            // PUT
            const response = await axios.put(resource, userToUpdate);
            const userResponse = response.data;
            if (userResponse !== null) {
                return userResponse;
            } else {
                throw new Error('Error. Cannot to update this user...');
            }
        } catch (error) {
            throw error;
        }
    },
    deleteUserAPI: async function(id){
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resouce: /users
            const path = 'users';
            const resource = `${URL_Server}/${path}/${id}`;
            // DELETE
            const response = await axios.delete(resource);
            const userResponse = response.data;
            if (userResponse !== null) {
                return userResponse;
            } else {
                throw new Error('Error. Cannot to delete this user...');
            }
        } catch (error) {
            throw error;
        }
    },
    loginAPI: async function(user){
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resouce: users/login
            const path = 'users/login';
            const resource = `${URL_Server}/${path}`;
            // POST
            const response = await axios.post(resource, user);
            const userResponse = response.data;
            if (userResponse !== null) {
                return userResponse;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    },
    checkGoogleAPI: async function(user){
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resouce: users/check-google
            const path = 'users/check-google';
            const resource = `${URL_Server}/${path}`;
            // POST
            const response = await axios.post(resource, user);
            const userResponse = response.data;
            if (userResponse !== null) {
                return userResponse;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }
}
