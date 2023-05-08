const adminService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  deleteWishesByUserId: jest.fn(),
  updateListingsBySellerId: jest.fn(),
  deleteUserById: jest.fn(),
  __setMockData: (data) => {
    mockData = data;
  },
};

let mockData;

adminService.findAll.mockImplementation(() => {
  return Promise.resolve(mockData.users);
});

adminService.findById.mockImplementation((id) => {
  const user = mockData.users.find((user) => user._id === id);
  return Promise.resolve(user);
});

adminService.deleteWishesByUserId.mockImplementation((userId) => {
  const wishesToDelete = mockData.wishes.filter(
    (wish) => wish.userId === userId
  );
  return Promise.resolve(wishesToDelete.length);
});

adminService.updateListingsBySellerId.mockImplementation((userId) => {
  const listingsToUpdate = mockData.products.filter(
    (product) => product.sellerId === userId
  );
  listingsToUpdate.forEach((listing) => {
    listing.status = "failed";
  });
  return Promise.resolve(listingsToUpdate.length);
});

adminService.deleteUserById.mockImplementation((id) => {
  const userIndex = mockData.users.findIndex((user) => user._id === id);
  if (userIndex !== -1) {
    mockData.users.splice(userIndex, 1);
  }
  return Promise.resolve(userIndex !== -1);
});

module.exports = adminService;
