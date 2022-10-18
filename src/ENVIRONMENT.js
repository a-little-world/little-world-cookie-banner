exports.DEVELOPMENT = true; // this is more like FRONTEND_LOCAL_DEVELOPENT ( it's ment to be false, when use in backend local development )
exports.DEFAULT_LOGIN_USERNAME = this.DEVELOPMENT
  ? "herrduenschnlate@gmail.com"
  : "nopeHeAintExistInProduction:)";
exports.DEFAULT_LOGIN_PASSWORD = this.DEVELOPMENT ? "Test123!" : "aPassYouCantUse:)";
exports.BACKEND_URL = this.DEVELOPMENT ? "http://localhost:3333" : "https://little-world.com";
exports.STORYBOOK = false;