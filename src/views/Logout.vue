<template></template>

<script>
export default {
    name: "Logout",
     beforeRouteEnter (to, from, next) {
         // Current instance
            // console.log('gapi', gapi);
            // console.log('this.$route', this.$route);
            // console.log('gapi.auth2', gapi.auth2);

            var auth2Google = gapi.auth2;

            // Current instance
            //console.log('this.$route.params', this.$route.params);
            //console.log('this.$route.params.auth2', this.$route.params.auth2);
            //console.log('typeof this.$route.params.auth2', typeof this.$route.params.auth2);
            //var auth2Instance = this.$route.params.auth2;
            //console.log('auth2Instance', auth2Instance)

            if (auth2Google === null || typeof auth2Google === 'undefined'){
                console.error('Error, auth2Google is null or undefined');
            } else {
                let auth2Instance = auth2Google.getAuthInstance();

                 // Sign out
                auth2Instance.signOut().then(function () {
                    console.log('User signed out.');                
                });

                // Disconnect
                auth2Instance.disconnect();
                console.log('User disconnected.');
            }
            // vue-router
            console.log('redirecting....');
        next('/');
    },
}
</script>

