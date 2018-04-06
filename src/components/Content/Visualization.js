import React, { Component } from 'react';
import { vl2svg, equals } from '../js/util';

import '../css/Visualization.css';

class Visualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      svg: null,
      showDetailed: false
    };
    this.updateSvg(this.props.vlSpec);
  }

  updateSvg(vlSpec) {
    vl2svg(vlSpec).then(
      (svg) => {
        this.setState({
          svg: svg,
        });
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!equals(this.props, nextProps)) {
      this.updateSvg(nextProps.vlSpec);
    }
  }

  render() {
    let detailedScores;

    if (this.state.showDetailed) {
      detailedScores = this.getDetailedScores();
    } else {
      detailedScores = (
        <div key="button" className="show-hide" onClick={() => {
          this.setState({
            showDetailed: true
          });
        }}>
          show detailed scores
        </div>
      );
    }
    
  

    return (
      <div className="Visualization">
        <div className="ranking-box">
          {this.props.ranking}
        </div>
        <div className="score-box">
          score: {this.props.scores.score}
        </div>
        <div>
          <span dangerouslySetInnerHTML={{__html: this.state.svg}} />
        </div>
        <div className="detailed-scores">
          {detailedScores}
        </div>
      </div>
    );
  }

  getDetailedScores() {
    function DetailItem(props) {
      return <li className="detail-item">{props.value}</li>
    }

    const types = [];
    const features = [];
    const scores = [];
    
    types.push(<li key={-1} className="detail-title">Type</li>);
    features.push(<li key={-1} className="detail-title">Feature</li>);
    scores.push(<li key={-1} className="detail-title">Score</li>);
    
    for (let i = 0; i < this.props.scores.features.length; i++) {
      const detail = this.props.scores.features[i];
      types.push(<DetailItem key={i} value={detail.type}/>);
      features.push(<DetailItem key={i} value={detail.feature}/>);
      scores.push(<DetailItem key={i} value={detail.score}/>);
    }

    return [
      <div key="table" className="table">
        <div className="detail-column" key="types">
          {types}
        </div>
        <div className="detail-column" key="features">
          {features}
        </div>
        <div className="detail-column" key="scores">
          {scores}
        </div>
      </div>,
      <div key="button" className="show-hide" onClick={() => {
          this.setState({
            showDetailed: false
          });
        }}>
          hide
      </div>
    ];
  }
}

export default Visualization;