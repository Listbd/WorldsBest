import axios from 'axios';
import { Project } from '../shared/interfaces/project';
import { ProjectTask } from '../shared/interfaces/projectTask';

// TODO - this feels like a poor man's service implementation

export abstract class TimeTrackerService {
    //static url: string = 'https://b-timeback.azurewebsites.net/api/';
    static apiUrl: string = 'http://localhost:57214/api/';

    static getProjects() {
        let auth = localStorage.getItem('hackauth2');
        let headers = { 'Authorization': 'Basic ' + auth };
        let url = TimeTrackerService.apiUrl + 'projects';
        return axios.get(url, { headers: headers });
    }

    static addProject(project: Project) {
        let auth = localStorage.getItem('hackauth2');
        let headers = { 'Authorization': 'Basic ' + auth };
        let url = TimeTrackerService.apiUrl + "projects?format=json&callId=" + TimeTrackerService.generateGuid();
        return axios.post(url, project, { headers: headers });
    }

    static deleteProject(projectId: number) {
        let url = `${TimeTrackerService.apiUrl}projects/${projectId}?format=json&callId=${TimeTrackerService.generateGuid()}`;
        let auth = localStorage.getItem('hackauth2');
        let headers = { 'Authorization': 'Basic ' + auth };
        return axios.delete(url, { headers: headers });
    }

    static getProject(id: number) {
        let auth = localStorage.getItem('hackauth2');
        let headers = { 'Authorization': 'Basic ' + auth };
        let url = TimeTrackerService.apiUrl + 'projects/' + id;
        return axios.get(url, { headers: headers });
    }

    static addProjectTask(projectTask: ProjectTask) {
        let auth = localStorage.getItem('hackauth2');
        let headers = { 'Authorization': 'Basic ' + auth };
        let url = TimeTrackerService.apiUrl + "projecttasks?format=json&callId=" + TimeTrackerService.generateGuid();
        return axios.post(url, projectTask, { headers: headers });
    }

    static deleteProjectTask(projectTaskId: number) {
        let url = `${TimeTrackerService.apiUrl}projecttasks/${projectTaskId}?format=json&callId=${TimeTrackerService.generateGuid()}`;
        let auth = localStorage.getItem('hackauth2');
        let headers = { 'Authorization': 'Basic ' + auth };
        return axios.delete(url, { headers: headers });
    }

    static s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    static generateGuid() {
        return TimeTrackerService.s4() + TimeTrackerService.s4() + '-' + TimeTrackerService.s4() + '-' + TimeTrackerService.s4() + '-' +
            TimeTrackerService.s4() + '-' + TimeTrackerService.s4() + TimeTrackerService.s4() + TimeTrackerService.s4();
    }
}