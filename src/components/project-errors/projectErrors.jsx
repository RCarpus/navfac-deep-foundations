/**
 * @module ProjectErrors
 */
import React from "react";
import './projectErrors.css';

/**
 * Takes in an object full of booleans indicating whether input errors 
 * have been detected. Displays an error message with hints on how to fix 
 * them for each error found.
 * @param {object} valid An object with the same keys as a project object,
 * but each value is a boolean. 
 * @param {function} toggleErrors Tells the Analysis view to close the 
 * error box.
 */
export default function ProjectErrors(props) {
  const { valid } = props;

  // If for some reason valid isn't passed in, we still need something.
  if (!valid) return (
    <div className="project-errors">
      <h2>Project Errors</h2>
      <p>No errors.</p>
    </div>
  );

  return (
    <div className="project-errors">
      <button onClick={(e) => props.toggleErrors(e)}
        id="close-errors-btn" >close</button>
      <h2>Project Errors</h2>
      {!valid.Meta.Client &&
        <p>Client Name throwing an error, but that should be impossible.</p>}
      {!valid.Meta.Engineer &&
        <p>Engineer is throwing an error, but that should be impossible.</p>}
      {!valid.Meta.Name &&
        <p>You can't have two projects with the same name.
          Change the name of the project to a name that is not already in use.</p>}
      {!valid.Meta.Notes &&
        <p>Notes is throwing an error, but that should be impossible.</p>}
      {!valid.SoilProfile.GroundwaterDepth &&
        <p>Groundwater Depth must be a non-negative number and must be evenly 
          divisible by Sublayer Increment.</p>}
      {!valid.SoilProfile.IgnoredDepth &&
        <p>Ignored Depth must be a non-negative number and must be evenly 
          divisible by sublayer increment.</p>}
      {!valid.SoilProfile.Increment &&
        <p>Sublayer Increment must be either 0.5 or 1.</p>}
      {!valid.SoilProfile.LayerDepths &&
        <p>Each layer must be deeper than the previous layer, and each depth must
          be evenly divisible by Sublayer Increment.</p>}
      {!valid.SoilProfile.LayerNames &&
        <p>Each soil layer must have a name.</p>}
      {!valid.SoilProfile.LayerPhiOrCValues &&
        <p>Phi values must be integers between 26 and 40.
          Cohesion values must be nonzero numbers.</p>}
      {!valid.SoilProfile.LayerPhiOrCs &&
        <p>Each layer must be either C or Phi.</p>}
      {!valid.SoilProfile.LayerUnitWeights &&
        <p>Unit weights must be nonzero numbers.</p>}
      {!valid.FoundationDetails.BearingDepths &&
        <p>Bearing depths must be positive numbers, must be evenly divisible
          by Sublayer Increment, and must be shallower than your deepest
          layer. Also, you need at least one.</p>}
      {!valid.FoundationDetails.FS &&
        <p>FS must be a positive number. We recommend you use a value of 3.</p>}
      {!valid.FoundationDetails.Material &&
        <p>Material must come from the dropdown list.</p>}
      {!valid.FoundationDetails.PileType &&
        <p>Pile Type must come from the dropdown list.</p>}
      {!valid.FoundationDetails.Widths &&
        <p>Widths must be positive numbers. Also, you need at least one
          valid width.</p>}
    </div>
  );
}