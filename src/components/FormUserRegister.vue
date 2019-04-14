<template>
<div class="form-user-register">
    <v-container fluid fill-height>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
            <v-toolbar dark color="primary">
            <v-toolbar-title>Register form</v-toolbar-title>
            <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
            <v-form>
                <v-text-field prepend-icon="person" name="name" label="Name" type="text" required></v-text-field>
                <v-text-field prepend-icon="person" name="lastname" label="Lastname" type="text" required></v-text-field>
                <v-text-field prepend-icon="email" name="email" label="Email" type="text" required></v-text-field>
                <v-text-field prepend-icon="person" name="username" label="Username" type="text" required></v-text-field>
                <v-text-field prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
            </v-form>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary">Register</v-btn>
            <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
        </v-flex>
    </v-layout>
    </v-container>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: "FormUserRegister",
    data: function(){
        return {
            user: {
                name: '',
                lastname:'',
                username: '',
                password: '',
            },
            hasError: false,
            errors: []
        }
    },
    methods: {
        postUserAPI: async function () {
            const newUser = {
                name: this.user.name,
                lastname:this.user.lastname,
                username: this.user.username,
                password: this.user.password,
            }

            try {
                // server
                const host = 'localhost';
                const port = 9090;
                const URL_Server = `http://${host}:${port}`;
                // Resouce: /users
                const resource = `${URL_Server}/users`;

                // POST
                const response = await axios.post(resource, newUser);
                const userResponse = response.data;

                if (userResponse !== null) {
                    this.hasError = false;
                    this.errors = [];

                    this.$router.push({ name: 'home', params: userResponse })

                } else {
                    this.hasError = true;
                    const error = 'Error. Cannot register a new user...';
                    console.error('error', error);
                    this.errors.push(error);
                }
            } catch (error) {
                console.error(error)
                this.hasError = true;
                this.errors.push(error.message);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#btn-register {
  background-color: #42b983;
  color: white;
}
#btn-reset {
  background-color: rgb(218, 107, 107);
  color: white;
}

.errors{
    background-color: rgb(194, 118, 118);
    color: white;
    margin: 10px;
    padding: 10px;
}

.form-buttons{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 10px auto;
    width: 50%;
}

.form-button{
    background-color: transparent;
    border: 0;
    padding: 10px;
}

.form-login{
    padding: 10px;
}
</style>


