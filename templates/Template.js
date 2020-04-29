class Template {
  constructor(name, variables, defaultValues) {
    this.name = name;
    this.variables = { ...defaultValues, ...variables };
  }

  embed() {
    throw new Error(`Template ${this.name} doesn't have 'embed' function!`);
  }
}

export default Template;
