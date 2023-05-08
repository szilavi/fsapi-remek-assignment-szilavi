const adminService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  __setMockData: (productData, userData, gameData) => {
    mockData = {
      products: productData,
      users: userData,
      games: gameData,
    };
  },
};

let mockData;

adminService.findAll.mockImplementation(async () => {
  const usersWithRole = mockData.users.filter((user) => user.role === 1);
  const userIds = usersWithRole.map((user) => user._id);

  const products = mockData.products.filter(
    (product) =>
      userIds.includes(product.sellerId) && product.status === "offer"
  );

  return products.map((product) => {
    const game = mockData.games.find((game) => game._id.equals(product.gameId));
    const user = mockData.users.find((user) =>
      user._id.equals(product.sellerId)
    );

    return {
      ...product,
      gameId: game ? [game.title] : [],
      sellerId: user ? [user.name] : [],
    };
  });
});

adminService.findById.mockImplementation(async (id) => {
  const product = mockData.products.find((product) => product._id === id);

  if (!product) {
    return null;
  }

  const gameId = product.gameId;
  const sellerId = product.sellerId;

  const { price, added, condition } = product;

  const game = mockData.games.find((game) => game._id === gameId);
  const seller = mockData.users.find((user) => user._id === sellerId);

  return { ...game, ...seller, price, added, condition };
});

module.exports = adminService;
