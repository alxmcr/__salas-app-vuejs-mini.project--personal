<template>
<div class=users>
    <v-app>
        <v-toolbar flat color="white">
            <v-toolbar-title>Users</v-toolbar-title>
            <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            <v-dialog v-model="dialog" max-width="500px">
                <v-btn slot="activator" color="primary" dark class="mb-2">New User</v-btn>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6>
                                    <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6>
                                    <v-text-field v-model="editedItem.lastname" label="Last name"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6>
                                    <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6>
                                    <v-text-field v-model="editedItem.username" label="Username"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6>
                                    <v-text-field
                                        v-model="editedItem.password"
                                        :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                        :rules="[rules.required, rules.min]"
                                        :type="show1 ? 'text' : 'password'"
                                        name="input-10-1"
                                        label="Password"
                                        hint="At least 8 characters"
                                        counter
                                        @click:append="show1 = !show1"></v-text-field>
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
                :items="users"
                class="elevation-1"
                :search="search"
                >
                <template slot="items" slot-scope="props">
                    <td>{{ props.index + 1 }}</td>
                    <td v-if="showColumnId">{{ props.item.id }}</td>
                    <td>
                        <v-avatar>
                            <img
                                :src="props.item.image"
                                :alt="props.item.name"
                                >
                        </v-avatar>
                    </td>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.lastname }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>{{ props.item.username }}</td>
                    <td>{{ props.item.password }}</td>
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
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </v-data-table>
        </v-content>
    </v-app>
</div>
</template>

<script>
import axios from 'axios';

// API
import APIUsers from '../api/usersAPI.js';

export default {
    name: "users",
    data: function(){
        return {
            users: [],
            hasError: false,
            errors: [],
            // Vuetify
            showColumnId: false,
            search: '',
            show1: false,
            dialog: false,
            editedIndex: -1,
            headers: [
                {
                    text: '# User',
                    align: 'center',
                    sortable: false,
                    value: 'title'
                },{
                    text: 'Image',
                    align: 'center',
                    sortable: false,
                    value: 'image'
                },{
                    text: 'Name',
                    align: 'center',
                    sortable: false,
                    value: 'name'
                },
                {
                    text: 'Last Name',
                    align: 'center',
                    sortable: false,
                    value: 'lastname'
                },
                {
                    text: 'Email',
                    align: 'center',
                    sortable: false,
                    value: 'Email'
                },
                {
                    text: 'Username',
                    align: 'center',
                    sortable: false,
                    value: 'username'
                },
                {
                    text: 'Password',
                    align: 'center',
                    sortable: false,
                    value: 'password'
                },
                {
                    text: 'Actions',
                    align: 'center',
                    value: 'name',
                    sortable: false
                }
            ],
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
            },
            editedItem: {
                name: '',
                lastname: '',
                email: '',
                username: '',
                password: '',
                image: 'https://image.flaticon.com/icons/svg/158/158420.svg'
            },
            defaultItem: {
                name: '',
                lastname: '',
                email: '',
                username: '',
                password: '',
                image: 'https://image.flaticon.com/icons/svg/158/158420.svg'
            },
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New User' : 'Edit User'
        }
    },
    async created() {
        const users = await this.getUsersInsecureAPI();
        console.log('users', users);
        // updated
        this.users = users;    
    },
    methods: {
        // Vuetify
        initialize: async function () {
            const users = await this.getUsersInsecureAPI();

            // updated
            this.users = users;
        },
        editItem (item) {
            const index = this.users.map(function(user) { 
                            return user.id; 
                        }).indexOf(item.id);

            this.editedIndex = index
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        async deleteItem (item) {
            console.log('item', item);
            try {
                const index = this.users.map(function(user) { 
                            return user.id; 
                        }).indexOf(item.id);

                confirm('Are you sure you want to delete this item?') && this.users.splice(index, 1)

                await APIUsers.deleteUserAPI(item.id);
            } catch (error) {
                console.error(error);
                throw error;
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
                const userAPI = this.buildUserAPI(this.editedItem);
                console.log('id', id);
                console.log('userAPI', userAPI);
                console.log('this.editedIndex', this.editedIndex);

                if (this.editedIndex > -1) {
                    console.log('PUT');
                    Object.assign(this.users[this.editedIndex], this.editedItem)

                    // API
                    await APIUsers.putUserAPI(id, userAPI);

                } else {
                    console.log('POST');
                    this.users.push(this.editedItem);

                    // API
                    await APIUsers.postUserAPI(userAPI);
                }
                this.close()
            } catch (error) {
                console.error(error);
            }            
        },
        getUsersInsecureAPI: async function() {

            try {
                // server
                const host = 'localhost';
                const port = 9090;
                const URL_Server = `http://${host}:${port}`;
                // Resource
                const resource = `${URL_Server}/users-insecure`;

                // GET
                const response = await axios.get(resource);
                const usersResponse = response.data;

                console.log('usersResponse', usersResponse);

                if (usersResponse !== null) {
                    this.hasError = false;
                    this.errors = [];

                    // users
                    return usersResponse;
                } else {
                    this.hasError = true;
                    const error = 'Error. There are any users...';
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
        removeUserView: function (id) {
            const usersFiltered = this.users.filter(function(value, index, arr){
                return value.id !== id
            });

            this.users = usersFiltered;
        },
        buildUserAPI: function (user) {
            const {id, name, lastname, email, username, password, image} = user;

            return {
                id,
                name,
                lastname,
                email,
                username,
                password,
                image
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


