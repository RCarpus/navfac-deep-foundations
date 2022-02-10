/**
 * @module ProjectEditView
 */

import React from "react";
import './projectEditView.css';
import axios from 'axios';

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
      project: undefined,
      showProjectInfo: false,
      useTwoWidthColumns: false,
      additionalSoilRows: 1,
      additionalWidthRows: 1,
      additionalDepthRows: 1,
    }
  }

  /**
   * Load the current project immediately. Redirects to home if this fails for
   * some reason.
   */
  componentDidMount() {
    this.loadCurrentProject();
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
    axios.get(API_URL + `users/${ID}/projects/${currentProject}`, headers)
      .then(response => {
        console.log(response.data);
        const useTwoWidthColumns = response.data.FoundationDetails.PileType
          === "DRIVEN-SINGLE-H-PILE";
        this.setState({ project: response.data, useTwoWidthColumns });
      })
      .catch(error => {
        console.error(error);
        window.alert(`Failed to load project. Returning home.`);
        window.location.href = '/home';
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
   * Adds a row to the width table
   * @param {object} e event object
   */
  addWidthRow(e) {
    e.preventDefault();
    let current = this.state.additionalWidthRows;
    this.setState({ additionalWidthRows: current + 1 });
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

  /** TODO
   * Perform calculation sweet and generate a pdf.
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
    let LayerPhisOrCs = [];
    let LayerPhiOrCValues = [];
    let soilTable = document.getElementById('soil-table');
    for (let row = 1; row < soilTable.rows.length; row++) {
      LayerDepths.push(soilTable.rows[row].cells[1].firstChild.value
        || soilTable.rows[row].cells[1].firstChild.placeholder);
      LayerNames.push(soilTable.rows[row].cells[2].firstChild.value
        || soilTable.rows[row].cells[2].firstChild.placeholder);
      LayerUnitWeights.push(soilTable.rows[row].cells[3].firstChild.value
        || soilTable.rows[row].cells[3].firstChild.placeholder);
      LayerPhisOrCs.push(soilTable.rows[row].cells[4].firstChild.value
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
        LayerPhisOrCs,
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
    console.log(updatedProject);
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
      useTwoWidthColumns } = this.state;
    console.log(project);



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

        <form className="edit__form">

          <button onClick={(e) => this.toggleProjectInfo(e)}
            className="edit__project-info-btn">
            {showProjectInfo ? "Hide Project Info" : "Show Project Info"}
          </button>
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
                    Leave blank or input a high number of no groundwater is present.
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
                  <input className="edit__subgrid__input" id="sublayer-increment"
                    placeholder={project.SoilProfile.Increment || 'required'} />
                  <p>
                    Soil profile will be divided up into small sublayers with
                    this thickness. It is recommended to use 0.5 or 1.0.
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
              <button onClick={(e) => this.addSoilRow(e)}>Add Row</button>
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
                  <button onClick={(e) => this.addWidthRow(e)}>Add</button>
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
                  <button onClick={(e) => this.addDepthRow(e)}>Add</button>
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