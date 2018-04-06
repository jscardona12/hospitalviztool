const compassql = require('compassql');

class Schema {
  /**
   * Constructs a new Schema for the given dataset.
   *
   * @param {Object} data The path data to construct a schema for.
   */
  constructor(data) {
    this.types = new Map();
    this.typesIterator = new Map();

    // read the schema file
    this.schema = compassql.schema.build(data);

    // create types => fields map
    // for (const field of this.schema.fieldNames()) {
    //   const fieldSchema = this.schema.fieldSchema(field);
    //   const type = fieldSchema.vlType;
    //   console.log(type);
    //   console.log(field);
    //
    //   atts[field].type = type;
    //   if (!this.types.has(type)) {
    //     this.types.set(type, []);
    //   }
    //   this.types.get(type).push(fieldSchema);
    // }
    //
    // for (const type of this.types.keys()) {
    //   this.types.get(type).sort((a, b) => {
    //     return a.stats.distinct - b.stats.distinct;
    //   });
    // }
  }
  setAttr(atts){
      console.log("Setting Attr")
      for (const field of this.schema.fieldNames()) {
          const fieldSchema = this.schema.fieldSchema(field);
          const type = fieldSchema.vlType;
          atts[field].type = type;
          if (!this.types.has(type)) {
              this.types.set(type, []);
          }
          this.types.get(type).push(fieldSchema);
      }
  }

  /**
   * Returns the compassQL schema backing this
   *
   * @return {Object} The object mapping fieldName to type for the data
   *        this represents and various other data.
   */
  getCqlSchema() {
    return this.schema;
  }

  /**
   * Prepares this to return a sequence of fields.
   */
  ready() {
    for (const type of this.types.keys()) {
      const fieldsCopy = this.types.get(type).slice(0);
      this.typesIterator.set(type, fieldsCopy);
    }
  }

  /**
   * Returns the next field for the given type, null
   * if there are no more fields for the given type.
   *
   * @param {string} type The type requested: e.g. 'nominal', 'quantitative'.
   */
  getNextField(type) {
    if (!this.typesIterator.has(type)) {
      return null;
    }

    const fields = this.typesIterator.get(type);
    if (fields.length === 0) {
      return null;
    }

    return fields.shift().name;
  }

  /**
   * Resets this to return a sequence of fields.
   */
  reset() {
    this.close();
    this.open();
  }

  /**
   * Closes this.
   */
  close () {
    this.typesIterator.clear();
  }
}

export default Schema;