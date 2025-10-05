class ApiFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);

    for (const key in parsedQuery) {
      if (typeof parsedQuery[key] === "object") {
        for (const op in parsedQuery[key]) {
          if (
            typeof parsedQuery[key][op] === "string" &&
            !isNaN(parsedQuery[key][op])
          ) {
            parsedQuery[key][op] = Number(parsedQuery[key][op]);
          }
        }
      }
    }

    this.query = this.query.find(parsedQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const querySort = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(querySort);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // Use the select method to include specified fields and exclude __v
      let includeFields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(includeFields);
    } else {
      // If no fields are specified, exclude only the __v field by default
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    if (this.queryString.page) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = ApiFeature;
