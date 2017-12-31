import axios from 'axios';
import { Project } from '../shared/interfaces/project';

// TODO - this feels like a poor man's service implementation

export abstract class TimeTrackerService {
    //static url: string = 'https://b-timeback.azurewebsites.net/api/';
    static apiUrl: string = 'http://localhost:57214/api/';

    static getProjects() {
        let auth = btoa(`test:test`);
        let headers = { 'Authorization': 'Basic ' + auth };
        let url = TimeTrackerService.apiUrl + 'projects';
        let result: Project[] = [];
        return axios.get(url, { headers: headers });
    }

    static addProject(project: Project) {
        let auth = btoa(`test:test`);
        let headers = { 'Authorization': 'Basic ' + auth };
        let url = TimeTrackerService.apiUrl + "projects?format=json&callId=" + TimeTrackerService.generateGuid();
        return axios.post(url, project, { headers: headers });
    }

    static deleteProject(projectId: number) {
        let url = `${TimeTrackerService.apiUrl}projects/${projectId}?format=json&callId=${TimeTrackerService.generateGuid()}`;
        let auth = btoa(`test:test`);
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