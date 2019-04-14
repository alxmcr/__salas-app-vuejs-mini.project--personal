<template>
<v-app>
    <div class=rooms>
        <v-toolbar flat color="white">
            <v-toolbar-title>Rooms</v-toolbar-title>
            <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
                <v-btn slot="activator" color="primary" dark class="mb-2">New Room</v-btn>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field v-model="editedItem.title" label="Room title"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                        <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>
        <v-content>
            <v-data-table
                :headers="headers"
                :items="rooms"
                class="elevation-1"
                >
                <template slot="items" slot-scope="props">
                    <td>{{ props.index + 1 }}</td>
                    <td>{{ props.item.title }}</td>
                    <td class="justify-center layout px-0">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editItem(props.item)"
                            >
                            edit
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteItem(props.item)"
                            >
                            delete
                        </v-icon>
                    </td>
                </template>
                <template slot="no-data">
                    <v-btn color="primary" @click="initialize">Reset</v-btn>
                </template>
            </v-data-table>
        </v-content>
    </div>
</v-app>
</template>

<script>
import axios from 'axios';
// API
import APIRooms from '../api/roomsAPI.js';

export default {
    name: "rooms",
    data: function() {
        return {
            rooms: [],
            hasError: false,
            errors: [],
            // Vuetify
            dialog: false,
            editedIndex: -1,
            headers: [
                {
                    text: '# Room',
                    align: 'center',
                    sortable: false,
                    value: 'title'
                },{
                    text: 'Title',
                    align: 'center',
                    sortable: false,
                    value: 'title'
                },
                {
                    text: 'Actions',
                    align: 'center',
                    value: 'title',
                    sortable: false
                }
            ],
            editedItem: {
                title: '',
            },
            defaultItem: {
                title: '',
            },
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Room' : 'Edit Room'
        }
    },
    async created() {
        const rooms = await this.getRoomsAPI();

        // updated
        this.rooms = rooms;
    },
    methods: {
        // Vuetify
        initialize: async function () {
            const rooms = await this.getRoomsAPI();

            // updated
            this.rooms = rooms;
        },
        editItem (item) {
            const index = this.rooms.map(function(room) { 
                            return room.id; 
                        }).indexOf(item.id);

            this.editedIndex = index
            this.editedItem = Object.assign({}, item)
            this.dialog = true;
        },

        async deleteItem (item) {
            console.log('item', item);
            try {
                const index = this.rooms.map(function(room) { 
                            return room.id; 
                        }).indexOf(item.id);

                confirm('Are you sure you want to delete this item?') && this.rooms.splice(index, 1)

                await APIRooms.deleteRoomAPI(item.id);
            } catch (error) {
                console.error(error);
            }
        },
        close() {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },

        async save() {

            try {
                const id = this.editedItem.id;
                const roomAPI = this.buildRoomAPI(this.editedItem);
                console.log('roomAPI', roomAPI);
                console.log('this.editedIndex', this.editedIndex);

                if (this.editedIndex > -1) {
                    console.log('PUT');
                    Object.assign(this.rooms[this.editedIndex], this.editedItem)

                    // API
                    await APIRooms.putRoomAPI(id, roomAPI);

                } else {
                    console.log('POST');
                    this.rooms.push(this.editedItem);

                    // API
                    await APIRooms.postRoomAPI(roomAPI);
                }
                this.close()
            } catch (error) {
                console.error(error);
            }            
        },
        getRoomsAPI: async function() {

            try {
                // server
                const host = 'localhost';
                const port = 9090;
                const URL_Server = `http://${host}:${port}`;
                // Resource
                const resource = `${URL_Server}/rooms`;

                // GET
                const response = await axios.get(resource);
                const roomsResponse = response.data;

                if (roomsResponse !== null) {
                    this.hasError = false;
                    this.errors = [];

                    // rooms
                    return roomsResponse;
                } else {
                    this.hasError = true;
                    const error = 'Error. There are any rooms...';
                    console.error(error);
                    this.errors.push(error);
                }
            } catch (error) {
                console.error(error)
                this.hasError = true;
                this.errors.push(error.message);
            }

            return [];
        },
        removeRoomView: function(id) {
            const roomsFiltered = this.rooms.filter(function(value, index, arr) {
                return value.id !== id
            });

            this.rooms = roomsFiltered;
        },
        buildRoomAPI: function (room) {
            const {id, title} = room;

            return {
                id,
                title
            };
        }
    }
}
</script>

<style lang="scss" scoped>
.errors{
    background-color: rgb(194, 118, 118);
    color: white;
    margin: 10px;
    padding: 10px;
}
</style>


