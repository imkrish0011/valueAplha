const app = require('./app');
const fs = require('fs');

const PORT = 5001;

app.listen(PORT, () => {
  fs.writeFileSync('server-status.txt', `Running on port ${PORT}`);
  console.log(`Cricket API Backend running on http://localhost:${PORT}`);
});
