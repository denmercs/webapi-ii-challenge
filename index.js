const server = require("./server");
const Data = require("./data/db");
const serverRouter = require("./server-router");

server.use("/api/posts", serverRouter);

server.listen(3000, () => console.log("server is running right now"));
