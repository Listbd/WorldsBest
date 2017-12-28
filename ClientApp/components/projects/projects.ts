import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Project } from '../shared/interfaces/project';
import { ProjectTask } from '../shared/interfaces/projectTask';

@Component
export default class ProjectsComponent extends Vue {
    projects: Project[] = [];
    blankProject: Project;

    mounted() {
        this.blankProject = {
            'ProjectId': 0,
            'Name': '',
            'ExternalSystemKey': '',
            'ProjectTasks': []
        };

        let auth = btoa(`test:test`);
        let headers = { 'Authorization': 'Basic ' + auth };
        let url = 'https://b-timeback.azurewebsites.net/api/projects';
        //let url = 'api/SampleData/Projects';

        // -----------------------------------------------------------------
        // NOTE: Apparently, the API at b-timeback.azurewebsites.net does not camel case 
        // the returned properties. It keeps them Pascal. So, that appears to be a function
        // of the backend API and not the front end interpretation, as I had perhaps
        // previously thought
        // -----------------------------------------------------------------

        fetch(url, { headers: headers })
            .then(response => response.json() as Promise<Project[]>)
            .then(data => {
                // data is coming back Pascal case from the b-time api
                this.projects = data;
            });
    }

    deleteProject = (data: any, b: any, c: any, d: any) =>
    {
        debugger;
        alert(`Clicked on ${data.name}. ... delete project not implemented`);
    }
}