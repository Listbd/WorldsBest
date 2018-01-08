import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Project } from '../shared/interfaces/project';
import { ProjectTask } from '../shared/interfaces/projectTask';
//import * as toastr from 'toastr';
import { TimeTrackerService } from '../shared/timeTrackerService';

@Component
export default class ProjectComponent extends Vue {
    @Prop()
    id: number;

    project: Project;

    mounted() {
        alert(this.id);

        this.project = {
            ProjectId: 0,
            Name: "dummy",
            ExternalSystemKey: "",
            ProjectTasks: []
        };
        //TimeTrackerService.getProject(this.id).then(response => {
        //    this.projects = response.data;
        //}).catch(error => {
        //    debugger;
        //});
    }

    addTask() {

    }

    deleteTask() {

    }
}