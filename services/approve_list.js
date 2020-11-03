module.exports = class ApproveList {
  constructor(
    query,
    regionModel,
    constituencyModel,
    pollModel,
    agentModel,
    candidateModel,
    partyModel,
    parentConstituencyModel
  ) {
    this.query = query;
    this.regionModel = regionModel;
    this.constituencyModel = constituencyModel;
    this.pollModel = pollModel;
    this.agentModel = agentModel;
    this.candidateModel = candidateModel;
    this.partyModel = partyModel;
    this.parentConstituencyModel = parentConstituencyModel;
  }
  async find({ query: { regionId, year } }) {
    const {
      query,
      regionModel,
      constituencyModel,
      pollModel,
      agentModel,
    } = this;

    try {
      return await query.findAll({
        where: { region_id: regionId, year, is_approved: "N", status: "A" },
        include: [regionModel, constituencyModel, pollModel, agentModel],
      });
    } catch (err) {
      console.warn("ApproveList, ", err);
      return [];
    }
  }

  sumType = (party, type, filteredResults) => {
    const keys = Object.keys(filteredResults);
    const sum = keys.reduce((acc, curr) => {
      const val = filteredResults[curr][type].find((v) => v.party === party);
      const partyValue = val === undefined ? 0 : parseInt(val.value);

      return acc + partyValue;
    }, 0);

    return sum;
  };

  getAggregatedParties = (filteredResults) => {
    const keys = Object.keys(filteredResults);
    const agg = keys.reduce((acc, curr) => {
      return [...new Set(acc.concat(filteredResults[curr].parties))];
    }, []);
    return agg;
  };

  getFilteredComputation = (approveList) => {
    const getAllPollIds = (approveList) =>
      approveList && approveList.length
        ? approveList.map((a) => a.poll_id)
        : [];

    const getParties = (message) =>
      message && message.length
        ? message.split(" ").map((token) => token.split(":")[0])
        : [];

    const getObjectified = (message) =>
      message && message.length
        ? message.split(" ").map((token) => ({
            party: token.split(":")[0],
            value: token.split(":")[1],
          }))
        : [];

    const getLatest = (approveList) =>
      approveList && approveList.length
        ? approveList.map((l) => l.id).sort((a, b) => b - a)[0]
        : 0;

    const getData = (pollIds, approveList) => {
      return pollIds.reduce((acc, curr) => {
        const paliamentary = approveList.filter(
          (approve) => approve.poll_id === curr && approve.type === "M"
        );
        const presidential = approveList.filter(
          (approve) => approve.poll_id === curr && approve.type === "P"
        );

        let [paliamentaryValue, presidentialValue] = ["", ""];

        // Paliamentary search
        if (paliamentary.length === 0) {
          paliamentaryValue = "";
        } else if (paliamentary.length === 1) {
          paliamentaryValue = paliamentary[0].message;
        } else {
          const latestId = getLatest(paliamentary);
          paliamentaryValue = paliamentary.find((item) => item.id === latestId)
            .message;
        }

        // Presidential search
        if (presidential.length === 0) {
          presidentialValue = "";
        } else if (presidential.length === 1) {
          presidentialValue = presidential[0].message;
        } else {
          const latestId = getLatest(presidential);
          presidentialValue = presidential.find((item) => item.id === latestId)
            .message;
        }

        const parties = [
          ...new Set(
            getParties(paliamentaryValue).concat(getParties(presidentialValue))
          ),
        ];

        const [parliamentaryObj, presidentialObj] = [
          getObjectified(paliamentaryValue),
          getObjectified(presidentialValue),
        ];

        return {
          ...acc,
          [curr]: { M: parliamentaryObj, P: presidentialObj, parties },
        };
      }, {});
    };

    return getData(getAllPollIds(approveList), approveList);
  };

  async update(id, approve) {
    const app = this;
    const { is_approved, year } = approve;
    const { query, candidateModel, partyModel } = this;

    try {
      await query.update({ is_approved }, { where: { id, status: "A" } });

      const approveResp = (
        await query.findOne({ where: { id, status: "A" } })
      ).toJSON();

      const { cons_id } = approveResp;

      // Find all approve within the constituency
      const allApprovedMatch = (
        await query.findAll({
          where: { cons_id, is_approved: "Y", status: "A" },
        })
      ).map((v) => ({ ...v.dataValues, message: v.dataValues.message.trim() }));

      const filtered = app.getFilteredComputation(allApprovedMatch);
      const parties = app.getAggregatedParties(filtered);

      const modifyCandidate = async () => {
        return Promise.all(
          parties.map(async (party) => {
            const resp = (
              await partyModel.findOne({
                where: { name: party.toUpperCase(), status: "A" },
              })
            ).toJSON();

            const party_id = resp.id;

            const [paliamentarySum, presidentialSum] = [
              app.sumType(party, "M", filtered),
              app.sumType(party, "P", filtered),
            ];

            await candidateModel.update(
              { votes: paliamentarySum },
              {
                where: {
                  group_type: "M",
                  party_id,
                  constituency_id: cons_id,
                  status: "A",
                  year,
                },
              }
            );

            await candidateModel.update(
              { votes: presidentialSum },
              {
                where: {
                  group_type: "P",
                  party_id,
                  constituency_id: cons_id,
                  status: "A",
                  year,
                },
              }
            );
          })
        );
      };
      // Map party to ID
      await modifyCandidate();

      return { ...approve };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to update" };
    }
  }

  async remove(id) {
    const { query } = this;

    try {
      await query.update({ status: "D" }, { where: { id, status: "A" } });

      return { id };
    } catch (err) {
      console.log("Error", err);
      return { error: "Failed to update" };
    }
  }

  async create(req) {
    const { from, message, message_id } = req;
    const {
      query,
      regionModel,
      constituencyModel,
      pollModel,
      agentModel,
      parentConstituencyModel,
    } = this;

    //Check if message already exist
    const isMessageExist = await query.findOne({
      where: { message_id, feed: message },
    });

    if (isMessageExist) return {};

    const tokens = message.split("&");
    if (tokens && tokens.length === 5) {
      try {
        const resultType = tokens[0];
        const results = tokens[1];
        const cons_id = tokens[2];
        const poll_id = tokens[3];
        const agent_id = tokens[4];

        const { parent_id, year } = (
          await constituencyModel.findOne({
            where: { id: cons_id, status: "A" },
          })
        ).toJSON();

        const { region_id } = (
          await parentConstituencyModel.findOne({
            where: { id: parent_id, status: "A" },
          })
        ).toJSON();

        const { id: approve_id } = (
          await query.create({
            msisdn: from,
            message: results,
            message_id,
            feed: message,
            region_id,
            cons_id,
            poll_id,
            agent_id,
            is_approved: "N",
            type: resultType,
            year,
            posted_ts: new Date(),
            status: "A",
          })
        ).toJSON();

        const approve = (
          await query.findOne({
            where: { id: approve_id, status: "A" },
            include: [regionModel, constituencyModel, pollModel, agentModel],
          })
        ).toJSON();

        return { ...approve, regionId: region_id };
      } catch (err) {
        console.warn("ApproveList, ", err);
        return [];
      }
    }

    // P&NPP:2&2876&4322&11148
  }
};
