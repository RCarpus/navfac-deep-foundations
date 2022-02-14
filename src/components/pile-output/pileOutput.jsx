import React from "react";
import './pileOutput.css';
import { poundsToKips } from "../../navfac/navfacFunctions";

export default class PileOutput extends React.Component {
  render() {
    const { pile, groundwaterDepth, increment } = this.props;
    const loadDirection = pile.isCompression ? "Compression" : "Tension";
    const width = pile.width.length === 1
      ? pile.width[0]
      : `${pile.width[0]}x${pile.width[1]}`;
    const bearingCapacityFactorLabel = pile.endBearing.mode === "GRANULAR"
      ? 'Nq'
      : 'Nc';
    const bearingCapacityFactorValue = bearingCapacityFactorLabel === 'Nq'
      ? pile.granularNq
      : pile.cohesiveNc;
    const effectiveStressLimited = pile.limitedBottomStresses.isLimited
      ? 'yes'
      : 'no';
    console.log(pile);
    let rows = pile.skinFrictions.map((layer, index) => {
      if (pile.bearingDepth + increment 
        >= pile.detailedSoilProfile.layerBottomDepths[index]) {
        return (
          <tr key={`row-${index}`}>
            <td>{index + 1}</td>
            <td>{pile.detailedSoilProfile.layerBottomDepths[index]}</td>
            <td>{pile.detailedSoilProfile.layerNames[index]}</td>
            <td>{pile.detailedSoilProfile.layerUnitWeights[index]}</td>
            <td>{pile.detailedSoilProfile.layerPhis[index]}</td>
            <td>{pile.detailedSoilProfile.layerCohesions[index]}</td>
            <td>{Math.round(pile.limitedMidStresses.limitedEffStress[index])}</td>
            <td>{Math.round(pile.limitedBottomStresses.limitedEffStress[index])}</td>
            <td>{pile.contactFrictionAngles[index]}</td>
            <td>{pile.adhesions[index]}</td>
            <td>{pile.skinFrictions[index].toFixed(2)}</td>
          </tr>
        )
      }
      else { return null };
    })


    return (
      <div className="pile-output">
        <h2>Individual Pile Analysis</h2>
        <div className="pile-output-grid">
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Material</p>
            <p className="pile-output-subgrid-item">{pile.material}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left pile-type">Pile Type</p>
            <p className="pile-output-subgrid-item">{pile.pileType}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Load Direction</p>
            <p className="pile-output-subgrid-item">{loadDirection}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Kh</p>
            <p className="pile-output-subgrid-item">{pile.earthPressureCoefficient}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Pile Area (sf)</p>
            <p className="pile-output-subgrid-item">{pile.pileArea.toFixed(3)}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Pile Perimeter (ft)</p>
            <p className="pile-output-subgrid-item">{pile.pilePerimeter.toFixed(3)}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Width (ft)</p>
            <p className="pile-output-subgrid-item">{width}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Bearing Depth (ft)</p>
            <p className="pile-output-subgrid-item">{pile.bearingDepth}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">FS</p>
            <p className="pile-output-subgrid-item">{pile.FS}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left"><b>Allowable Capacity (kip)</b></p>
            <p className="pile-output-subgrid-item">{poundsToKips(pile.allowableCapacity).toFixed(2)}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Ultimate Capacity (kip)</p>
            <p className="pile-output-subgrid-item">{poundsToKips(pile.ultimateCapacity).toFixed(2)}</p>
          </div>
          <div className="pile-output-subgrid">{/* This div intentionally left blank */}</div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Bearing Mode</p>
            <p className="pile-output-subgrid-item">{pile.endBearing.mode}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">{bearingCapacityFactorLabel}</p>
            <p className="pile-output-subgrid-item">{bearingCapacityFactorValue}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Effective Stress Limited?</p>
            <p className="pile-output-subgrid-item">{effectiveStressLimited}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Pile Weight (kip)</p>
            <p className="pile-output-subgrid-item">{poundsToKips(pile.pileWeight).toFixed(2)}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Total Skin Friction (kip)</p>
            <p className="pile-output-subgrid-item">{poundsToKips(pile.totalSkinFriction).toFixed(2)}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">End Bearing (kip)</p>
            <p className="pile-output-subgrid-item">{poundsToKips(pile.endBearing.value).toFixed(2)}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Groundwater Depth (ft)</p>
            <p className="pile-output-subgrid-item">{groundwaterDepth}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Ignored Depth (ft)</p>
            <p className="pile-output-subgrid-item">{pile.ignoredDepth}</p>
          </div>
          <div className="pile-output-subgrid">
            <p className="pile-output-subgrid-item-left">Sublayer Thickness (ft)</p>
            <p className="pile-output-subgrid-item">{increment}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Layer No.</th>
              <th>Bottom Depth (ft)</th>
              <th>Name</th>
              <th>Unit Weight (pcf)</th>
              <th>Phi (deg)</th>
              <th>C (psf)</th>
              <th>Eff. Stress at Mid. (psf)</th>
              <th>Eff. Stress at Bot. (psf)</th>
              <th>contact friction angle 𝛿</th>
              <th>Adhesion α (psf)</th>
              <th>Skin Friction (psf)</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
        <div className="pagebreak"></div>
      </div>
    )
  }
}