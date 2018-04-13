/**
 * A Model represents a compassQL query.
 */
class Model {
  /**
   * Constructs a new Model with the given types.
   * @param {string} dataUrl The url of the data.
   * @param {Schema} schema A Schema iterator that describes
   *        the types to field fo the given data.
   * @param {string[]} queryTypes A list of types to encode, e.g. [Q, Q].
   *        Possible values include
   *          Q (Quantitative)
   *          O (Ordinal)
   *          N (Nominal)
   *          T (Time)
   */
  constructor(data, schema, fields,atts) {
    this.data = data;
    this.schema = schema;
    this.fields = fields;
    this.atts = atts;
  }

  /**
   * @return {Query} A compassQL query for this.
   */
  generate() {
  console.log("Generating Model");
    const spec = {};
    spec['data'] = {
      values: this.data
    };

    spec['mark'] = '?';

    const encodings = [];
    for (let i = 0; i < this.fields.length; i++) {
      const encoding = {};
      encoding['channel'] = '?';
      encoding['type'] = this.atts[this.fields[i]].type;

      encoding['field'] = this.fields[i];

      if ( this.atts[this.fields[i]].type === 'quantitative' ||  this.atts[this.fields[i]].type === 'temporal' || this.atts[this.fields[i]].type === 'key') {
        encoding['bin'] = '?';
      }
      if (this.atts[this.fields[i]].type === 'quantitative') {
        encoding['aggregate'] = '?';
      }

      encodings.push(encoding);
    }

    spec['encodings'] = encodings;

    const query = {};
    query['spec'] = spec;
    //query['groupBy']= ["field", "aggregate", "bin", "timeUnit", "stack"];
     // query['chooseBy']= "effectiveness";
      //query["config"]= {
      //    "autoAddCount": true
      //};
    query['orderBy'] = 'effectiveness';

    return query;
  }
}

export default Model;