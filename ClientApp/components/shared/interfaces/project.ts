import { ProjectTask } from './projectTask';

export interface Project {
    ProjectId: number;
    Name: string;
    ExternalSystemKey: string;
    ProjectTasks: ProjectTask[];
}
