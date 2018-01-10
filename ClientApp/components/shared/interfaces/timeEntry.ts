import { Project } from '../../shared/interfaces/project';
import { ProjectTask } from '../../shared/interfaces/projectTask';

export interface TimeEntry {
    ProjectRoleId: number;
    ProjectTaskId: number;
    Billable: boolean;
    TimeIn: string;
    TimeOut: string;
    Hours: number;
    Comment: string;
    SelectedTask: ProjectTask | null; // this is stupid!!!! i should be able to make it null w/o the union
    SelectedProject: Project | null;
}