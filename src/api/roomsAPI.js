// Axios
import axios from 'axios';

export default {
    host: 'localhost',
    port: 9090,
    getRoomsAPI: async function() {
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resource
            const path = 'rooms';
            const resource = `${URL_Server}/${path}`;
            // GET
            const response = await axios.get(resource);
            const roomsResponse = response.data;
            if (roomsResponse !== null) {
                // rooms
                return roomsResponse;
            } else {
                throw new Error('Error. There are any rooms...');
            }
        } catch (error) {
            throw error;
        }
    },
    postRoomAPI: async function(roomToSave) {
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resouce: /rooms
            const path = 'rooms';
            const resource = `${URL_Server}/${path}`;
            // POST
            const response = await axios.post(resource, roomToSave);
            const roomResponse = response.data;
            if (roomResponse !== null) {
                return roomResponse;
            } else {
                throw new Error('Error. Cannot to save this room...');
            }
        } catch (error) {
            throw error;
        }
    },
    putRoomAPI: async function(id, roomToUpdate){
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resouce: /rooms
            const path = 'rooms';
            const resource = `${URL_Server}/${path}/${id}`;
            // PUT
            const response = await axios.put(resource, roomToUpdate);
            const roomResponse = response.data;
            if (roomResponse !== null) {
                return roomResponse;
            } else {
                throw new Error('Error. Cannot to update this room...');
            }
        } catch (error) {
            throw error;
        }
    },
    deleteRoomAPI: async function(id){
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resouce: /rooms
            const path = 'rooms';
            const resource = `${URL_Server}/${path}/${id}`;
            // DELETE
            const response = await axios.delete(resource);
            const roomResponse = response.data;
            if (roomResponse !== null) {
                return roomResponse;
            } else {
                throw new Error('Error. Cannot to delete this room...');
            }
        } catch (error) {
            throw error;
        }
    },
}
