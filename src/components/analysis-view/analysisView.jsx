import React from 'react';
import './analysisView.css';
import DeepFoundationAnalysis from '../../navfac/DeepFoundationAnalysis';
import SummaryCapacity from '../summary-allowable-capacity/summaryCapacity';
import AnalysisHeader from '../analysis-header/analysisHeader';
import SoilProfileOutput from '../soil-profile-output/soilProfileOutput';
import PileOutput from '../pile-output/pileOutput';



export default class AnalysisView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.checkLoginStatus();
    this.analyzeProject();
  }

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
    if (this.state.analyzed) {
      const { allCompSum,
        allTenSum,
        ultCompSum,
        ultTenSum,
        project,
        analysis } = this.state;

      const compressionPiles = analysis
        .calculations.compressionAnalyses.map((pile) => {
          return (
            <PileOutput pile={pile}
              groundwaterDepth={analysis.generalSoilProfile.groundwaterDepth}
              increment={analysis.increment} />
          )
        });

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
          <button className="no-print" onClick={() => window.location.href="/#/edit-project"}>Back to Edit View</button>
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

    return (
      <div>asdf</div>
    )

  }
}