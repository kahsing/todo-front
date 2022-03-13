require("dotenv").config();

module.exports = {
  reactStrictMode: true,
  env: {
    SERVER_URL: process.env.SERVER_URL,
    PORT: process.env.PORT,
  },
};
