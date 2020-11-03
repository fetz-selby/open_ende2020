module.exports = class Initialize {
  constructor(
    constituencyModel,
    parentConstituencyModel,
    pollModel,
    candidateModel
  ) {
    this.constituencyModel = constituencyModel;
    this.parentConstituencyModel = parentConstituencyModel;
    this.pollModel = pollModel;
    this.candidateModel = candidateModel;
  }

  preparePresCandidates = async (candidateModel, constituencyModel, year) => {
    try {
      const inputs = [
        { name: "", party_id: 0 },
        { name: "", party_id: 0 },
        { name: "", party_id: 0 },
        { name: "", party_id: 0 },
      ];

      // Destroy all before input to prevent duplicates
      await candidateModel.destroy({ where: { year, group_type: "P" } });
      Promise.all(
        inputs.map(async (input) => {
          const allConstituencies = (
            await constituencyModel.findAll({ where: { status: "A", year } })
          ).map((v) => v.dataValues);

          return Promise.all(
            allConstituencies.map(async (constituency) => {
              return await candidateModel.create({
                name: input.name,
                party_id: input.party_id,
                constituency_id: constituency.id,
                votes: 0,
                group_type: "P",
                year,
                code: "",
                avatar_path: "",
              });
            })
          );
        })
      );

      return { status: "Completed!" };
    } catch (err) {
      console.log(err);
      return { status: "Error", error: err };
    }
  };

  prepareCons = async (constituencyModel, parentConstituencyModel, year) => {
    try {
      const allConstituencies = (
        await parentConstituencyModel.findAll({ where: { status: "A" } })
      ).map((v) => v.dataValues);

      // Clean up first
      await constituencyModel.destroy({ where: { year } });

      return Promise.all(
        allConstituencies.map((parentConstituency) => {
          const { name, id } = parentConstituency;
          constituencyModel.create({
            name,
            district_id: 0,
            reg_votes: 0,
            reject_votes: 0,
            casted_votes: 0,
            year,
            is_declared: "N",
            auto_compute: "F",
            parent_id: id,
            seat_won_id: 23,
            total_votes: 0,
            status: "A",
          });
        })
      );
    } catch (error) {}
  };

  prepareCandidateResults = async (constituenyModel, candidateModel, year) => {
    try {
      const allConstituencies = (
        await constituenyModel.findAll({ where: { year, status: "A" } })
      ).map((v) => v.dataValues);

      // Pick each constituency and work on it
      return Promise.all(
        allConstituencies.map(async (constituency) => {
          const { id: constituency_id } = constituency;

          // Work on paliamentary candidates
          const paliamentaryCandidates = (
            await candidateModel.findAll({
              where: { constituency_id, status: "A", group_type: "M" },
            })
          ).map((v) => v.dataValues);

          // Get sum of paliamentary votes
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

          // Work on presidential candidates
          const presidentialCandidates = (
            await candidateModel.findAll({
              where: { constituency_id, status: "A", group_type: "P" },
            })
          ).map((v) => v.dataValues);

          // Get sum of presidential votes
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
                const angle = parseFloat(
                  (votes / sumOfPresidentialVotes) * 360
                );
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

          return constituency;
        })
      );
    } catch (error) {
      console.log("Error, ", error);
    }
  };

  preparePolls = async (pollModel, constituencyModel, year) => {
    try {
      const allPolls = (
        await pollModel.findAll({ where: { year: "2016", status: "A" } })
      ).map((v) => v.dataValues);

      // Cleanup first
      await pollModel.destroy({ where: { year } });
      return Promise.all(
        allPolls.map(async (oldPoll) => {
          const { name, cons_id } = oldPoll;

          // Fetch for constituency with parent_id in mind
          const { parent_id } = (
            await constituencyModel.findOne({
              where: { id: cons_id, status: "A" },
            })
          ).toJSON();

          // Fetch for constituency with acquired parent_id
          const { id: newConsId } = (
            await constituencyModel.findOne({ where: { parent_id, year } })
          ).toJSON();

          await pollModel.create({
            name,
            cons_id: newConsId,
            rejected_votes: 0,
            valid_votes: 0,
            total_voters: 0,
            year,
            external_id: "",
            status: "A",
          });
        })
      );
    } catch (error) {}
  };

  async find({ query: { year, type } }) {
    const {
      constituencyModel,
      parentConstituencyModel,
      pollModel,
      candidateModel,
    } = this;

    if (!year) throw new Error();
    try {
      switch (type) {
        case "cons":
          await this.prepareCons(
            constituencyModel,
            parentConstituencyModel,
            year
          );
          break;
        case "polls":
          await this.preparePolls(pollModel, constituencyModel, year);
          break;

        case "cal":
          await this.prepareCandidateResults(
            constituencyModel,
            candidateModel,
            year
          );
          break;
        case "pres-input":
          await this.preparePresCandidates(
            candidateModel,
            constituencyModel,
            year
          );
          break;
      }

      return { status: "completed" };
    } catch (err) {
      console.warn("Init, ", err);
      return { status: err };
    }
  }

  async create(req) {}
};
