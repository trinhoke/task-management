const taskRoute = require("./task.route");
const userRoute = require("./user.route");
const usersRoute = require("./users.route");

module.exports = (app) => {
   const version = "/api/v1";
   app.use(version + "/task", taskRoute);
   app.use(version + "/user", userRoute);
   app.use(version + "/users", usersRoute);
}