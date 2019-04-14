<template>
    <div class="user">
        <span>{{user.name}} {{user.lastname}}</span>
        <button v-on:click="deleteUserAPI">X</button>
    </div>
</template>

<script>
import axios from 'axios';


export default {
    props: ['user'],
    methods: {
        deleteUserAPI: async function(){
            const { id } = this.user;

            // server
            const host = 'localhost';
            const port = 9090;
            const URL_Server = `http://${host}:${port}`;
            // Resouce: /users
            const resource = `${URL_Server}/users/${id}`;

            // PUT

            try {
                const response = await axios.delete(resource);

                console.log(response)
                if(response.status === 200){
                    console.log('Event deleted!!!')
                    this.$emit('deleteUser', id);
                }
            } catch (error) {
                console.error(error)
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>


