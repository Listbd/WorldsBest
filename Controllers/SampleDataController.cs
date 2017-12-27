using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Vue1.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet("[action]")]
        public IEnumerable<WeatherForecast> WeatherForecasts()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }

        [HttpGet("[action]")]
        public IEnumerable<Project> Projects()
        {
            var projectTask = new ProjectTask
            {
                ProjectTaskId = 1,
                Name = "Task 1",
                ProjectId = 1,
                Billable = true,
                RequireComment = true
            };
            var project1 = new Project
            {
                ProjectId = 1,
                Name = "Project 1"
            };
            project1.ProjectTasks = new List<ProjectTask>() { projectTask };

            var project2 = new Project
            {
                ProjectId = 2,
                Name = "Project 2"
            };
            project2.ProjectTasks = new List<ProjectTask>() { projectTask };

            var projects = new List<Project>();
            projects.Add(project1);
            projects.Add(project2);
            return projects;
        }

        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }

        public class Project
        {
            public int ProjectId { get; set; }
            public string Name { get; set; }
            public ICollection<ProjectTask> ProjectTasks { get; set; }
        }
        public class ProjectTask
        {
            public int ProjectTaskId { get; set; }
            public string Name { get; set; }
            public int ProjectId { get; set; }
            public bool Billable { get; set; }
            public bool RequireComment { get; set; }            
        }
    }
}
