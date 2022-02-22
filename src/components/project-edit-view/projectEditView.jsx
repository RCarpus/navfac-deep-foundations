/**
 * @module ProjectEditView
 */

import React from "react";
import './projectEditView.css';
import axios from 'axios';
import LoadingAnimation from "../loading-animation/loadingAnimation";
import ProjectErrors from "../project-errors/projectErrors";

const API_URL = 'https://navfac-api.herokuapp.com/';


/**
 * @description ProjectEditView is the main interface where users edit the 
 * input parameters for their project and submit the project for analysis.
 * A project name must be stored in localStorage as "currentProject" along 
 * with the user's ID and token.
 */
export default class ProjectEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      project: undefined,
      names: [],
      showProjectInfo: false,
      useTwoWidthColumns: false,
      additionalSoilRows: 1,
      additionalWidthRows: 1,
      additionalDepthRows: 1,
      validation: undefined,
      showErrors: false,
    }
  }

  /**
   * Load the current project immediately. Redirects to home if this fails for
   * some reason.
   */
  componentDidMount() {
    this.loadCurrentProject();
    this.getProjectNames();
  }

  /**
   * Loads data for the current project from the server. The name of the 
   * current project must be saved as 'currentProject' in localStorage 
   * along with the user ID and token. If loading the project fails,
   * the user is redirected to the home screen.
   */
  loadCurrentProject() {
    const currentProject = localStorage.getItem('currentProject');
    const ID = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const headers = {
      headers: { Authorization: `Bearer ${token}` }
    };
    this.setState({ isLoading: true }, () => {
      axios.get(API_URL + `users/${ID}/projects/${currentProject}`, headers)
        .then(response => {
          const useTwoWidthColumns = response.data.FoundationDetails.PileType
            === "DRIVEN-SINGLE-H-PILE";
          this.setState({
            project: response.data,
            useTwoWidthColumns,
            isLoading: false,
          });
        })
        .catch(error => {
          console.error(error);
          window.alert(`Failed to load project. Returning home.`);
          this.setState({ isLoading: false });
          window.location.href = '/#/home';
        });
    })

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
        this.setState({ names });
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * Saves the project on the server. Because the user may have changed 
   * the project's name, it also saves the name of the project into 
   * localStorage from the return object in the API call.
   * The user is then routed to the AnalyzeView to see the 
   * results of their analysis.
   * @param {object} project a valid project object
   */
  saveProject(project) {
    const ID = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const projectName = localStorage.getItem('currentProject');
    const newProjectName = project.Meta.Name;
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    axios.put(API_URL + `users/${ID}/projects/${projectName}`, project, headers)
      .then(response => {
        localStorage.setItem('currentProject', newProjectName);
        window.location.href = "/#/analyze";
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * Adds a row to the soil profile table
   * @param {object} e event object
   */
  addSoilRow(e) {
    e.preventDefault();
    let current = this.state.additionalSoilRows;
    this.setState({ additionalSoilRows: current + 1 });
  }

  /**
  * Removes a row from the soil table
  * @param {object} e event object 
  */
  removeSoilRow(e) {
    e.preventDefault();
    let table = document.getElementById('soil-table');
    let tableBody = table.children[1];
    tableBody.removeChild(tableBody.lastChild);
  }

  /**
   * Adds a row to the width table
   * @param {object} e event object
   */
  addWidthRow(e) {
    e.preventDefault();
    let current = this.state.additionalWidthRows;
    this.setState({ additionalWidthRows: current + 1 });
  }

  /**
   * Removes a row from the width table
   * @param {object} e event object 
   */
  removeWidthRow(e) {
    e.preventDefault();
    let table = document.getElementById('width-table');
    let tableBody = table.children[1];
    tableBody.removeChild(tableBody.lastChild);
  }

  /**
   * Adds a row to the depth table
   * @param {object} e event object
   */
  addDepthRow(e) {
    e.preventDefault();
    let current = this.state.additionalDepthRows;
    this.setState({ additionalDepthRows: current + 1 });
  }

  /**
  * Removes a row from the soil table
  * @param {object} e event object 
  */
  removeDepthRow(e) {
    e.preventDefault();
    let table = document.getElementById('depth-table');
    let tableBody = table.children[1];
    tableBody.removeChild(tableBody.lastChild);
  }

  /**
   * Toggles the Project info content on or off. This content includes 
   * - Name
   * - Client
   * - Engineer
   * - Notes
   * @param {object} e event object
   */
  toggleProjectInfo(e) {
    e.preventDefault();
    const showProjectInfo = !this.state.showProjectInfo;
    this.setState({ showProjectInfo });
    let info = document.getElementById('edit__project-info');
    info.classList.toggle('hidden');
  }

  /**
   * Toggles the Error info on or off.
   * @param {object} e event object
   */
  toggleErrors(e) {
    e.preventDefault();
    const showErrors = !this.state.showErrors;
    this.setState({ showErrors });
    let errors = document.getElementById('project-errors');
    errors.classList.toggle('not-rendered');
  }

  /**
   * Extract all the data from the forms, validate the input data, and 
   * then, if the data passes all the validation checks, save the 
   * project and route the user to the analysis view.
   * @param {object} e event object
   */
  calculate(e) {
    e.preventDefault();
    const project = this.state.project;
    // collect all the info from the form
    // Start with the easy stuff
    const GroundwaterDepth = Number(document.getElementById('groundwater-depth').value)
      || project.SoilProfile.GroundwaterDepth;
    const IgnoredDepth = Number(document.getElementById('ignored-depth').value)
      || project.SoilProfile.IgnoredDepth;
    const Increment = Number(document.getElementById('sublayer-increment').value)
      || project.SoilProfile.Increment;
    const PileType = document.getElementById('pile-type').value;
    const Material = document.getElementById('material').value;
    const FS = Number(document.getElementById('FS').value)
      || project.FoundationDetails.FS;

    // Extract data from the SoilProfile table
    let LayerDepths = [];
    let LayerNames = [];
    let LayerUnitWeights = [];
    let LayerPhiOrCs = [];
    let LayerPhiOrCValues = [];
    let soilTable = document.getElementById('soil-table');
    // Start from row=1 because row=0 is the header row
    for (let row = 1; row < soilTable.rows.length; row++) {
      LayerDepths.push(soilTable.rows[row].cells[1].firstChild.value
        || soilTable.rows[row].cells[1].firstChild.placeholder);
      LayerNames.push(soilTable.rows[row].cells[2].firstChild.value
        || soilTable.rows[row].cells[2].firstChild.placeholder);
      LayerUnitWeights.push(soilTable.rows[row].cells[3].firstChild.value
        || soilTable.rows[row].cells[3].firstChild.placeholder);
      LayerPhiOrCs.push(soilTable.rows[row].cells[4].firstChild.value
        || soilTable.rows[row].cells[4].firstChild.placeholder);
      LayerPhiOrCValues.push(soilTable.rows[row].cells[5].firstChild.value
        || soilTable.rows[row].cells[5].firstChild.placeholder);
    }

    // Extract data from widths table
    let Widths = [];
    let widthTable = document.getElementById('width-table');
    for (let row = 1; row < widthTable.rows.length; row++) {
      let width1 = widthTable.rows[row].cells[0].firstChild.value
        || widthTable.rows[row].cells[0].firstChild.placeholder;
      let width2;
      if (widthTable.rows[row].cells[1]) {
        width2 = widthTable.rows[row].cells[1].firstChild.value
          || widthTable.rows[row].cells[1].firstChild.placeholder;
      }
      if (width2) {
        Widths.push([width1, width2]);
      } else {
        Widths.push([width1]);
      }
    }

    // Extract data from the depths table
    let BearingDepths = [];
    let depthTable = document.getElementById('depth-table');
    for (let row = 1; row < depthTable.rows.length; row++) {
      BearingDepths.push(depthTable.rows[row].cells[0].firstChild.value
        || depthTable.rows[row].cells[0].firstChild.placeholder);
    }

    // Extract Project Info
    let Name = document.getElementById('project-info-name').value
      || project.Meta.Name;
    let Client = document.getElementById('project-info-client').value
      || project.Meta.Client;
    let Engineer = document.getElementById('project-info-engineer').value
      || project.Meta.Engineer;
    let Notes = document.getElementById('project-info-notes').value
      || project.Meta.Notes;

    // Aggregate form data into a new updatedProject object
    let updatedProject = {
      SoilProfile: {
        GroundwaterDepth,
        IgnoredDepth,
        Increment,
        LayerDepths,
        LayerNames,
        LayerUnitWeights,
        LayerPhiOrCs,
        LayerPhiOrCValues
      },
      FoundationDetails: {
        PileType,
        Material,
        FS,
        Widths,
        BearingDepths,
      },
      Meta: {
        Name,
        Client,
        Engineer,
        Notes,
      }
    }
    // Do various validation checks
    const validationResult = this.validateProjectInputs(updatedProject);

    // Set the result of validation into localStorage
    localStorage.setItem('validatedProject', JSON.stringify(validationResult));

    // notify the user if they have issues
    if (!validationResult) {
      window.alert('Analysis failed. Your input data has issues.');
      this.setState({ showErrors: true });
    } else {
      this.saveProject(validationResult);
    }
  }

  /**
   * Attempt to clean data and notify via state if any inputs are bad.
   * Return cleaned object if inputs are valid, return false otherwise
   * @param {object} project object containing all user-modifiable project data
   * @returns {object} cleaned project data or false.
   */
  validateProjectInputs(project) {
    let validation = {
      SoilProfile: {},
      FoundationDetails: {},
      Meta: {},
    };
    const nonzeroNum = /^[0-9]*\.?[0-9]*$/;
    const increment = project.SoilProfile.Increment;

    /* GroundwaterDepth must be a non-negative number */
    validation.SoilProfile.GroundwaterDepth = nonzeroNum.test(
      project.SoilProfile.GroundwaterDepth)
      && project.SoilProfile.GroundwaterDepth % increment === 0;

    /* IgnoredDepth must be a non-negative number */
    validation.SoilProfile.IgnoredDepth = nonzeroNum.test(
      project.SoilProfile.IgnoredDepth)
      && project.SoilProfile.IgnoredDepth % increment === 0;

    /* Increment must be a positive number */
    validation.SoilProfile.Increment = nonzeroNum.test(
      project.SoilProfile.Increment)
      && project.SoilProfile.Increment > 0;

    /* PileType must have a selection (ie: not "required") */
    validation.FoundationDetails.PileType = project.FoundationDetails.PileType
      !== "required";

    /* Material must have a selection (ie: not "required") */
    validation.FoundationDetails.Material = project.FoundationDetails.Material
      !== "required";

    /* FS must be a positive number */
    validation.FoundationDetails.FS = nonzeroNum.test(
      project.FoundationDetails.FS)
      && project.FoundationDetails.FS > 0;

    /* Name must be a non-null string with no trailing white space.
    We can cut the white space here for the user.
    Also, the name must either be the current project name or a unique name */
    let Name = project.Meta.Name.trim();
    validation.Meta.Name = Name.length > 0
      && (this.state.names.indexOf(Name) === -1
        || Name === this.state.project.Meta.Name);

    /* The Client, Engineer, and Notes fields have no rules */
    validation.Meta.Client = true;
    validation.Meta.Engineer = true;
    validation.Meta.Notes = true;

    /* SoilProfile cleaning 
      Removes any unfinished layers and then makes sure each layer is good.*/
    let cleanLayerDepths = project.SoilProfile.LayerDepths;
    let cleanLayerNames = project.SoilProfile.LayerNames;
    let cleanLayerUnitWeights = project.SoilProfile.LayerUnitWeights;
    let cleanLayerPhiOrCs = project.SoilProfile.LayerPhiOrCs;
    let cleanLayerPhiOrCValues = project.SoilProfile.LayerPhiOrCValues;
    let start = cleanLayerDepths.length - 1;
    // iterate backwards through the arrays so we can remove by index without
    // messing anything up.
    for (let i = start; i >= 0; i--) {
      if (cleanLayerDepths[i] === '---'
        || cleanLayerNames[i] === '---'
        || cleanLayerUnitWeights[i] === '---'
        || cleanLayerPhiOrCs[i] === '---'
        || cleanLayerPhiOrCValues[i] === '---') {
        cleanLayerDepths.splice(i, 1);
        cleanLayerNames.splice(i, 1);
        cleanLayerUnitWeights.splice(i, 1);
        cleanLayerPhiOrCs.splice(i, 1);
        cleanLayerPhiOrCValues.splice(i, 1);
      }
    }
    // After removing incomplete layers, each remaining layer must be correct
    // Bottom Depth
    let validDepths = cleanLayerDepths.every(function (depth, index) {
      if (nonzeroNum.test(depth) && index === 0
        && depth % increment === 0) return true;
      if (nonzeroNum.test(depth)
        && Number(depth) > Number(cleanLayerDepths[index - 1])
        && depth % increment === 0) return true;
      return false;
    });

    // We need to have at least one valid soil layer
    if (validDepths) {
      validDepths = cleanLayerDepths.length > 0;
    }
    validation.SoilProfile.LayerDepths = validDepths;

    // Cast depths as numbers
    let maxDepth;
    if (validDepths) {
      cleanLayerDepths = cleanLayerDepths.map(depth => {
        return Number(depth);
      });
      maxDepth = cleanLayerDepths[cleanLayerDepths.length - 1];
    }

    // Layer Names
    const validLayerNames = cleanLayerNames.every(name => {
      return name.length > 0 ? true : false;
    });
    validation.SoilProfile.LayerNames = validLayerNames;

    // Unit Weights
    const validUnitWeights = cleanLayerUnitWeights.every(weight => {
      return nonzeroNum.test(weight) && Number(weight) > 0;
    });
    validation.SoilProfile.LayerUnitWeights = validUnitWeights;
    // cast the weights as numbers
    if (validUnitWeights) {
      cleanLayerUnitWeights = cleanLayerUnitWeights.map(weight => {
        return Number(weight);
      });
    }

    // C or Phi
    const validCorPhis = cleanLayerPhiOrCs.every(value => {
      return value === 'C' || value === 'Φ';
    });
    validation.SoilProfile.LayerPhiOrCs = validCorPhis;
    // Change the phi character to the string expected by the server
    if (validCorPhis) {
      cleanLayerPhiOrCs = cleanLayerPhiOrCs.map(value => {
        if (value === 'Φ') {
          return 'PHI';
        } else {
          return value;
        }
      })
    }

    // C or Phi value
    const validCorPhiValues = cleanLayerPhiOrCValues.every(function (value, index) {
      if (cleanLayerPhiOrCs[index] === 'PHI'
        && value >= 26 && value <= 40
        && Number.isInteger(Number(value))
        && nonzeroNum.test(value)) {
        return true;
      } else if (cleanLayerPhiOrCs[index] === 'C'
        && nonzeroNum.test(value)) return true;
      return false;
    });
    validation.SoilProfile.LayerPhiOrCValues = validCorPhiValues;
    if (validCorPhiValues) {
      cleanLayerPhiOrCValues = cleanLayerPhiOrCValues.map(value => {
        return Number(value);
      })
    }

    /* Bearing depths cleaning */
    let cleanBearingDepths = project.FoundationDetails.BearingDepths;
    start = cleanBearingDepths.length - 1;
    for (let i = start; i >= 0; i--) {
      if (cleanBearingDepths[i] === '---') {
        cleanBearingDepths.splice(i, 1);
      }
    }
    let validBearingDepths = cleanBearingDepths.every(depth => {
      return nonzeroNum.test(depth)
        && depth % increment === 0
        && depth < maxDepth
        ? true : false;
    });

    // We need at least one valid depth
    if (validBearingDepths) {
      validBearingDepths = cleanBearingDepths.length > 0;
    }

    validation.FoundationDetails.BearingDepths = validBearingDepths;
    if (validBearingDepths) {
      cleanBearingDepths = cleanBearingDepths.map(depth => {
        return Number(depth);
      })
    }

    /* Widths cleaning */
    let cleanWidths = project.FoundationDetails.Widths;
    start = cleanWidths.length - 1;
    for (let i = start; i >= 0; i--) {
      let blankWidth = cleanWidths[i].indexOf('---') > -1;
      if (blankWidth) {
        cleanWidths.splice(i, 1);
      }
    }
    let validWidths = cleanWidths.every(width => {
      return width.every(subWidth => {
        return nonzeroNum.test(subWidth);
      });
    });

    // We need at least one valid width
    if (validWidths) {
      validWidths = cleanWidths.length > 0;
    }

    validation.FoundationDetails.Widths = validWidths;
    if (validWidths) {
      cleanWidths = cleanWidths.map(width => {
        return width.map(subWidth => {
          return Number(subWidth);
        });
      });
    }

    // The validation is done, so we can update state to render and warnings.
    this.setState({ validation });

    // If ANY of these validations failed, we need to return false.
    let keys = Object.keys(validation);
    let validationSuccess = true;
    keys.forEach(key => {
      let subkeys = Object.keys(validation[key]);
      subkeys.forEach(subkey => {
        if (!validation[key][subkey]) validationSuccess = false;
      });
    });
    if (!validationSuccess) return false;

    // This is the object that will be sent to the server if valid
    const validatedProject = {
      SoilProfile: {
        GroundwaterDepth: project.SoilProfile.GroundwaterDepth,
        IgnoredDepth: project.SoilProfile.IgnoredDepth,
        Increment: project.SoilProfile.Increment,
        LayerDepths: cleanLayerDepths,
        LayerNames: cleanLayerNames,
        LayerUnitWeights: cleanLayerUnitWeights,
        LayerPhiOrCs: cleanLayerPhiOrCs,
        LayerPhiOrCValues: cleanLayerPhiOrCValues,
      },
      FoundationDetails: {
        PileType: project.FoundationDetails.PileType,
        Material: project.FoundationDetails.Material,
        FS: project.FoundationDetails.FS,
        Widths: cleanWidths,
        BearingDepths: cleanBearingDepths,
      },
      Meta: {
        Name,
        Client: project.Meta.Client,
        Engineer: project.Meta.Engineer,
        Notes: project.Meta.Notes,
      }
    }

    return validatedProject;
  }

  /**
   * When the user changes the pile type with the dropdown selector, 
   * determines whether two columns should be displayed for the 
   * width selections.
   */
  handleChangePileType() {
    let pileType = document.getElementById('pile-type').value;
    const useTwoWidthColumns = pileType === 'DRIVEN-SINGLE-H-PILE';
    this.setState({ useTwoWidthColumns });
  }

  render() {
    const { project,
      showProjectInfo,
      additionalSoilRows,
      additionalWidthRows,
      additionalDepthRows,
      useTwoWidthColumns,
      isLoading,
      validation,
      showErrors } = this.state;

    let soilProfileRows = [];
    let blankSoilRows = [];
    let widthRows = [];
    let blankWidthRows = [];
    let depthRows = [];
    let blankDepthRows = [];

    let layerNo = 1;
    let widthNo = 1;
    let depthNo = 1;
    if (project) {

      // Generate table rows for the soil profile
      for (let i = 0; i < project.SoilProfile.LayerDepths.length; i++) {
        let phiOrC = project.SoilProfile.LayerPhiOrCs[i] === 'PHI' ? 'Φ' : 'C';
        soilProfileRows.push(
          <tr key={`row:${layerNo}`}>
            <td className="soil-table-row-count">{layerNo}</td>
            <td><input placeholder={project.SoilProfile.LayerDepths[i]} /></td>
            <td><input placeholder={project.SoilProfile.LayerNames[i]} /></td>
            <td><input placeholder={project.SoilProfile.LayerUnitWeights[i]} /></td>
            <td>
              <select name="phi-or-c" >
                <option value={phiOrC}>{phiOrC}</option>
                <option value="Φ">Φ</option>
                <option value="C">C</option>
              </select>
            </td>
            <td><input placeholder={project.SoilProfile.LayerPhiOrCValues[i]} /></td>
          </tr>
        );
        layerNo++;
      }

      // Generate additional rows beyond those originally included
      for (let i = 0; i < additionalSoilRows; i++) {
        blankSoilRows.push(
          <tr key={`row:${layerNo}`}>
            <td className="soil-table-row-count">{layerNo}</td>
            <td><input placeholder='---' /></td>
            <td><input placeholder='---' /></td>
            <td><input placeholder='---' /></td>
            <td>
              <select name="phi-or-c" >
                <option value="---">---</option>
                <option value="Φ">Φ</option>
                <option value="C">C</option>
              </select>
            </td>
            <td><input placeholder='---' /></td>
          </tr>
        )
        layerNo++;
      }

      // Generate table rows for the width selections
      for (let i = 0; i < project.FoundationDetails.Widths.length; i++) {
        widthRows.push(
          <tr key={`row:${widthNo}`}>
            <td><input placeholder={project.FoundationDetails.Widths[i][0]} /></td>
            {useTwoWidthColumns &&
              <td><input placeholder={project.FoundationDetails.Widths[i][1]} /></td>
            }
          </tr>
        );
        widthNo++;
      };


      // Generate additional table rows beyond those originally included
      for (let i = 0; i < additionalWidthRows; i++) {
        blankWidthRows.push(
          <tr key={`row:${widthNo}`}>
            <td><input placeholder="---" /></td>
            {useTwoWidthColumns &&
              <td><input placeholder="---" /></td>
            }

          </tr>
        );
        widthNo++;
      }

      // Generate table rows for the width selections
      for (let i = 0; i < project.FoundationDetails.BearingDepths.length; i++) {
        depthRows.push(
          <tr key={`row:${depthNo}`}>
            <td><input placeholder={project.FoundationDetails.BearingDepths[i]} /></td>
          </tr>
        );
        depthNo++;
      };

      // Generate additional table rows beyond those originally included
      for (let i = 0; i < additionalDepthRows; i++) {
        blankDepthRows.push(
          <tr key={`row:${depthNo}`}>
            <td><input placeholder="---" /></td>
          </tr>
        );
        depthNo++;
      }
    }


    if (project) return (
      <div className="edit">
        {isLoading && <LoadingAnimation />}
        <form className="edit__form">

          <button onClick={(e) => this.toggleProjectInfo(e)}
            className="edit__project-info-btn">
            {showProjectInfo ? "Hide Project Info" : "Show Project Info"}
          </button>
          {validation &&
            <div>
              <button onClick={(e) => this.toggleErrors(e)}
                className="edit__project-info-btn">
                {showErrors ? "Hide errors" : "Show errors"}
              </button>
              {showErrors &&
                <div id="project-errors">
                  <ProjectErrors valid={validation}
                    toggleErrors={(e) => this.toggleErrors(e)} />
                </div>
              }

            </div>
          }

          <button onClick={(e) => this.calculate(e)} className="edit__analyze-btn">
            Calculate
          </button>
          <div className="edit__grid__container">
            <div className="edit__grid__item">
              <h2 className="edit__title">Soil Profile</h2>
              <p className="edit__subtitle">
                These inputs are independent of the individual piles to be analyzed.
              </p>

              {/* Groundwater Depth, Ignored Depth, Sublayer Increment */}
              <div className="edit__subgrid">
                <div className="edit__subgrid__item">
                  <label htmlFor="groundwater-depth">
                    Groundwater Depth (ft)
                  </label>
                  <input className="edit__subgrid__input" id="groundwater-depth"
                    placeholder={project.SoilProfile.GroundwaterDepth || 'required'} />
                  <p>
                    Input a high number if no groundwater is present.
                  </p>
                </div>
                <div className="edit__subgrid__item">
                  <label htmlFor="ignored-depth">Ignored Depth (ft)</label>
                  <input className="edit__subgrid__input" id="ignored-depth"
                    placeholder={project.SoilProfile.IgnoredDepth || 'required'} />
                  <p>
                    Soil within this depth from the ground surface will be ignored
                    in skin friction calculations
                  </p>
                </div>
                <div className="edit__subgrid__item">
                  <label htmlFor="sublayer-increment">Sublayer Increment (ft)</label>
                  <select name="sublayer-increment" id="sublayer-increment" >
                    <option value={project.SoilProfile.Increment || 1}>{project.SoilProfile.Increment || 1}</option>
                    <option value="1">1</option>
                    <option value="0.5">0.5</option>
                  </select>
                  <p>
                    Soil profile will be divided up into small sublayers with
                    this thickness.
                  </p>
                </div>
              </div>

              {/* Soil layer details */}
              <table id="soil-table">
                <thead>
                  <tr>
                    <th>Layer No.</th>
                    <th className="soil-table__narrow">Bottom Depth (ft)</th>
                    <th className="soil-table__wide">Name</th>
                    <th className="soil-table__narrow">Unit Weight (pcf)</th>
                    <th className="soil-table__narrow">C/Φ</th>
                    <th className="soil-table__wide">C/Φ value (deg or psf)</th>
                  </tr>
                </thead>
                <tbody>
                  {soilProfileRows}
                  {blankSoilRows}
                </tbody>
              </table>
              <button className="project-edit-btn"
                onClick={(e) => this.addSoilRow(e)}>Add Row</button>
              <button className="project-edit-btn"
                onClick={(e) => this.removeSoilRow(e)}>Remove</button>
            </div>

            <div className="edit__grid__item" id="foundation-details">
              <h2 className="edit__title">Foundation Details</h2>
              <p className="edit__subtitle">These inputs affect the soil properties and capacity calculations</p>

              {/* Pile Type, Material, Factor of Safety */}
              <div className="foundation-details-line">
                <label className="foundation-details-label" htmlFor="pile-type">Pile Type</label>
                <select name="pile-type" id="pile-type" onChange={() => this.handleChangePileType()}>
                  <option value={project.FoundationDetails.PileType || 'required'}>{project.FoundationDetails.PileType || 'required'}</option>
                  <option value="DRIVEN-SINGLE-H-PILE">DRIVEN-SINGLE-H-PILE</option>
                  <option value="DRIVEN-SINGLE-DISPLACEMENT-PILE">DRIVEN-SINGLE-DISPLACEMENT-PILE</option>
                  <option value="DRIVEN-SINGLE-DISPLACEMENT-TAPERED-PILE">DRIVEN-SINGLE-DISPLACEMENT-TAPERED-PILE</option>
                  <option value="DRIVEN-JETTED-PILE">DRIVEN-JETTED-PILE</option>
                  <option value="DRILLED-PILE">DRILLED-PILE</option>
                </select>
              </div>
              <div className="foundation-details-line">
                <label className="foundation-details-label" htmlFor="material">Material</label>
                <select name="material" id="material">
                  <option value={project.FoundationDetails.Material || 'required'}>{project.FoundationDetails.Material || 'required'}</option>
                  <option value="CONCRETE">CONCRETE</option>
                  <option value="STEEL">STEEL</option>
                  <option value="TIMBER">TIMBER</option>
                </select>
              </div>
              <div className="foundation-details-line">
                <label className="foundation-details-label" htmlFor="FS">Factor of Safety</label>
                <input id="FS" placeholder={project.FoundationDetails.FS || 'required'} />
              </div>

              {/* Nested grid for width and depth tables */}
              <div className="edit__subgrid">
                {/* Widths */}
                <div className="edit__widths">
                  <table id="width-table" className="foundation-table">
                    <thead>
                      <tr>
                        <th>Widths (ft)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {widthRows}
                      {blankWidthRows}
                    </tbody>
                  </table>
                  <button className="project-edit-btn"
                    onClick={(e) => this.addWidthRow(e)}>Add</button>
                  <button className="project-edit-btn"
                    onClick={(e) => this.removeWidthRow(e)}>Remove</button>
                </div>

                {/* Depths */}
                <div className="edit__depths">
                  <table id="depth-table" className="foundation-table">
                    <thead>
                      <tr>
                        <th>Bearing Depths (ft)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {depthRows}
                      {blankDepthRows}
                    </tbody>
                  </table>
                  <button className="project-edit-btn"
                    onClick={(e) => this.addDepthRow(e)}>Add</button>
                  <button className="project-edit-btn"
                    onClick={(e) => this.removeDepthRow(e)}>Remove</button>
                </div>

              </div>
            </div>
          </div>


          {/* Project Info */}
          <div id="edit__project-info" className="hidden">
            <button id="project-info-close-btn" onClick={(e) => this.toggleProjectInfo(e)}>close</button>
            <h2 className="edit__title">Project Info</h2>
            <div className="project-info-line">
              <label className="project-info-label">Project Name/Number</label>
              <input id="project-info-name" placeholder={project.Meta.Name} />
            </div>
            <div className="project-info-line">
              <label className="project-info-label">Client</label>
              <input id="project-info-client" placeholder={project.Meta.Client} />
            </div>
            <div className="project-info-line">
              <label className="project-info-label">Engineer</label>
              <input id="project-info-engineer" placeholder={project.Meta.Engineer} />
            </div>
            <div className="project-info-line">
              <label className="project-info-label">Notes</label>
              <textarea id="project-info-notes" placeholder={project.Meta.Notes} />
            </div>
          </div>
        </form>

      </div>
    )
    return null;
  }
}