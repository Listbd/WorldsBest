import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class LoginComponent extends Vue {
    username: string = '';
    password: string = '';

    mounted() {
        // See if user is already logged in

        // if so, redirect to home page
    }

    login() {
        // check that credentials are valid

        // if so, write the hash to local storage
        localStorage.setItem('hackauth2', btoa(`${this.username}:${this.password}`));
    }

    signup() {
        alert("not implemented, please use Galaxy's Best to sign up.");
    }

}