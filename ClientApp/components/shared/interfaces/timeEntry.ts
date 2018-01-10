export interface TimeEntry {
    ProjectRoleId: number;
    ProjectTaskId: number;
    Billable: boolean;
    TimeIn: string;
    TimeOut: string;
    Hours: number;
    Comment: string;
}