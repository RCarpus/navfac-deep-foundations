/**
 * @module LoadProjectView
 */

import React from "react";
import './loadProjectView.css';
import axios from "axios";
import LoadingAnimation from "../loading-animation/loadingAnimation";

const API_URL = 'https://navfac-api.herokuapp.com/';

/**
 * @description LoadProjectView displays a table with the names and 
 * modified dates of the user's projects. They can select a project and 
 * click open to open the project, or they can select the delete button 
 * to delete a project. Opening a project redirects them to the 
 * ProjectEditView.
 */
export default class LoadProjectView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selectedProject: undefined,
      isLoading: false,
    }
  }

  /**
   * Download the user's projects
   */
  componentDidMount() {
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
   * Deletes a project by name. Before deleting, uses a window confirm to 
   * prevent accidental deletions. The return object from the server 
   * set to the state. This removes the project from the list.
   * @param {string} name name of projec to be deleted
   * @returns null
   */
  deleteProject(name) {
    const confirmed = window.confirm(`Are you you want to delete "${name}"?
    This cannot be undone.`);
    if (!confirmed) return;
    const ID = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    axios.delete(API_URL + `users/${ID}/projects/${name}`, headers)
      .then(response => {
        if (name === localStorage.getItem('currentProject')) {
          localStorage.removeItem('currentProject');
        }
        this.setState({ projects: response.data });
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * Opens the selected project.
   * This is done by saving the current project name in localStorage, 
   * then redirecting to the project page.
   */
  openProject() {
    const name = this.state.selectedProject;
    if (name) {
      localStorage.setItem('currentProject', name);
      window.location.href = '/#/edit-project';
    }
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
          <td>
            <button className="delete-btn"
              onClick={() => this.deleteProject(project.Name)}>X</button>
          </td>
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
          onClick={() => this.openProject(selectedProject)}>
          Open
        </button>


      </div>
    )
  }
}