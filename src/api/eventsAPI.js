// Axios
import axios from 'axios';

export default {
    host: 'localhost',
    port: 9090,
    getEventsDataTableView: async function() {
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resource
            const path = 'events-datatable';
            const resource = `${URL_Server}/${path}`;
            // GET
            const response = await axios.get(resource);
            const eventsResponse = response.data;
            if (eventsResponse !== null) {
                // Events
                return eventsResponse;
            } else {
                throw new Error('Error. There are any events...');
            }
        } catch (error) {
            throw error;
        }
    },
    getEventsCalendar: async function() {
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resource
            const path = 'events';
            const resource = `${URL_Server}/${path}`;
            // GET
            const response = await axios.get(resource);
            const eventsResponse = response.data;
            if (eventsResponse !== null) {
                // Events
                return eventsResponse;
            } else {
                throw new Error('Error. There are any events...');
            }
        } catch (error) {
            throw error;
        }
    },
    getEventsAPI: async function() {
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resource
            const path = 'events';
            const resource = `${URL_Server}/${path}`;
            // GET
            const response = await axios.get(resource);
            const eventsResponse = response.data;
            if (eventsResponse !== null) {
                // Events
                return eventsResponse;
            } else {
                throw new Error('Error. There are any events...');
            }
        } catch (error) {
            throw error;
        }
    },
    postEventAPI: async function(eventToSave) {
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resouce: /events
            const path = 'events';
            const resource = `${URL_Server}/${path}`;
            // POST
            const response = await axios.post(resource, eventToSave);
            const eventResponse = response.data;
            if (eventResponse !== null) {
                return eventResponse;
            } else {
                throw new Error('Error. Cannot to save this event...');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    putEventAPI: async function(id, eventToUpdate) {
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resouce: /events
            const path = 'events';
            const resource = `${URL_Server}/${path}/${id}`;
            // PUT
            const response = await axios.put(resource, eventToUpdate);
            const eventResponse = response.data;
            if (eventResponse !== null) {
                return eventResponse;
            } else {
                let error = 'Error. Cannot to update this event...';
                console.error(error);
                throw new Error(error);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    deleteEventAPI: async function(id) {
        try {
            // server
            const URL_Server = `http://${this.host}:${this.port}`;
            // Resouce: /events
            const path = 'events';
            const resource = `${URL_Server}/${path}/${id}`;
            // DELETE
            const response = await axios.delete(resource);
            const eventResponse = response.data;
            if (eventResponse !== null) {
                return eventResponse;
            } else {
                throw new Error('Error. Cannot to delete this event...');
            }
        } catch (error) {
            throw error;
        }
    },
}