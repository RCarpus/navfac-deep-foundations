import React from 'react';
import DeepFoundationAnalysis from '../../navfac/DeepFoundationAnalysis';
import SummaryCapacity from '../summary-allowable-capacity/summaryCapacity';



export default class AnalysisView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.analyzeProject();
  }

  analyzeProject() {
    let project = JSON.parse(localStorage.getItem('validatedProject'));
    console.log(project);
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
    console.log(layerCohesions, layerPhis);
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
    console.log(analysis.calculations);
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
    if (this.state.analyzed) {
      const { allCompSum, allTenSum, ultCompSum, ultTenSum, analysis,
        project } = this.state;
      console.log(project);
      console.log('ult ten sum');
      console.log(ultTenSum);
      return (
        <div>
          <h1>calculation page</h1>
          <SummaryCapacity
            isAllowable={true} compression={allCompSum} tension={allTenSum}
            widths={project.FoundationDetails.Widths}
            depths={project.FoundationDetails.BearingDepths} />
          <SummaryCapacity
            isAllowable={false} compression={ultCompSum} tension={ultTenSum}
            widths={project.FoundationDetails.Widths}
            depths={project.FoundationDetails.BearingDepths} />
        </div>

      )
    }

    return (
      <div>asdf</div>
    )

  }
}