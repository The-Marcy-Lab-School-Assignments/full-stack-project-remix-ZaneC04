// Ensures that the test suite can run, without using the actual Express server to do so. 

const app = require('./index');
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));