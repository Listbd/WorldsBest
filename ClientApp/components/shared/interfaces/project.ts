import { ProjectTask } from './projectTask';

export interface Project {
    projectId: number;
    name: string;
    projectTasks: ProjectTask[];
}
