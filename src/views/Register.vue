<template>
    <div class="login">
        <form-user-register></form-user-register>
    </div>
</template>

<script>
import FormUserRegister from "@/components/FormUserRegister.vue";

export default {
    name: "Register",
    components: {
        FormUserRegister
    }
}
</script>

<style lang="scss" scoped>
.login{
    background-image: url(../assets/home-bg.jpg);
    color: white;
    height: 100vh;
    background-size: cover;
    background-position: center;
}
</style>

