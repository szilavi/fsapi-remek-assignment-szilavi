const adminService = {
  findAll: jest.fn(),
  __setMockData: (data) => {
    mockData = data;
  },
};

let mockData;

adminService.findAll.mockImplementation(() => {
  const wishes = mockData;
  return wishes.map((wish) => ({
    _id: wish._id,
    userId: [wish.userId.name],
    gameId: [wish.gameId.title],
  }));
});

module.exports = adminService;
