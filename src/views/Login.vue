<template>
    <div class="login">
        <form-login></form-login>
    </div>
</template>

<script>
import FormLogin from "@/components/FormLogin.vue";

export default {
    name: "Login",
    components: {
        FormLogin
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

