<template>
    <div class="room">
        <span>{{room.title}}</span>
        <button v-on:click="deleteRoomAPI">X</button>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    props: ['room'],
    methods: {
        deleteRoomAPI: async function(){
            const { id } = this.room;

            // server
            const host = 'localhost';
            const port = 9090;
            const URL_Server = `http://${host}:${port}`;
            // Resouce: /rooms
            const resource = `${URL_Server}/rooms/${id}`;

            // PUT

            try {
                const response = await axios.delete(resource);

                console.log(response)
                if(response.status === 200){
                    console.log('Room deleted!!!')
                    this.$emit('deleteRoom', id);
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


