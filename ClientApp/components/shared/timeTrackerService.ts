import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Project } from '../shared/interfaces/project';

@Component
export default class TimeTrackerService extends Vue {
    url: string = 'https://b-timeback.azurewebsites.net/api/';
    auth = btoa(`test:test`); // TODO - change to logged in user
    headers = { 'Authorization': 'Basic ' + this.auth };

    fetchProjects = () => {
        return fetch(this.url, { headers: this.headers })
            .then(response => response.json() as Promise<Project[]>)
            .then(data => {
                return data;
            }).catch(error => {
                // TODO
            });
    }
}