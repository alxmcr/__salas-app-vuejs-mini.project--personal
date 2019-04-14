<template>
    <div class="home">
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <div class="headline">
                    <h1 class="headline">BR</h1>
                    <h2 class="font-weight-light">Booking Rooms</h2>
                </div>
            </v-layout>
        </v-container>        
    </div>
</template>

<script>
export default {
    name: "home",

}
</script>

<style lang="scss" scoped>
.home{
    background-image: url(../assets/home-bg.jpg);
    color: white;
    height: 100vh;
    background-size: cover;
    background-position: center;
}
</style>

