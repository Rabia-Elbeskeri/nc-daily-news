
const app = require("./app");
const { PORT = 8081 } = process.env;

app.listen(PORT, "0.0.0.0", (err) => {
    if (err) {
        console.log("Error starting server:", err);
    } else {
        console.log(`Server is listening on ${PORT}`);
    }
});




// const app = require("./app");
//
// app.listen(8081, (err) => {
//     if (err) {
//         console.log("Error starting server:", err);
//     } else {
//         console.log("Server is listening on 8081");
//     }
// });
