const app = require("./app");

app.listen(8081, (err) => {
    if (err) {
        console.log("Error starting server:", err);
    } else {
        console.log("Server is listening on 8081");
    }
});

