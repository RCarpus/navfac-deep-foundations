/**
 * @module NewProjectView
 */
import React from "react";
import './newProjectView.css';
import axios from "axios";
import LoadingAnimation from "../loading-animation/loadingAnimation";

const API_URL = 'https://navfac-api.herokuapp.com/';


/**
 * @description NewProjectView allows the user to create a new project. 
 * The user enters basic project details into the form and submits it.
 * Then, the user is redirected to the home screen THIS NEEDS TO CHANGE 
 * AFTER PROJECT EDIT VIEW IS IMPLEMENTED.
 */
export default class NewProjectView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidForm: true,
      projectNameExists: false,
      names: [],
      isLoading: false,
    }
  }

  componentDidMount() {
    this.props.checkLoginStatus();
    this.getProjectNames();
  }

  /**
   * Download the names of the user's existing projects and save to state.
   * This is used to check the new project's name and make sure their 
   * are no duplicate names.
   */
  getProjectNames() {
    const ID = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    axios.get(API_URL + `users/${ID}/projects`, headers)
      .then(response => {
        let names = response.data.map(project => project.Name);
        console.log(names);
        this.setState({ names });
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * Extracts the data form the new project form, validates the form,
   * and then submits the new project to the server. The user is redirected 
   * to the home screen. THIS NEEDS TO CHANGE TO REDIRECT TO THE PROJECT 
   * EDIT SCREEN AFTER THAT SCREEN IS BUILT.
   * If the form is invalid, the project is not created.
   * @param {object} e event object
   */
  createNewProject(e) {
    e.preventDefault();
    // Extract data from form
    const Name = document.getElementById('new-project__form__name').value.trim();
    const Client = document.getElementById('new-project__form__client').value;
    const Engineer = document.getElementById('new-project__form__engineer').value;
    const Notes = document.getElementById('new-project__form__notes').value;
    const projectDetails = { Name, Client, Engineer, Notes };
    // validate the data and then send it to the server
    if (this.validateNewProject(projectDetails)) {
      const ID = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      this.setState({ isLoading: true }, () => {
        axios.post(API_URL + `users/${ID}/projects`, projectDetails, headers)
          .then(response => {
            this.setState({ isLoading: false });
            window.location.href = '/home'; // Change this later to edit project
          })
          .catch(error => {
            console.error(error);
            this.setState({ isLoading: false });
            window.alert('Error: Something went wrong trying to create a project.');
          });
      })


    }
  }

  /**
   * Checks the new project information to make sure it's valid.
   * First checks that the Name has been entered. That is the only required 
   * field. Second, Checks that the does not already have a project with the
   * same name. If the Name fails either of those tests, the state is 
   * updated to render an error message to the user.
   * @param {object} projectDetails object with the following {string} params:
   * - Name
   * - Client
   * - Engineer
   * - Notes
   * @returns {boolean} true if form is valid, otherwise false.
   */
  validateNewProject(projectDetails) {
    if (projectDetails.Name.length === 0) {
      this.setState({ isValidForm: false, projectNameExists: false });
      return false;
    }
    const names = this.state.names;
    const projectNameExists = names.find(name => name === projectDetails.Name);
    if (projectNameExists) {
      this.setState({ projectNameExists: true, isValidForm: true });
      return false;
    }
    return true;
  }

  render() {
    const { isValidForm, projectNameExists, isLoading } = this.state;
    return (
      <div className="new-project">
        {isLoading && <LoadingAnimation />}
        <h1 className="new-project__title">Create New Project</h1>
        <form className="new-project__form">
          <div className="new-project__form__line">
            <label>Project Name/Number</label>
            <input id="new-project__form__name" placeholder="required" />
          </div>
          <div className="new-project__form__line">
            <label>Client</label>
            <input id="new-project__form__client" />
          </div>
          <div className="new-project__form__line">
            <label>Engineer</label>
            <input id="new-project__form__engineer" />
          </div>
          <div className="new-project__form__line">
            <label>Notes</label>
            <textarea id="new-project__form__notes"
              rows="4" cols="50" />
          </div>
          <button id="create-project-btn"
            onClick={(e) => this.createNewProject(e)}>Create Project</button>
          {!isValidForm && <span className="create-project-error">
            Project Name/Number is required.
            </span>}
          {projectNameExists &&
            <span className="create-project-error">
              You cannot have two projects with the same name
              </span>
          }
        </form>
      </div>
    )
  }
}