import React from "react";
import './analysisHeader.css';

export default class AnalysisHeader extends React.Component {
  render() {
    let {name, client, engineer} = this.props;
    return (
      <div>
        <h1>NAVFAC Deep Foundation Axial Analysis</h1>
        <table>
          <tbody>
            <tr>
              <td>Project Name:</td>
              <td>{name}</td>
            </tr>
            <tr>
              <td>Client:</td>
              <td>{client}</td>
            </tr>
            <tr>
              <td>Engineer:</td>
              <td>{engineer}</td>
            </tr>
            <tr>
              <td>Date Calculated:</td>
              <td>{new Date().toString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    )
  }
}