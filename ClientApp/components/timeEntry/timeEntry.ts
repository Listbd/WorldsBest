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
        let timeEntryPromises: Promise<any>[] = [];
        let daysToPull = 10;
        for (let i = 0; i < daysToPull; i++) {
            let dateFormatted = moment(Date.now()).subtract(i, 'days').format('YYYY-MM-DD');
            timeEntryPromises.push(this.getTimeEntriesForDate(dateFormatted));
        }
        Promise.all<any>(timeEntryPromises).then(result => {
            if (this.dayEntries.length === 0) {
                // Nothing yet exists, so make the first group (today) manually
                let newEntry = {
                    title: moment(Date.now()).format('YYYY-MM-DD'),
                    timeEntries: []
                };
                this.dayEntries.push(newEntry);
            }
        });

    }

    getTimeEntriesForDate(dateToGet: string) {
        return TimeTrackerService.getTimeEntriesForDate(dateToGet)
            .then(response => {
                if (response.data.length > 0) {
                    let dayEntry = {
                        title: dateToGet,
                        timeEntries: response.data
                    }
                    this.dayEntries.push(dayEntry);
                }
            });
    }

    updateTasks(data: any) {
        alert(data.currentTarget.value);
        debugger;
    }

}