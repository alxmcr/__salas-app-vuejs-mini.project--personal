<template>
  <div class="form-login">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login form</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip right>
                <v-btn
                  slot="activator"
                  icon
                  large
                  href="https://codepen.io/johnjleider/pen/wyYVVj"
                  target="_blank"
                >
                  <v-icon large>mdi-codepen</v-icon>
                </v-btn>
                <span>Codepen</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  prepend-icon="email"
                  v-model="email"
                  name="email"
                  label="Email"
                  type="text"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  prepend-icon="lock"
                  :append-icon="show1 ? 'visibility_off' : 'visibility'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" v-on:click="submit">Login</v-btn>
              <v-btn color="primary" v-on:click="reset">Reset</v-btn>
              <v-spacer></v-spacer>
              <div id="google-signin-button"></div>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// Validation
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  email
} from "vuelidate/lib/validators";

// API
import APIUsers from "../api/usersAPI.js";

export default {
  name: "FormLogin",
  // Validation
  mixins: [validationMixin],

  validations: {
    email: { required, email },
    password: { required, minLength: minLength(7) }
  },
  data: function() {
    return {
      email: "",
      password: "",
      // Vuetify
      show1: false,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 7 || "Min 7 characters"
      }
    };
  },
  mounted() {
    gapi.signin2.render("google-signin-button", {
      onsuccess: this.onSignIn
    });
  },
  methods: {
    onSignIn(user) {
      try {
        const profile = user.getBasicProfile();
        console.log("profile", profile);

        const isUserExist = this.checkProfile(profile)
          .then(response => {
            console.log("success");

            // login - vuex
            this.$store.dispatch("login_google", {
              provider: "google",
              user: profile,
              isResponseOK: true,
              auth2Google: gapi.auth2
            });

            // named route
            this.$router.push({
              path: "/calendar",
              name: "calendar"
            });
          })
          .catch(e => {
            this.disconnectGoogle();
            console.error("Error, user does not exist");
          });
      } catch (error) {
        alert('Error, User does not exist!');
        console.error(error);
      }
    },
    async submit() {
      try {
        // console.log('submit!')
        this.$v.$touch();
        const user = {
          email: this.email,
          password: this.password
        };

        // console.log('user', user);
        const userEmailAuth = await APIUsers.loginAPI(user);
        // console.log('userEmailAuth', userEmailAuth);

        // Vuex
        this.$store.dispatch("login_only_email", {
          provider: "email",
          user: userEmailAuth
        });

        // Vue-Router
        this.$router.push({
          path: "/calendar",
          name: "calendar"
        });
      } catch (error) {
        alert('Error, User does not exist!');
        console.error(error);
      }
    },
    reset() {
      this.$v.$reset();
      this.email = "";
      this.password = "";
    },
    async checkProfile(profile) {
      console.log("checkProfile");

      try {
        // Google - User
        const user = this.buildUserGoogleAPI(profile);
        console.log("user", user);

        await APIUsers.checkGoogleAPI(user);
      } catch (error) {
        throw error;
      }
    },
    buildUserGoogleAPI(profile) {
      return {
        id: profile.Eea,
        name: profile.ofa,
        lastname: profile.wea,
        email: profile.U3,
        image: profile.Paa
      };
    },
    disconnectGoogle() {
      // Google API Instance
      let auth2Google = gapi.auth2;

      if (auth2Google === null || typeof auth2Google === "undefined") {
        console.error("Error, auth2Google is null or undefined");
      } else {
        console.log("Signing out....");
        let auth2Instance = auth2Google.getAuthInstance();

        // Sign out
        auth2Instance.signOut().then(function() {
          console.log("User signed out.");
        });

        // Disconnect
        auth2Instance.disconnect();
        console.log("User disconnected.");
      }
    }
  }
};
</script>

