import Vue from 'vue';
import axios from 'axios';
import { Component } from 'vue-property-decorator';
import { Project } from '../shared/interfaces/project';
import { ProjectTask } from '../shared/interfaces/projectTask';
//import * as toastr from 'toastr';
import { TimeTrackerService } from '../shared/timeTrackerService';

import router from 'vue-router';

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
        TimeTrackerService.getProjects().then(response => {
            this.projects = response.data;
        }).catch(error => {
            debugger;
        });
    }

    addProject() {
        TimeTrackerService.addProject(this.blankProject).then(response => {
            let newProject = response.data;
            // it doesn't have tasks yet so give it a blank array
            newProject.ProjectTasks = [];
            this.projects.push(newProject);
            this.initializeBlankProject();
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
        TimeTrackerService.deleteProject(project.ProjectId).then(response => {
            // remove this one from the array
            // vue doesn't have find, so use filter
            this.projects = this.projects.filter(item => {
                if (item.ProjectId !== project.ProjectId) return item;
            });
        })
    }

    openProject(project: Project) {
        alert(project.Name);
        //this.$router.push({ path: `project`, params: { id: `${project.ProjectId}` } });
        this.$router.push(`project/${project.ProjectId}`);
        
    }
}