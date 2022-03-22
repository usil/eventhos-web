require("dotenv").config();
const EnvSettings = require("advanced-settings").EnvSettings;
const envSettings = new EnvSettings();

const options = {
  devServer: {
    onBeforeSetupMiddleware: (devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }

      devServer.app.get("/settings.json", function (req, res) {
        const settings = envSettings.loadJsonFileSync("./settings.json");
        console.log(settings);
        res.json(settings);
      });
    },
  },
};

module.exports = options;
