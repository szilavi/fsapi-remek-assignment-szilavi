const wishlistService = {
  findById: jest.fn(),
  create: jest.fn(),
  findAndDelete: jest.fn(),
  __setMockData: (data) => {
    mockData = data;
  },
};

let mockData;

wishlistService.findById.mockImplementation((userId) => {
  const wishes = mockData.filter((w) => w.userId === userId);
  return Promise.resolve(
    wishes.map((wish) => ({
      _id: wish._id,
      gameTitle: wish.gameId.title,
    }))
  );
});

wishlistService.create.mockImplementation((wishData) => {
  const newWish = { ...wishData, _id: Date.now().toString() };
  mockData.push(newWish);
  return Promise.resolve(newWish);
});

wishlistService.findAndDelete.mockImplementation((wishId) => {
  const index = mockData.findIndex((w) => w._id === wishId);
  if (index !== -1) {
    const deletedWish = mockData.splice(index, 1)[0];
    return Promise.resolve(deletedWish);
  }
  return Promise.resolve(null);
});

module.exports = wishlistService;
