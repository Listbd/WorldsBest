import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Project } from '../shared/interfaces/project';
import { ProjectTask } from '../shared/interfaces/projectTask';
import { TimeEntry } from '../shared/interfaces/timeEntry';
//import * as toastr from 'toastr';
import * as moment from 'moment';
import { TimeTrackerService } from '../shared/timeTrackerService';

export interface DayEntry {
    dateDisplay: string,
    timeEntries: TimeEntry[]
}

@Component
export default class TimeEntryComponent extends Vue {
    @Prop()
    id: string; // always comes as string anyway, haven't figure out how to get it as a number

    dayEntries: DayEntry[] = [];
    blankTimeEntry: TimeEntry

    projectOptions: Project[] = [];
    taskOptions: ProjectTask[] = [];

    constructor() {
        super();

        this.initializeBlankTimeEntry();
    }

	initializeBlankTimeEntry(): void {

        this.blankTimeEntry = {
            ProjectRoleId: 0,
            ProjectTaskId: 0,
            Billable: true,
            TimeIn: "",
            TimeOut: "",
            Hours: 0,
            Comment: "",
            SelectedTask: null,
            SelectedProject: null
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
        // run all the promises and wait until they are all done before
        // checking to see if we have any dayEntries
        Promise.all<any>(timeEntryPromises).then(result => {
            if (this.dayEntries.length === 0) {
                // Nothing yet exists, so make the first group (today) manually
                let newEntry = {
                    dateDisplay: moment(Date.now()).format('YYYY-MM-DD'),
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
                        dateDisplay: dateToGet,
                        timeEntries: response.data
                    }
                    this.dayEntries.push(dayEntry);
                }
            });
    }

    updateTasks() {
        //alert((<Project>this.blankTimeEntry.SelectedProject).Name);
        //debugger;
        this.blankTimeEntry.SelectedTask = null;
        this.taskOptions = this.blankTimeEntry.SelectedProject!.ProjectTasks; // the ! means I accept the consequences if Project is undefined/null
        if (this.taskOptions.length === 1) {
            this.blankTimeEntry.SelectedTask = this.taskOptions[0];
            this.blankTimeEntry.ProjectTaskId = this.blankTimeEntry.SelectedTask.ProjectTaskId;
        }

        // If we don't have a role, let's add one called "Default".
        if (this.blankTimeEntry.SelectedProject!.ProjectRoles.length === 0) {
            var newDefaultRole = {
                ProjectRoleId: 0,
                Name: "Default",
                ProjectId: this.blankTimeEntry.SelectedProject!.ProjectId,
                ExternalSystemKey: ""
            }
            TimeTrackerService.postProjectRole(newDefaultRole).then(response => {
                let role = response.data;
                this.blankTimeEntry.SelectedProject!.ProjectRoles.push(role);
                // Set the role ID on our blank time entry entity
                this.blankTimeEntry.ProjectRoleId = role.ProjectRoleId;
            }).catch(error => {
                //common.reportError(error);
                return null;
            });
        }
        // Otherwise, let's hard-code the role to the first in the collection.
        else {
            this.blankTimeEntry.ProjectRoleId = this.blankTimeEntry.SelectedProject!.ProjectRoles[0].ProjectRoleId;
        }
    }

    startWork(dayEntryDisplay: string) {
        if (this.blankTimeEntry.TimeIn == undefined || this.blankTimeEntry.TimeIn.length == 0) {
            this.blankTimeEntry.TimeIn = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        }

        // Must be in a decent format for the api call
        this.blankTimeEntry.TimeIn = this.convertTimeEntryToDate(this.blankTimeEntry.TimeIn, dayEntryDisplay);
        if (this.blankTimeEntry.TimeOut !== undefined && this.blankTimeEntry.TimeOut !== null && this.blankTimeEntry.TimeOut.length > 0) {
            this.blankTimeEntry.TimeOut = this.convertTimeEntryToDate(this.blankTimeEntry.TimeOut, dayEntryDisplay);
        }

        if (this.blankTimeEntry.TimeIn == 'Invalid Date' || this.blankTimeEntry.TimeOut == 'Invalid Date') {
            //msgError("Entry not added. A date is invalid");
            return null;
        }

        this.blankTimeEntry.ProjectTaskId = this.blankTimeEntry.SelectedTask!.ProjectTaskId;
        return TimeTrackerService.postTimeEntry(this.blankTimeEntry)
            .then(response => {
                // todo - refresh day, reset blank timeentry
                //refreshDay(vm.blankTimeEntry.TimeIn);
                //resetBlankTimeEntry();
            }).catch(error => {
                //common.reportError(error);
                return null;
            });

    }


    convertTimeEntryToDate(dateTimeAsString: string, dayEntryDisplay: string): string {
        // it is more reliable to just compute the Date ourselves to avoid browser differences
        // (e.g. Chrome insists on converting the date to local time for us even though we create it in local time already)

        // try piecing it together
        // 1. count dashes
        var test = dateTimeAsString;

        var pieces = test.split(/[ T]/); // date and time split on space or T

        // is there a date part?
        var datepart = new Array();
        if (test.match(/[-\/T]/) != null) {
            datepart = pieces[0].split(/[\/-]/); // date could be dashes or slashes
            pieces.shift();
        }

        if (dayEntryDisplay !== undefined) {
            var dayEntryPieces = dayEntryDisplay.split("-");
            if (datepart.length == 0) {
                // get day and month from day entry
                datepart.push(dayEntryPieces[1]);
                datepart.push(dayEntryPieces[2]);
            }
            if (datepart.length == 2) {
                // assume we are missing the year, insert into front
                datepart.splice(0, 0, dayEntryPieces[0]);
            }
        }

        let timepart:string[] = [];
        if (pieces.length > 0) {
            timepart = pieces[0].split(":");
            // get this out of the way..
            if (pieces[pieces.length - 1].toUpperCase() == 'PM') {
                timepart[0] = String((Number(timepart[0]) + 12));
            }
        }
        while (timepart.length < 2) {
            timepart.push('0');
        }

        var testDate = (new Date(datepart[0], datepart[1] - 1, datepart[2], Number(timepart[0]), Number(timepart[1]))).toString();

        if (testDate == 'Invalid Date') {
            return testDate;
        }
        else {
            return moment(testDate).format("YYYY-MM-DDTHH:mm:ss");
        }
    }


}