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

    name: string = '';
    projectTasks: ProjectTask[] = [];

    constructor() {
        super();

        this.project = {
            Name: '',
            ExternalSystemKey: '',
            ProjectId: 0,
            ProjectTasks: []
        }

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

    mounted() {

        //TimeTrackerService.getProjects().then(response => {
        //    this.project = response.data[0];
        //}).catch(error => {
        //    debugger;
        //});


        TimeTrackerService.getProject(parseInt(this.id)).then(response => {
            this.project = response.data;
            //alert(this.project.Name);

            //this.name = response.data.Name;
            //this.projectTasks = response.data.ProjectTasks;
            debugger;
        }).catch(error => {
            debugger;
        });
    }

    addTask() {
        this.blankProjectTask.ProjectId = this.project.ProjectId;
        TimeTrackerService.addProjectTask(this.blankProjectTask).then(response => {
            let newProjectTask: ProjectTask = response.data;

            // !!!!the back end does not return billable or requirecomment??!
            // so just pull those value from the post data
            newProjectTask.Billable = this.blankProjectTask.Billable;
            newProjectTask.RequireComment = this.blankProjectTask.RequireComment;

            this.project.ProjectTasks.push(newProjectTask);
            this.initializeBlankProjectTask();
        }).catch(error => {
            console.log(error.response);
        });
    }

    deleteTask(projectTask: ProjectTask, event: any) {
        TimeTrackerService.deleteProjectTask(projectTask.ProjectTaskId).then(response => {
            this.project.ProjectTasks = this.project.ProjectTasks.filter(item => {
                if (item.ProjectTaskId !== projectTask.ProjectTaskId) return item;
            });
        });
    }
}