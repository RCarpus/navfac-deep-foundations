/**
 * @module CloneProjectView
 */

import React from "react";
import './cloneProjectView.css';
import axios from "axios";
import LoadingAnimation from "../loading-animation/loadingAnimation";

const API_URL = 'https://navfac-api.herokuapp.com/';

/**
 * @decription Similar to the LoadProjectView, but instead of opening a project,
 * make a copy. The copied project will be exactly the same but with 
 * a different unique name.
 */
export default class CloneProjectView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selectedProject: undefined,
      isLoading: false,
    };
  }

  /**
   * Make the the user is logged in and download their projects
   */
  componentDidMount() {
    this.props.checkLoginStatus();
    this.getProjects();
  }

  /**
    * Downloads the user's project names and modified dates.
    * Saves the response in state.
    * This is an array of objects:
    * [{
    *    "Name" : "My first project",
    *    "ModifiedDate": "2022-02-09T15:15:44.956+00:00"
    * }]
    */
  getProjects() {
    const ID = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    this.setState({ isLoading: true }, () => {
      axios.get(API_URL + `users/${ID}/projects`, headers)
        .then(response => {
          this.setState({
            projects: response.data,
            isLoading: false,
          });
        })
        .catch(error => {
          console.error(error);
          this.setState({
            isLoading: false,
          });
        });
    })
  }

  /**
   * Sets selectedProject in state to the name of the project 
   * and gives the table row for that project the active class.
   * @param {string} name name of the selected project
   */
  selectProject(name) {
    const tableRows = Array.from(document.querySelectorAll('tr.active'));
    tableRows.forEach(row => {
      row.classList.remove('active');
    });
    document.getElementById(name).classList.add('active');
    this.setState({ selectedProject: name });
  }

  /**
   * Clones the selected project.
   * This is done by creating a new project with the same Meta data, 
   * but with a modified name, then updating the project with the 
   * details of the cloned project. The user is then redirected to the 
   * edit view for the cloned project.
   */
  cloneProject() {
    const originalName = this.state.selectedProject;
    if (!originalName) return;

    // This will ensure we have a unique name
    const date = new Date().toString();
    const Name = 'copy of ' + originalName
      + ' ' + date.slice(0, 10)
      + ' ' + date.slice(16, 18) + date.slice(19, 21) + date.slice(22, 24);

    // Load the project to be cloned
    const ID = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };
    this.setState({ isLoading: true }, () => {
      axios.get(API_URL + `users/${ID}/projects/${originalName}`, headers)
        .then(getResponse => {
          // Create a new project using the loaded project's Meta data
          const newProjectDetails = {
            Name,
            Client: getResponse.data.Meta.Client,
            Engineer: getResponse.data.Meta.Engineer,
            Notes: getResponse.data.Meta.Notes,
          };
          axios.post(API_URL + `users/${ID}/projects`, newProjectDetails, headers)
            .then(postResponse => {
              // update the new project with the project to clone's info
              const projectDetails = {
                Meta: newProjectDetails,
                SoilProfile: getResponse.data.SoilProfile,
                FoundationDetails: getResponse.data.FoundationDetails,
              }
              axios.put(API_URL + `users/${ID}/projects/${Name}`, projectDetails, headers)
                .then(putResponse => {
                  localStorage.setItem('currentProject', Name);
                  window.location.href = '/#/edit-project';
                })
                .catch(error => {
                  console.error(error);
                });
            })
            .catch(error => {
              console.error(error);
              this.setState({ isLoading: false });
              window.alert('Error: Something went wrong.');
            })
        })
        .catch(error => {
          console.error(error);
          window.alert(`Failed to load project. Returning home.`);
          this.setState({ isLoading: false });
          window.location.href = '/#/home';
        });
    })

  }

  render() {
    const { projects, selectedProject, isLoading } = this.state;

    // Generate a table row for each project
    let tableRows = [];
    projects.forEach(project => {
      tableRows.push(
        <tr id={project.Name} key={project.Name}>
          <td><button className="project-name"
            onClick={() => this.selectProject(project.Name)}>
            {project.Name}
          </button>
          </td>
          <td>{project.ModifiedDate.slice(0, 10)}</td>
        </tr>
      );
    });
    return (
      <div className="load">
        {isLoading && <LoadingAnimation />}
        <h1 className="load__title">Load Project</h1>
        <table className="load__table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Date Modified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
        <button
          id="open-project-btn"
          onClick={() => this.cloneProject(selectedProject)}>
          Clone Project
        </button>


      </div>
    )
  }
}