<template>
    <div class="form-room">
        <div class="errors" v-if="hasError">
            <span v-for="(error, key) in errors" :key="key">{{error}}</span><br>
        </div>
        <form v-on:submit.prevent="postRoomAPI" class="form" method="POST">
            <label for="title">Title:</label>
            <input type="text" name="title" id="title" v-model="room.title" required><br>
            <div class="form-buttons">
                <input type="submit" value="Enter" class="form-button" id="btn-register">
                <input type="reset" value="Reset" class="form-button" id="btn-reset">
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'FormRoomRegister',
     data: function(){
        return {
            room: {
                title: '',
            },
            hasError: false,
            errors: []
        }
    },
    methods: {
        postRoomAPI: async function () {
            const newRoom = {
                title: this.room.title
            }

            try {
                // server
                const host = 'localhost';
                const port = 9090;
                const URL_Server = `http://${host}:${port}`;
                // Resouce: /rooms
                const resource = `${URL_Server}/rooms`;

                // POST
                const response = await axios.post(resource, newRoom);
                const roomResponse = response.data;

                if (roomResponse !== null) {
                    this.hasError = false;
                    this.errors = [];

                    this.$router.push({ name: 'home', params: roomResponse })

                } else {
                    this.hasError = true;
                    const error = 'Error. Cannot register a new room...';
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
