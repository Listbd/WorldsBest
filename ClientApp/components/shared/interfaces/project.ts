import { ProjectTask } from './projectTask';
import { ProjectRole } from "./projectRole";

export interface Project {
    ProjectId: number;
    Name: string;
    ExternalSystemKey: string;
    ProjectTasks: ProjectTask[];
    ProjectRoles: ProjectRole[];
}
