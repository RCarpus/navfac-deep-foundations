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

  /** TODO
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
  }

  /** TODO
   * Perform calculation sweet and generate a pdf.
   * @param {object} e event object
   */
  calculate(e) {
    e.preventDefault();
    window.alert('clicked calculate');
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
            <td><input placeholder={phiOrC} /></td>
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
            <td><input placeholder='---' /></td>
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
                <input placeholder={project.FoundationDetails.PileType || 'required'} />
              </div>
              <div className="foundation-details-line">
                <label className="foundation-details-label" htmlFor="material">Material</label>
                <input placeholder={project.FoundationDetails.Material || 'required'} />
              </div>
              <div className="foundation-details-line">
                <label className="foundation-details-label" htmlFor="FS">Factor of Safety</label>
                <input placeholder={project.FoundationDetails.FS || 'required'} />
              </div>

              {/* Nested grid for width and depth tables */}
              <div className="edit__subgrid">
                {/* Widths */}
                <div className="edit__widths">
                  <table className="foundation-table">
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
                  <table className="foundation-table">
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
        </form>

      </div>
    )
    return null;
  }
}