module.exports = class CandidateUI {
  constructor(query, constituencyModel, partyModel) {
    this.query = query;
    this.constituencyModel = constituencyModel;
    this.partyModel = partyModel;
  }

  getShortenedName = (name) => {
    const firstLetter = (word) =>
      word.trim() !== "-" ? `${word[0].toUpperCase()}.` : word;

    const nameTokens = name.split(" ");

    switch (nameTokens.length) {
      case 1:
        return name;
      case 2:
        return `${nameTokens[0]} ${nameTokens[1]}`;
      case 3:
        return `${firstLetter(nameTokens[0])} ${firstLetter(nameTokens[1])} ${
          nameTokens[2]
        }`;
      case 4:
        return `${firstLetter(nameTokens[0])} ${firstLetter(
          nameTokens[1]
        )} ${firstLetter(nameTokens[2])} ${nameTokens[3]}`;
      case 5:
        return `${firstLetter(nameTokens[0])} ${firstLetter(
          nameTokens[1]
        )} ${firstLetter(nameTokens[2])} ${firstLetter(nameTokens[3])} ${
          nameTokens[4]
        }`;
      default:
        return name;
    }
  };

  async find({ query: { year, parentConstituency, type } }) {
    const app = this;
    const { query, constituencyModel, partyModel } = this;
    try {
      const { id: constituency_id } = (
        await constituencyModel.findOne({
          where: { year, parent_id: parentConstituency, status: "A" },
        })
      ).toJSON();

      const candidates = (
        await query.findAll({
          where: {
            year,
            constituency_id,
            group_type: type,
            status: "A",
          },
          include: [constituencyModel, partyModel],
        })
      )
        .map((v) => v.dataValues)
        .map((candidate) => ({
          ...candidate,
          shorten_name: app.getShortenedName(candidate.name),
        }));

      return candidates;
    } catch (err) {
      console.warn("CandidateUI, ", err);
      return [];
    }
  }
};
