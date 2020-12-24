var appRouter = function(app) {
  app.get("/", (req, res) => {
    res.send("Hello world from root!");
  });

  app.get("/home", (req, res) => {
    res.send("Hello world from home!");
  })

}

module.exports = appRouter;
