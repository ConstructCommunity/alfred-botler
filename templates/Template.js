class Template {
  constructor(name, variables, defaultValues) {
    this.name = name;
    this.variables = Object.assign({}, defaultValues, variables);
  }

  toEmbed() {
    throw new Error(`Template ${this.name} doesn't have 'toEmbed' function!`);
  }
}

export default Template;
