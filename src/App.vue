<template>
<v-app>
    <v-toolbar app>
        <v-toolbar-title class="headline text-uppercase">
            <span>BR</span>
            <span class="font-weight-light">Booking Rooms</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn flat>
                <router-link to="/">Home</router-link>
            </v-btn>
             <v-btn flat v-if="!isLoggedIn">
                <router-link to="/register">Register</router-link>
            </v-btn>
            <v-btn flat v-if="isLoggedIn">
                <router-link to="/calendar">Calendar</router-link>
            </v-btn>
            <v-btn flat v-if="isLoggedIn">
                <router-link to="/users">Users</router-link>
            </v-btn>
            <v-btn flat v-if="isLoggedIn">
                <router-link to="/rooms">Rooms</router-link>
            </v-btn>
            <v-btn flat v-if="isLoggedIn">
                <v-avatar>
                    <img
                        :src="getUserLoggedIn.image"
                        :alt="getUserLoggedIn.name"
                        >
                </v-avatar>
            </v-btn>
            <v-btn flat>
                <a v-if="isLoggedIn" v-on:click="signOut">Logout</a>
                <router-link v-else to="/login">Login</router-link>
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
    <v-content>
        <router-view/>
    </v-content>
</v-app>
</template>

<script>
export default {
    name: 'App',
    computed: {
        isLoggedIn: function() {
            return this.$store.getters.isLoggedIn;
        },
        getUserLoggedIn: function() {
            return this.$store.getters.userLoggedIn;
        },
    },
    methods: {
        signOut() {
            // Google API Instance
            let auth2Google = gapi.auth2;

            if (auth2Google === null || typeof auth2Google === 'undefined') {
                console.error('Error, auth2Google is null or undefined');
            } else {
                console.log('Signing out....');
                let auth2Instance = auth2Google.getAuthInstance();

                // Sign out
                auth2Instance.signOut().then(function() {
                    console.log('User signed out.');
                });

                // Disconnect
                auth2Instance.disconnect();
                console.log('User disconnected.');
            }
            // login - vuex
            this.$store.dispatch('logout');

            // vue-router
            // console.log('redirecting....');
            this.$router.push({
                path: '/'
            })
        },
    }
}
</script>