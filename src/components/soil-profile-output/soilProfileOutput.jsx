/**
 * @module SoilProfileOutput
 */

import React from "react";
import './soilProfileOutput';

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
          <td>{index+1}</td>
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
      <div>
        <h2>Summary of Soil Properties</h2>
        <div>
          <h3>Groundwater Depth (ft)</h3>
          <span>{data.generalSoilProfile.groundwaterDepth}</span>
        </div>
        <div>
          <h3>Ignored Depth (ft)</h3>
          <span>{data.ignoredDepth}</span>
        </div>
        <div>
          <h3>Sublayer Thickness (ft)</h3>
          <span>{data.increment}</span>
        </div>
        <table>
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
      </div>
    )
  }
}