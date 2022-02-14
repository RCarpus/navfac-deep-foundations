/**
 * @module SummaryCapacity
 */

import React from "react";
import './summaryCapacity.css';
import { poundsToKips } from "../../navfac/navfacFunctions";

/**
 * @description Displays two tables - one for capacity in compression, and 
 * one for capacity in tension, as a function of width and depth, and 
 * EITHER allowable or ultimate.
 * @param {boolean} isAllowable true for allowable capacity, false for ultimate
 * @param {Array.<object>} compression Array of compression pile objects with 
 * { width, bearingDepth, allowableCapacity }
 * @param {Array.<object>} tension Array of tension pile objects with 
 * { width, bearingDepth, allowableCapcity }
 * @param {Array.<number>} widths array of width arrays
 * @param {Array.<number>} depths array of depth values
 */
export default class SummaryCapacity extends React.Component {

  /**
   * Search through the piles to find the pile with a specified width, depth.
   * Converts the capacity to kips, rounded to 1 decimal.
   * @param {object} piles {width, bearingDepth, allowableCapacity}
   * @param {array} width could have 1 or two number values
   * @param {array} depth array of numbers
   * @returns the capacity (number) of the pile in kips.
   */
  getCapacity(piles, width, depth) {
    let pile = piles.find(pile => {
      if (pile.width.length === 1            // for circular foundations
        && pile.width[0] === width[0]
        && pile.bearingDepth === depth) {
        return true
      } else if (pile.width[0] === width[0]  // for rectangular foundations
        && pile.width[1] === width[1]
        && pile.bearingDepth === depth) {
        return true
      }
      else return false;
    });
    let capacity = pile.allowableCapacity;
    return poundsToKips(capacity).toFixed(1);

  }

  render() {
    const { isAllowable, compression, tension, widths, depths } = this.props;
    const capacityType = isAllowable ? 'Allowable' : 'Ultimate';

    // Build a compression table
    let compHeaderRow = [];
    compHeaderRow.push(
      <th scope="row">Embedment Depth (ft)</th>
    );
    for (let width = 0; width < widths.length; width++) {
      compHeaderRow.push(
        <th key={`width-${width}`}>{widths[width]}</th>
      )
    }

    let compRows = [];
    for (let row = 0; row < depths.length; row++) {
      let capacities = [];
      for (let col = 0; col < widths.length; col++) {
        capacities.push(
          <td className="summary-table-cell" key={`cap-${row}-${col}`}>
            {this.getCapacity(compression, widths[col], depths[row], isAllowable)}
          </td>
        );
      }
      let newRow = (
        <tr key={`row-${row}`}>
          <th scope="row">{depths[row]}</th>
          {capacities}
        </tr>
      );
      compRows.push(newRow);
    }

    // Build a tension table
    let tenHeaderRow = [];
    tenHeaderRow.push(
      <th scope="row">Embedment Depth (ft)</th>
    );
    for (let width = 0; width < widths.length; width++) {
      tenHeaderRow.push(
        <th key={`width-${width}`}>{widths[width]}</th>
      )
    }

    let tenRows = [];
    for (let row = 0; row < depths.length; row++) {
      let capacities = [];
      for (let col = 0; col < widths.length; col++) {
        capacities.push(
          <td className="summary-table-cell" key={`cap-${row}-${col}`}>
            {this.getCapacity(tension, widths[col], depths[row], isAllowable)}
          </td>
        );
      }
      let newRow = (
        <tr key={`row-${row}`}>
          <th scope="row">{depths[row]}</th>
          {capacities}
        </tr>
      );
      tenRows.push(newRow);
    }


    return (
      <div className="summary-capacity-page">
        <h2 className="summary-capacity-title">Summary of {capacityType} Axial Capacity</h2>
        <h3 className="summary-capacity-subtitle">{capacityType} Capacity (kips) - Compression</h3>
        <table className="summary-capacity-table">
          <thead className="summary-table-head">
            <tr key="width-row">
              <td key="blank"></td>
              <th key="width-label">Width (ft)</th>
            </tr>
            <tr>
              {compHeaderRow}
            </tr>
          </thead>
          <tbody>
            {compRows}
          </tbody>
        </table>
        <h3 className="summary-capacity-subtitle">{capacityType} Capacity (kips) - Tension</h3>
        <table className="summary-capacity-table">
          <thead>
            <tr key="width-row">
              <td key="blank"></td>
              <th key="width-label">Width (ft)</th>
            </tr>
            <tr>
              {tenHeaderRow}
            </tr>
          </thead>
          <tbody>
            {tenRows}
          </tbody>
        </table>
        <div className="pagebreak"></div>
      </div>
    )
  }
}