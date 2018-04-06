import React, { Component } from 'react';
import '../css/Display.css';
import Model from '../js/model';
import Recommender from '../js/recommender';
import Visualization from './Visualization';

class Display extends Component {
  constructor(props) {
    super(props);
    this.recommender = new Recommender(this.props.schema.getCqlSchema());
  }

  render() {
    if (this.props.fieldTypes.length === 0) {
      return null;
    }

    const model = new Model(
      this.props.data,
      this.props.schema,
      this.props.fieldTypes,
      this.props.fieldAggregates,
      this.props.fieldBins
    );
    const query = model.generate();
    console.log("QUERY");
    console.log(query);

    const results = this.recommender.generate(query);

    const visualizations = [];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      console.log(result);
      visualizations.push(
        <Visualization key={i} id={i} vlSpec={result.spec}
                       scores={result.scores} ranking={i + 1}/>
      );
    }

    return (
      <div className="Display">
        {visualizations}
      </div>
    );
  }
}

export default Display;