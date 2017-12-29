import { Project } from '../shared/interfaces/project';

// TODO - this feels like a poor man's service implementation

export abstract class TimeTrackerService {
    //static url: string = 'https://b-timeback.azurewebsites.net/api/';
    static url: string = 'http://localhost:57214/api/';

    static fetchProjects = () => {
        let headers = { 'Authorization': 'Basic ' + btoa(`test:test`) };
        let f = fetch(TimeTrackerService.url, { headers: headers })
            .then(response => response.json() as Promise<Project[]>)
            .then(data => {
                return data;
            }).catch(error => {
                // TODO
            });
        if (f instanceof Array) return f;
        else return [];
    }

    static s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    static generateGuid = () => {
        return TimeTrackerService.s4() + TimeTrackerService.s4() + '-' + TimeTrackerService.s4() + '-' + TimeTrackerService.s4() + '-' +
            TimeTrackerService.s4() + '-' + TimeTrackerService.s4() + TimeTrackerService.s4() + TimeTrackerService.s4();
    }
}