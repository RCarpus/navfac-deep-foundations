/**
 * @module AnalysisHeader
 */

import React from "react";
import './analysisHeader.css';

/**
 * Displays the project name, client, engineer, and date calculated at the 
 * top of the AnalysisView.
 * @param {string} name The project name
 * @param {string} client The project client
 * @param {string} engineer The project engineer 
 */
export default function AnalysisHeader(props) {
    let {name, client, engineer} = props;
    return (
      <div className="analysis-header">
        <h1 className="analysis-header-title">NAVFAC Deep Foundation Axial Analysis</h1>
        <table className="analysis-header-table">
          <tbody>
            <tr>
              <td className="analysis-header-label">Project Name:</td>
              <td>{name}</td>
            </tr>
            <tr>
              <td className="analysis-header-label">Client:</td>
              <td>{client}</td>
            </tr>
            <tr>
              <td className="analysis-header-label">Engineer:</td>
              <td>{engineer}</td>
            </tr>
            <tr>
              <td className="analysis-header-label">Date Calculated:</td>
              <td>{new Date().toString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
}