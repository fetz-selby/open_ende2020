module.exports = class DataInfo {
  constructor(query, constituencyModel, candidateModel) {
    this.query = query;
    this.constituencyModel = constituencyModel;
    this.candidateModel = candidateModel;
  }

  async find({ query: { year = "2016" } }) {
    const { query, constituencyModel, candidateModel } = this;

    try {
      const constituenciesResponse = await constituencyModel.findAll({
        where: { year },
      });
      const candidateResponse = await candidateModel.findAll({
        where: { votes: 0, year },
      });

      const candidateMatch = candidateResponse.map((v) => v.dataValues);
      const constituencyMatch = constituenciesResponse.map((v) => v.dataValues);

      const foundConstituencies = candidateMatch.reduce((acc, curr) => {
        const match = constituencyMatch.find(
          (cons) => parseInt(curr.constituency_id) === parseInt(cons.id)
        ).name;

        acc.push(match);

        return acc;
      }, []);

      console.log("grabbed, ", [...new Set(foundConstituencies)].length);

      return [...new Set(foundConstituencies)];
    } catch (err) {
      console.warn("Agent, ", err);
      return [];
    }
  }

  async create(req) {
    const { query } = this;

    const region = { ...req, id: "" };

    delete region.id;

    try {
      return await query.create(region);
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }
};
