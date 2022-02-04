import DeepFoundationAnalysis from "../navfac/DeepFoundationAnalysis";
import FoundationCalc from "../navfac/FoundationCalc";
import * as nf from '../navfac/navfacFunctions';

test(`Generate FoundationCalc and assign args in constructor`, () => {
  // Inputs for the class constructor
  const layerDepths = [3, 6, 8.5, 20],
    layerNames = ['LS', 'StCl', 'SCl', 'CS'],
    layerUnitWeights = [120, 120, 125, 135],
    layerPhis = [28, 0, 0, 36],
    layerCohesions = [0, 1500, 300, 0],
    groundwaterDepth = 9.5,
    increment = 0.5,
    ignoredDepth = 3;

})