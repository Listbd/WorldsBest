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
        this.initializeBlankProject();
    }

    initializeBlankProject() {
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

    addProject() {
        //this.projects.push(this.blankProject);

        let auth = btoa(`test:test`);
        let headers = { 'Authorization': 'Basic ' + auth };
        let url = TimeTrackerService.url + "projects?format=json&callId=" + TimeTrackerService.generateGuid();
        axios.post(url, this.blankProject, { headers: headers })
            .then(response => {
                let newProject = response.data;
                // it doesn't have tasks yet so give it a blank array
                newProject.ProjectTasks = [];
                this.projects.push(newProject);

                this.initializeBlankProject();
                // refetch projects
                //axios.get(TimeTrackerService.url + 'projects', { headers: headers })
                //    .then(response2 => {
                //        // data is coming back Pascal case from the b-time api
                //        this.projects = response2.data;
                //    });
            }).catch(error => {
                // TODO - toastr or something
                console.log(error.response);
            });
    }

    // ARROW FUNCTION DOES NOT WORK, IT DOES NOT CORRECTLY DETERMINE WHAT THIS IS
    // xxxx-nope--->   deleteProject = (project: Project) => {

    // FROM THE DOCS
    // Don’t use arrow functions on an options property or callback, such as 
    // created: () => console.log(this.a) or vm.$watch('a', newValue => this.myMethod()).
    // Since arrow functions are bound to the parent context, this will not be the Vue 
    // instance as you’d expect, often resulting in errors such as Uncaught TypeError: Cannot 
    // read property of undefined or Uncaught TypeError: this.myMethod is not a function.

    deleteProject(project: Project, event: any) {
        //if (this.projects.length > 0) {
        //    this.projects.pop();
        //}
        let url = `${TimeTrackerService.url}projects/${project.ProjectId}?format=json&callId=${TimeTrackerService.generateGuid()}`;
        let auth = btoa(`test:test`);
        let headers = { 'Authorization': 'Basic ' + auth };
        axios.delete(url, { headers: headers })
            .then(response => {
                // remove this one from the array
                // vue doesn't have find, so use filter
                this.projects = this.projects.filter(item => {
                    if (item.ProjectId !== project.ProjectId) return item;
                });
            })
            


    }
}