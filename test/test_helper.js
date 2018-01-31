const User = require('../src/models/user.model');
require('../src/startDatabase');

beforeEach('Remove all data before each test', async () => {
    await User.remove();
});
