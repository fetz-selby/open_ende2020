module.exports = class MobileAuth {
  constructor(
    agentModel,
    partyModel,
    parentConstituencyModel,
    constituencyModel,
    pollModel,
    regionModel
  ) {
    this.agentModel = agentModel;
    this.partyModel = partyModel;
    this.parentConstituencyModel = parentConstituencyModel;
    this.constituencyModel = constituencyModel;
    this.pollModel = pollModel;
    this.regionModel = regionModel;
  }

  async find({ query: { mobile, pin } }) {
    const {
      agentModel,
      partyModel,
      constituencyModel,
      pollModel,
      parentConstituencyModel,
      regionModel,
    } = this;

    try {
      const userAuth = await agentModel.findOne({
        where: { msisdn: mobile, pin, status: "A" },
      });
      if (userAuth && userAuth.id) {
        const { cons_id, poll_id, year, id } = userAuth.toJSON();
        const parties = (await partyModel.findAll()).map((v) => ({
          id: v.dataValues.id,
          name: v.dataValues.name,
          color: v.dataValues.color,
          order_queue: v.dataValues.order_queue,
        }));
        const constituency = (
          await constituencyModel.findOne({
            where: { id: cons_id, year, status: "A" },
          })
        ).toJSON();
        const parentConsWithRegion = (
          await parentConstituencyModel.findOne({
            where: { id: constituency.parent_id, status: "A" },
            include: [regionModel],
          })
        ).toJSON();
        const poll = (
          await pollModel.findOne({ where: { id: poll_id, year, status: "A" } })
        ).toJSON();

        return {
          id,
          msisdn: mobile,
          parties,
          constituency: constituency.name,
          cons_id,
          poll_id,
          poll: poll.name,
          gateway: parentConsWithRegion.region.gateway,
          error: false,
        };
      } else {
        return { error: true };
      }
    } catch (err) {
      console.warn("MobileAuth, ", err);
      return { error: true };
    }
  }
  async create(auth) {
    return {};
  }

  async update(auth) {
    return {};
  }
};
