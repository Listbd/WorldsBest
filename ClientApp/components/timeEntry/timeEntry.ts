import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Project } from '../shared/interfaces/project';
import { ProjectTask } from '../shared/interfaces/projectTask';
import { TimeEntry } from '../shared/interfaces/timeEntry';
//import * as toastr from 'toastr';
import * as moment from 'moment';
import { TimeTrackerService } from '../shared/timeTrackerService';

export interface DayEntry {
    title: string,
    timeEntries: TimeEntry[]
}

@Component
export default class TimeEntryComponent extends Vue {
    @Prop()
    id: string; // always comes as string anyway, haven't figure out how to get it as a number

    dayEntries: DayEntry[] = [];
    blankTimeEntry: TimeEntry

    projectOptions: Project[] = [];

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
        // Get list of projects
        TimeTrackerService.getProjects().then(response => {
            this.projectOptions = response.data;
        }).catch(error => {
            debugger;
        });

        // Get time entries
        let daysToPull = 10;
        for (let i = 0; i < daysToPull; i++) {
            let dateFormatted = moment(Date.now()).subtract(i, 'days').format('YYYY-MM-DD');
            TimeTrackerService.getTimeEntriesForDate(dateFormatted).then(response => {
                debugger;
                let dayEntry = {
                    title: dateFormatted,
                    timeEntries: response.data
                }
                this.dayEntries.push(dayEntry);
            }).catch(error => {
                console.log(error.Message);
                debugger;
            });
        }
    }

    updateTasks(data: any) {
        alert(data.currentTarget.value);
        debugger;
    }

}