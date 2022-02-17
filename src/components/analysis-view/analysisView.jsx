/**
 * @module AnalysisView
 */

import React from 'react';
import './analysisView.css';
import DeepFoundationAnalysis from '../../navfac/DeepFoundationAnalysis';
import SummaryCapacity from '../summary-allowable-capacity/summaryCapacity';
import AnalysisHeader from '../analysis-header/analysisHeader';
import SoilProfileOutput from '../soil-profile-output/soilProfileOutput';
import PileOutput from '../pile-output/pileOutput';

/**
 * Loads a validated project object from localStorage and performs the 
 * calculation suite. The results are displayed in a format that is 
 * conducive to printing or saving to PDF. 
 * 
 * The validated project is saved into localStorage by the ProjectEditView 
 * when the user presses calculate and the validation check succeeds.
 */
export default class AnalysisView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Check to make sure the user is logged in, then perform the calculation
   * suite on the validated project saved in localStorage.
   */
  componentDidMount() {
    this.props.checkLoginStatus();
    this.analyzeProject();
  }

  /**
   * Performs pile analysis for each combination of width and bearingDepth,
   * in tension and in compression. This uses the DeepFoundationAnalyis 
   * class I built for this job. This is called when the component mounts.
   */
  analyzeProject() {
    let project = JSON.parse(localStorage.getItem('validatedProject'));

    // We need to parse out the layerCohesions and layerPhis from the 
    // user's LayerCorPhiValues.
    let layerCohesions = [];
    let layerPhis = [];
    let types = project.SoilProfile.LayerPhiOrCs;
    let values = project.SoilProfile.LayerPhiOrCValues;
    for (let i = 0; i < values.length; i++) {
      if (types[i] === "PHI") {
        layerPhis.push(values[i]);
        layerCohesions.push(0);
      } else {
        layerPhis.push(0);
        layerCohesions.push(values[i]);
      }
    }

    // Initialize the analysis
    let analysis = new DeepFoundationAnalysis(
      project.SoilProfile.LayerDepths,
      project.SoilProfile.LayerNames,
      project.SoilProfile.LayerUnitWeights,
      layerPhis,
      layerCohesions,
      project.SoilProfile.GroundwaterDepth,
      project.SoilProfile.Increment,
      project.SoilProfile.IgnoredDepth
    );

    // Do the analysis
    analysis.analyze(
      project.FoundationDetails.Material,
      project.FoundationDetails.PileType,
      project.FoundationDetails.Widths,
      project.FoundationDetails.BearingDepths,
      project.FoundationDetails.FS
    );

    // Extract capacity data needed for summary tables
    const allCompSum = analysis.calculations.compressionAnalyses.map(analysis => {
      return {
        width: analysis.width,
        bearingDepth: analysis.bearingDepth,
        allowableCapacity: analysis.allowableCapacity,
      }
    });
    const allTenSum = analysis.calculations.tensionAnalyses.map(analysis => {
      return {
        width: analysis.width,
        bearingDepth: analysis.bearingDepth,
        allowableCapacity: analysis.allowableCapacity,
      }
    });
    const ultCompSum = analysis.calculations.compressionAnalyses.map(analysis => {
      return {
        width: analysis.width,
        bearingDepth: analysis.bearingDepth,
        allowableCapacity: analysis.ultimateCapacity,
      }
    });
    const ultTenSum = analysis.calculations.tensionAnalyses.map(analysis => {
      return {
        width: analysis.width,
        bearingDepth: analysis.bearingDepth,
        allowableCapacity: analysis.ultimateCapacity,
      }
    });

    // Set the calculated data into state so we can pass it to other components
    this.setState({
      analyzed: true,
      analysis,
      allCompSum,
      allTenSum,
      ultCompSum,
      ultTenSum,
      project,
    });

  }

  render() {
    // I'm using 'if' here because if I don't, it will try rendering all this
    // before completing the analysis and it will break.
    if (this.state.analyzed) {
      const { allCompSum,
        allTenSum,
        ultCompSum,
        ultTenSum,
        project,
        analysis } = this.state;

      // An array of PileOutput elements in compression
      const compressionPiles = analysis
        .calculations.compressionAnalyses.map((pile) => {
          return (
            <PileOutput pile={pile}
              groundwaterDepth={analysis.generalSoilProfile.groundwaterDepth}
              increment={analysis.increment} />
          )
        });

      // An array of PileOutput elements in tension
      const tensionPiles = analysis
        .calculations.tensionAnalyses.map((pile) => {
          return (
            <PileOutput pile={pile}
              groundwaterDepth={analysis.generalSoilProfile.groundwaterDepth}
              increment={analysis.increment} />
          )
        });


      return (
        <div className="analysis-view">
          <button className="no-print" onClick={() => window.location.href = "/#/edit-project"}>Back to Edit View</button>
          <AnalysisHeader name={project.Meta.Name}
            client={project.Meta.Client}
            engineer={project.Meta.Engineer} />
          <SummaryCapacity
            isAllowable={true} compression={allCompSum} tension={allTenSum}
            widths={project.FoundationDetails.Widths}
            depths={project.FoundationDetails.BearingDepths} />
          <SummaryCapacity
            isAllowable={false} compression={ultCompSum} tension={ultTenSum}
            widths={project.FoundationDetails.Widths}
            depths={project.FoundationDetails.BearingDepths} />
          <SoilProfileOutput data={analysis} />
          {compressionPiles}
          {tensionPiles}
        </div>

      )
    }

    // This should'nt ever happen, but I need a return statement in case the
    // conditional above didn't trigger.
    return (
      <div>Hmm.. there is nothing here.</div>
    )

  }
}