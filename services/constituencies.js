module.exports = class Constituency {
  constructor(
    query,
    parentConstituencyModel,
    partyModel,
    candidateModel,
    constituencySeatModel
  ) {
    this.query = query;
    this.parentConstituencyModel = parentConstituencyModel;
    this.partyModel = partyModel;
    this.candidateModel = candidateModel;
    this.constituencySeatModel = constituencySeatModel;
  }
  async find({ query: { year, regionId } }) {
    const { query, parentConstituencyModel, partyModel } = this;
    try {
      //Fetch Parent Constituencies with regionId
      const parentConstituencies = (
        await parentConstituencyModel.findAll({
          where: { region_id: regionId, status: "A" },
        })
      ).map((p) => p.dataValues.id);

      return await query.findAll({
        where: { year, parent_id: parentConstituencies },
        include: [parentConstituencyModel, partyModel],
      });
    } catch (err) {
      console.warn("Constituency, ", err);
      return [];
    }
  }

  async create(req) {
    const { query, parentConstituencyModel, partyModel } = this;
    const filteredReq = { ...req, seat_won_id: "23", is_declared: "N", id: "" };

    delete filteredReq.id;
    try {
      const parent_constituency = (
        await parentConstituencyModel.findOne({
          where: { id: filteredReq.parent_id, status: "A" },
        })
      ).toJSON();
      const party = (
        await partyModel.findOne({
          where: { id: filteredReq.seat_won_id, status: "A" },
        })
      ).toJSON();
      const constituency = (await query.create(filteredReq)).toJSON();

      return {
        ...constituency,
        parent_constituency,
        party,
        regionId: req.regionId,
      };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to save" };
    }
  }

  calculate = async (
    constituency_id,
    region_id,
    candidateModel,
    constituencyModel,
    constituencySeatModel
  ) => {
    const presidentialCandidates = (
      await candidateModel.findAll({
        where: { constituency_id, group_type: "P", status: "A" },
      })
    ).map((v) => v.dataValues);

    if (presidentialCandidates && presidentialCandidates.length) {
      const sumOfPresidentialVotes = presidentialCandidates.reduce(
        (acc, curr) => acc + parseInt(curr.votes),
        0
      );

      Promise.all(
        presidentialCandidates.map(async (candidate) => {
          const { votes, id: candidate_id } = candidate;

          if (sumOfPresidentialVotes === 0) {
            return await candidateModel.update(
              { percentage: 0.0, angle: 0.0, bar_ratio: 0.0 },
              { where: { id: candidate_id } }
            );
          } else {
            const percentage = parseFloat(
              (votes / sumOfPresidentialVotes) * 100
            );
            const angle = parseFloat((votes / sumOfPresidentialVotes) * 360);
            const bar_ratio = parseFloat(
              (votes / sumOfPresidentialVotes) * 400
            );

            return await candidateModel.update(
              { percentage, angle, bar_ratio },
              { where: { id: candidate_id } }
            );
          }
        })
      );
    }

    const paliamentaryCandidates = (
      await candidateModel.findAll({
        where: { constituency_id, group_type: "M", status: "A" },
      })
    ).map((v) => v.dataValues);

    if (paliamentaryCandidates && paliamentaryCandidates.length) {
      const sumOfPaliamentaryVotes = paliamentaryCandidates.reduce(
        (acc, curr) => acc + parseInt(curr.votes),
        0
      );

      Promise.all(
        paliamentaryCandidates.map(async (candidate) => {
          const { votes, id: candidate_id } = candidate;

          if (sumOfPaliamentaryVotes === 0) {
            return await candidateModel.update(
              { percentage: 0.0, angle: 0.0, bar_ratio: 0.0 },
              { where: { id: candidate_id } }
            );
          } else {
            const percentage = (votes / sumOfPaliamentaryVotes) * 100;
            const angle = (votes / sumOfPaliamentaryVotes) * 360;
            const bar_ratio = (votes / sumOfPaliamentaryVotes) * 400;

            return await candidateModel.update(
              { percentage, angle, bar_ratio },
              { where: { id: candidate_id } }
            );
          }
        })
      );

      // Sort and save seat_won_id
      if (sumOfPaliamentaryVotes > 0) {
        const {
          id: candidate_id,
          party_id,
          votes,
          year,
        } = paliamentaryCandidates.sort((a, b) => b.votes - a.votes)[0];

        await constituencyModel.update(
          { seat_won_id: party_id, is_declared: "Y" },
          { where: { id: constituency_id } }
        );

        // Delete and create
        await constituencySeatModel.destroy({
          where: { cons_id: constituency_id },
        });

        // Create new seat entry
        await constituencySeatModel.create({
          votes,
          percentage: parseFloat(votes / sumOfPaliamentaryVotes),
          cons_id: constituency_id,
          party_id,
          candidate_id,
          region_id,
          year,
          status: "A",
        });
      }
    }
  };

  async update(id, constituency) {
    const {
      name,
      reg_votes,
      reject_votes,
      casted_votes,
      year,
      is_declared,
      auto_compute,
      parent_id,
      seat_won_id,
      total_votes,
      regionId,
    } = constituency;
    const {
      query,
      parentConstituencyModel,
      partyModel,
      candidateModel,
      constituencySeatModel,
    } = this;
    try {
      await query.update(
        {
          name,
          reg_votes,
          reject_votes,
          casted_votes,
          year,
          is_declared,
          auto_compute,
          parent_id,
          seat_won_id,
          total_votes,
        },
        { where: { id, status: "A" } }
      );

      const parent_constituency = (
        await parentConstituencyModel.findOne({
          where: { id: parent_id, status: "A" },
        })
      ).toJSON();
      const party = (
        await partyModel.findOne({
          where: { id: seat_won_id, status: "A" },
        })
      ).toJSON();

      if (is_declared === "Y") {
        this.calculate(
          id,
          regionId,
          candidateModel,
          query,
          constituencySeatModel
        );
      }

      return { ...constituency, parent_constituency, party };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to update" };
    }
  }
};
