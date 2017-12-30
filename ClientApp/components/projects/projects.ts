import Vue from 'vue';
import axios from 'axios';
import { Component } from 'vue-property-decorator';
import { Project } from '../shared/interfaces/project';
import { ProjectTask } from '../shared/interfaces/projectTask';
//import * as toastr from 'toastr';
import { TimeTrackerService } from '../shared/timeTrackerService';


@Component
export default class ProjectsComponent extends Vue {
    projects: Project[] = [];
    blankProject: Project;

    constructor() {
        super();
        this.blankProject = {
            Name: '',
            ExternalSystemKey: '',
            ProjectId: 0,
            ProjectTasks: []
        };
    }

    mounted() {
        let auth = btoa(`test:test`);
        let headers = { 'Authorization': 'Basic ' + auth };
        let url = TimeTrackerService.url + 'projects';
        //let url = 'api/SampleData/Projects';

        // -----------------------------------------------------------------
        // NOTE: Apparently, the API at b-timeback.azurewebsites.net does not camel case 
        // the returned properties. It keeps them Pascal. So, that appears to be a function
        // of the backend API and not the front end interpretation, as I had perhaps
        // previously thought
        // -----------------------------------------------------------------

        // Get ERROR does not pass Access-Control-Allow-Origin, CORS issues?
        // this.projects = TimeTrackerService.fetchProjects(); // from TimeTrackerService

        //fetch(url, { headers: headers })
        //    .then(response => response.json() as Promise<Project[]>)
        //    .then(data => {
        //        // data is coming back Pascal case from the b-time api
        //        this.projects = data;
        //    });

        axios.get(url, { headers: headers })
            .then(response => {
                debugger;
                // data is coming back Pascal case from the b-time api
                this.projects = response.data;
            });

    }

    addProject = () => {
        let auth = btoa(`test:test`);
        let headers = { 'Authorization': 'Basic ' + auth };
        let url = TimeTrackerService.url + "projects?format=json&callId=" + TimeTrackerService.generateGuid();
        axios.post(url, this.blankProject, { headers: headers })
            .then(data => {
                debugger;
            }).catch(error => {
                console.log(error.response);
                debugger;
            });

        // TODO refetch projects


    }

    deleteProject = (data: any, b: any, c: any, d: any) =>
    {
        debugger;
        alert(`Clicked on ${data.name}. ... delete project not implemented`);
        //var url = apiurl + "/Projects/" + projectId + "?format=json&callId=" + common.generateGuid();
        //var r = $http({
        //    url: url,
        //    method: 'DELETE',
        //    headers: { 'Authorization': 'Basic ' + authService.getAuthCode() }
        //});

    }
}