require("dotenv").config();
const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const { sequelize } = require("./config/db");
// const configuration = require("@feathersjs/configuration");

const initApp = () => {
  const app = express(feathers());

  return app;
};

const configureMiddleware = (app) => {
  app.use(express.json());

  return app;
};

const configure = (app) => {
  app.configure(socketio());
  app.configure(express.rest());

  return app;
};

const validate = (req, res, next) => {
  console.log("called!!!!");
  next();
};

const initModelAndService = (sequelize, app) => {
  // const config = require("./config/default.json");

  // console.log("config, ", config);
  // app.set("authentication", config.authentication);

  const Constituency = require("./models/constituencies");
  const Candidate = require("./models/candidates");
  const Party = require("./models/parties");
  const ParentConstituency = require("./models/parent_constituencies");
  const Poll = require("./models/polls");
  const Region = require("./models/regions");
  const Agent = require("./models/agents");
  const ApproveList = require("./models/approve_list");
  const ComputedRegion = require("./models/computed_regions");
  const NationalAnalysis = require("./models/national_analysis");
  const RegionalAnalysis = require("./models/regional_analysis");
  const SMSGatewayMessage = require("./models/sms_gateway_messages");
  const ConstituencySeat = require("./models/constituency_seat");
  const Users = require("./models/users");

  const ConstituencyService = require("./services/constituencies");
  const PartyService = require("./services/parties");
  const CandidateService = require("./services/candidates");
  const PollService = require("./services/polls");
  const AgentService = require("./services/agents");
  const RegionService = require("./services/regions");
  const ParentConstituencyService = require("./services/parent_constituencies");
  const ComputedRegionService = require("./services/computed_regions");
  const ApproveListService = require("./services/approve_list");
  const NationalAnalysisService = require("./services/national_analysis");
  const RegionalAnalysisService = require("./services/regional_analysis");
  const SMSGatewayMessageService = require("./services/sms_gateway_messages");
  const ConstituencySeatService = require("./services/constituency_seat");
  const UserService = require("./services/users");
  const LoginService = require("./services/login");
  const MobileAuthService = require("./services/mobile_auth");
  const InitializeService = require("./services/initialize");
  const ServerMobileAuth = require("./services/mobile_server_auth");

  // UI services
  const CandidateServiceUI = require("./services/candidates_ui");
  const RegionalAnalysisServiceUI = require("./services/regional_analysis_ui");

  // Only for testing purpose
  const DataInfo = require("./services/data_info");

  const constituencyModel = new Constituency().model(sequelize);
  const candidateModel = new Candidate().model(sequelize);
  const parentConstituencyModel = new ParentConstituency().model(sequelize);
  const partyModel = new Party().model(sequelize);
  const pollModel = new Poll().model(sequelize);
  const regionModel = new Region().model(sequelize);
  const agentModel = new Agent().model(sequelize);
  const approveListModel = new ApproveList().model(sequelize);
  const computedRegionModel = new ComputedRegion().model(sequelize);
  const nationalAnalysisModel = new NationalAnalysis().model(sequelize);
  const regionalAanlysisModel = new RegionalAnalysis().model(sequelize);
  const smsGatewayMessageModel = new SMSGatewayMessage().model(sequelize);
  const constituencySeatModel = new ConstituencySeat().model(sequelize);
  const userModel = new Users().model(sequelize);

  // const { AuthenticationService } = require("@feathersjs/authentication");

  // const authService = new AuthenticationService(app);

  // Set relationship
  constituencyModel.belongsTo(parentConstituencyModel, {
    foreignKey: "parent_id",
  });
  constituencyModel.belongsTo(partyModel, { foreignKey: "seat_won_id" });
  candidateModel.belongsTo(partyModel, { foreignKey: "party_id" });
  candidateModel.belongsTo(constituencyModel, {
    foreignKey: "constituency_id",
  });
  parentConstituencyModel.belongsTo(regionModel, { foreignKey: "region_id" });
  pollModel.belongsTo(constituencyModel, { foreignKey: "cons_id" });
  agentModel.belongsTo(constituencyModel, { foreignKey: "cons_id" });
  agentModel.belongsTo(pollModel, { foreignKey: "poll_id" });
  approveListModel.belongsTo(regionModel, { foreignKey: "region_id" });
  approveListModel.belongsTo(constituencyModel, { foreignKey: "cons_id" });
  approveListModel.belongsTo(pollModel, { foreignKey: "poll_id" });
  approveListModel.belongsTo(agentModel, { foreignKey: "agent_id" });
  computedRegionModel.belongsTo(regionModel, { foreignKey: "region_id" });
  nationalAnalysisModel.belongsTo(partyModel, { foreignKey: "party_id" });
  constituencySeatModel.belongsTo(constituencyModel, { foreignKey: "cons_id" });
  constituencySeatModel.belongsTo(partyModel, { foreignKey: "party_id" });
  constituencySeatModel.belongsTo(candidateModel, {
    foreignKey: "candidate_id",
  });
  constituencySeatModel.belongsTo(regionModel, { foreignKey: "region_id" });
  regionalAanlysisModel.belongsTo(regionModel, { foreignKey: "region_id" });
  regionalAanlysisModel.belongsTo(partyModel, { foreignKey: "party_id" });
  userModel.belongsTo(regionModel, { foreignKey: "region_id" });

  sequelize.sync({ alter: true });

  // const validate = (req, res, next) => {
  //   const secret = require("./utils").secret;
  //   app.set("token", secret);

  //   const { authorization } = req.headers;
  //   const token = authorization.includes("Bearer")
  //     ? authorization.split(" ")[1]
  //     : null;

  //   console.log("secret, ", secret);
  //   console.log("token, ", token);

  //   if (token) {
  //     // verifies secret and checks exp
  //     const jwt = require("jsonwebtoken");
  //     jwt.verify(token, app.get("token"), function(err, decoded) {
  //       if (err) {
  //         return res.json({
  //           success: false,
  //           message: "Failed to authenticate token."
  //         });
  //       } else {
  //         // if everything is good, save to request for use in other routes
  //         req.decoded = decoded;

  //         next();
  //       }
  //     });
  //   } else {
  //     return res.status(403).send({
  //       success: false,
  //       message: "No token provided."
  //     });
  //   }

  //   // next();
  // };

  // app.use("/*", validate);
  // app.use("/authentication", authService);
  app.use("/login", new LoginService(userModel, regionModel));

  app.use(
    "/constituencies",
    new ConstituencyService(
      constituencyModel,
      parentConstituencyModel,
      partyModel,
      candidateModel,
      constituencySeatModel
    )
  );
  app.use("/parties", new PartyService(partyModel, constituencyModel));
  app.use(
    "/polls",
    new PollService(pollModel, constituencyModel, parentConstituencyModel)
  );
  app.use(
    "/candidates",
    new CandidateService(
      candidateModel,
      constituencyModel,
      partyModel,
      parentConstituencyModel
    )
  );
  app.use(
    "/agents",
    new AgentService(
      agentModel,
      constituencyModel,
      pollModel,
      parentConstituencyModel
    )
  );
  app.use(
    "/parent_constituencies",
    new ParentConstituencyService(parentConstituencyModel, regionModel)
  );
  app.use(
    "/constituency_seats",
    new ConstituencySeatService(
      constituencySeatModel,
      constituencyModel,
      partyModel,
      candidateModel,
      regionModel
    )
  );
  app.use(
    "/approve_list",
    new ApproveListService(
      approveListModel,
      regionModel,
      constituencyModel,
      pollModel,
      agentModel,
      candidateModel,
      partyModel,
      parentConstituencyModel
    )
  );
  app.use(
    "/computed_regions",
    new ComputedRegionService(computedRegionModel, regionModel)
  );
  app.use(
    "/national_analysis",
    new NationalAnalysisService(nationalAnalysisModel, partyModel)
  );
  app.use(
    "/regional_analysis",
    new RegionalAnalysisService(regionalAanlysisModel, regionModel, partyModel)
  );
  app.use(
    "/sms_gateway_messages",
    new SMSGatewayMessageService(smsGatewayMessageModel)
  );
  app.use("/regions", new RegionService(regionModel));
  app.use(
    "/data_info",
    new DataInfo(agentModel, constituencyModel, candidateModel)
  );
  app.use("/users", new UserService(userModel, regionModel));
  app.use(
    "/mobile_auth",
    new MobileAuthService(
      agentModel,
      partyModel,
      parentConstituencyModel,
      constituencyModel,
      pollModel,
      regionModel
    )
  );
  app.use(
    "/initialize",
    new InitializeService(
      constituencyModel,
      parentConstituencyModel,
      pollModel,
      candidateModel
    )
  );
  app.use("/server_mobile", new ServerMobileAuth(smsGatewayMessageModel));

  // UI services
  app.use(
    "/candidates_ui",
    new CandidateServiceUI(candidateModel, constituencyModel, partyModel)
  );

  app.use(
    "/regional_analysis_ui",
    new RegionalAnalysisServiceUI(regionalAanlysisModel, regionModel, partyModel)
  );

  return app;
};

const finalize = (app) => {
  app.on("connection", (conn) => app.channel("stream").join(conn));
  app.publish((_) => app.channel("stream"));

  return app;
};

const app = initApp();
const middleware = configureMiddleware(app);
const configureApp = configure(middleware);
const register = initModelAndService(sequelize, configureApp);
const finalizeApp = finalize(register);

const PORT = process.env.PORT || 8081;
finalizeApp
  .listen(PORT)
  .on("listening", () => console.log(`App started on ${PORT}`));
