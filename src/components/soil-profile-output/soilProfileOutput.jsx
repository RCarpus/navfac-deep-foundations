/**
 * @module SoilProfileOutput
 */

import React from "react";
import './soilProfileOutput.css';

/**
 * Display a table with detailed soil profile data for a completed analysis.
 * @param {object} data The analysis object sent as a prop from AnalysisView.
 */
export default class SoilProfileOutput extends React.Component {
  render() {
    const { data } = this.props;
    const tableRows = data.detailedSoilProfile.layerPhis.map((layer, index) => {
      return (
        <tr>
          <td>{index + 1}</td>
          <td>{data.detailedSoilProfile.layerBottomDepths[index]}</td>
          <td>{data.detailedSoilProfile.layerNames[index]}</td>
          <td>{data.detailedSoilProfile.layerUnitWeights[index]}</td>
          <td>{data.detailedSoilProfile.layerCohesions[index]}</td>
          <td>{data.detailedSoilProfile.layerPhis[index]}</td>
          <td>{Math.round(data.detailedSoilProfile.layerEffStressMids[index])}</td>
          <td>{Math.round(data.detailedSoilProfile.layerEffStressBottoms[index])}</td>
        </tr>
      )
    })
    return (
      <div className="soil-profile-output">
        <h2>Summary of Soil Properties</h2>
        <div className="soil-profile-grid">
          <div className="soil-profile-subgrid">
            <p>Groundwater Depth (ft):</p>
            <p>{data.generalSoilProfile.groundwaterDepth}</p>
          </div>
          <div className="soil-profile-subgrid">
            <p>Ignored Depth (ft):</p>
            <p>{data.ignoredDepth}</p>
          </div>
          <div className="soil-profile-subgrid">
            <p>Sublayer Thickness (ft):</p>
            <p>{data.increment}</p>
          </div>

        </div>
        <table className="soil-profile-table">
          <thead>
            <tr>
              <th>Layer No.</th>
              <th>Bottom Depth (ft)</th>
              <th>Name</th>
              <th>Unit Weight (pcf)</th>
              <th>C (psf)</th>
              <th>Φ (deg)</th>
              <th>Eff. Stress at Mid.</th>
              <th>Eff. Stress at Bot.</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
        <div className="pagebreak"></div>
      </div>
    )
  }
}