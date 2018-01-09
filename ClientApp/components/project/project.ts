import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Project } from '../shared/interfaces/project';
import { ProjectTask } from '../shared/interfaces/projectTask';
//import * as toastr from 'toastr';
import { TimeTrackerService } from '../shared/timeTrackerService';

@Component
export default class ProjectComponent extends Vue {
    @Prop()
    id: string; // always comes as string anyway, haven't figure out how to get it as a number

    project: Project;
    blankProjectTask: ProjectTask;

    constructor() {
        super();
        this.initializeBlankProjectTask();
    }

    getProjectName() {
        if (this.project) {
            return this.project.Name;
        }
        else {
            return '';
        }
    }

    initializeBlankProjectTask() {
        this.blankProjectTask = {
            Name: '',
            Billable: true,
            RequireComment: false,
            ProjectId: 0,
            ProjectTaskId: 0,
            ExternalSystemKey: ''
        };
    }

    coerceId(id: string): number {
        return parseInt(id);
    }

    mounted() {
        TimeTrackerService.getProject(this.coerceId(this.id)).then(response => {
            this.project = response.data;
            debugger;
        }).catch(error => {
            debugger;
        });
    }

    addTask() {
        this.blankProjectTask.ProjectId = this.project.ProjectId;
        TimeTrackerService.addProjectTask(this.blankProjectTask).then(response => {
            let newProjecTask = response.data;
            this.project.ProjectTasks.push(newProjecTask);
            this.initializeBlankProjectTask();
        }).catch(error => {
            console.log(error.response);
        });
    }

    deleteTask() {

    }
}