import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Project } from '../shared/interfaces/project';
import { ProjectTask } from '../shared/interfaces/projectTask';
import { TimeEntry } from '../shared/interfaces/timeEntry';
//import * as toastr from 'toastr';
import { Moment } from 'moment';
import { TimeTrackerService } from '../shared/timeTrackerService';


@Component
export default class TimeEntryComponent extends Vue {
    @Prop()
    id: string; // always comes as string anyway, haven't figure out how to get it as a number

    timeEntries: TimeEntry[] = [];
    blankTimeEntry: TimeEntry

    constructor() {
        super();

        this.initializeBlankTimeEntry();
    }

	initializeBlankTimeEntry(): void {

        this.blankTimeEntry = {
            "ProjectRoleId": 0,
            "ProjectTaskId": 0,
            "Billable": true,
            "TimeIn": "",
            "TimeOut": "",
            "Hours": 0,
            "Comment": ""
        }
    }

    mounted() {
        let daysToPull = 10;
        for (let i = 0; i < daysToPull; i++) {
            TimeTrackerService.getTimeEntriesForDate('2018-01-09').then(response => {
                this.timeEntries.push(response.data);
            }).catch(error => {
                console.log(error.Message);
                debugger;
            });
        }
    }

}