import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());


// Load routes
app.use("/api/user", require("./routes/user"));
app.use("/api/vendor", require("./routes/vendor"));


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});