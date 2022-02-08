import React from 'react';
import './welcomeView.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'https://navfac-api.herokuapp.com/';

export default class WelcomeView extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="welcome">
        <h1 className="welcome__title">
          NAVFAC Deep Foundations
        </h1>
        <h2 className="welcome__title">
          Axial capacity design tool
        </h2>
        <div className="welcome__video-container">
          <a className="welcome__video-link" href="#">Demonstration Video</a>
        </div>
        <div className="welcome__grid">
          <div className="welcome__grid__item">
            <p>
              This application performs axial capacity analysis for a variety
              of deep foundation types in stratified soil profiles. The
              calculations are adapted from the NAVFAC Foundations & Earth
              Structures Design Manual 7.02, last edited September 1986. This
              tool allows users to input a custom soil profile with several
              layers, select a foundation type and installation type, and
              input a selection of foundation widths and bearing depths to
              analyze simultaneously.
            </p>
            <p>
              After submitting an analysis, the user will be presented with a
              collection of summary tables showing the ultimate and allowable
              axial capacity of each foundation in compression and in tension.
              Beyond the summary tables, the user can view a detailed output
              for each individual pile showing the results of each calculation.
              The results may be downloaded in PDF form, and users can save
              their projects to enable tweaking the input parameters.
              Additionally, users can clone projects so they can easily analyze
              different pile types without needing to input the soil data again.
            </p>
            <p>
              Calculations are performed based on established soil science and
              the NAVFAC Foundations & Earth Structures Design Manual 7.02,
              last edited September 1986. This manual is available to download
              for free
              <a href="https://web.mst.edu/~rogersda/umrcourses/ge441/DM7_02.pdf"
                target="_blank"> here</a>.
            </p>
            <h2>
              Disclaimer
            </h2>
            <p>
              This application is not a substitute for engineering knowledge, and this README is not a design tutorial. Any engineer who uses this tool is expected to understand the NAVFAC analysis process as a prerequite and to review the calculations for accuracy. The author of this program takes no responsibility for any engineering decisions made by anybody using this application. Use it at your own risk.
            </p>
          </div>
          <div className="welcome__grid__item">
            <h2>
              Have an account?
            </h2>
            <Link to="/login">Login</Link>
            <h2>
              New user?
            </h2>
            <Link to="/register">Create a free account</Link>
          </div>
        </div>
      </div>

    )
  }
}