export interface ProjectTask {
    ProjectTaskId: number;
    ProjectId: number;
    Name: string;
    Billable: boolean;
    RequireComment: boolean;
    ExternalSystemKey: string;
}
