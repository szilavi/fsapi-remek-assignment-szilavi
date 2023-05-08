const userService = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  getUserById: jest.fn(),
  __setMockData: (productData, userData, gameData) => {
    mockData = {
      products: productData,
      users: userData,
      games: gameData,
    };
  },
};

let mockData;

userService.findById.mockImplementation((id) => {
  const user = mockData.users.find((u) => u._id === id);
  return user ? Promise.resolve(user) : Promise.resolve(null);
});

userService.create.mockImplementation((user) => {
  const newUser = { ...user, _id: Math.random().toString() };
  mockData.users.push(newUser);
  return Promise.resolve(newUser);
});

userService.update.mockImplementation((id, userData) => {
  const index = mockData.users.findIndex((u) => u._id === id);
  if (index !== -1) {
    mockData.users[index] = { ...mockData.users[index], ...userData };
    return Promise.resolve(mockData.users[index]);
  }
  return Promise.resolve(null);
});

userService.getUserById.mockImplementation((userId) => {
  const user = mockData.users.find((u) => u._id === userId);
  return user ? Promise.resolve(user) : Promise.resolve(null);
});

module.exports = userService;
