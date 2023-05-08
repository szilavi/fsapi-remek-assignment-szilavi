const productService = {
  findAll: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findGameByTitle: jest.fn(),
  findProductsByUserId: jest.fn(),
  findProductAndUpdate: jest.fn(),
  findAndDelete: jest.fn(),
  __setMockData: (productData, userData, gameData) => {
    mockData = {
      products: productData,
      users: userData,
      games: gameData,
    };
  },
};

let mockData;

productService.create.mockImplementation((productData) => {
  let gameId = productData.gameId;

  if (gameId === "") {
    const newGame = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: productData.title,
    };
    mockData.games.push(newGame);
    gameId = newGame._id;
  }

  const newProduct = {
    ...productData,
    gameId,
    _id: new mongoose.Types.ObjectId().toString(),
  };
  mockData.products.push(newProduct);

  return Promise.resolve(newProduct);
});

productService.findProductsByUserId.mockImplementation(async (userId) => {
  const products = mockData.products.filter(
    (product) => product.sellerId === userId && product.status === "offer"
  );

  const result = products.map((product) => {
    const game = mockData.games.find((game) => game._id === product.gameId);

    return {
      status: product.status,
      _id: product._id,
      gameTitle: game ? game.title : null,
      price: product.price,
    };
  });

  return Promise.resolve(result);
});

productService.findProductAndUpdate.mockImplementation(async (offerId) => {
  const product = mockData.products.find((product) => product._id === offerId);
  if (product) {
    product.status = "deal";
  }
  return Promise.resolve();
});

productService.findAndDelete.mockImplementation(async (offerId) => {
  const product = mockData.products.find((product) => product._id === offerId);
  if (product) {
    product.status = "failed";
  }
  return Promise.resolve();
});

productService.findAll.mockImplementation(async () => {
  const products = mockData.products.filter(
    (product) => product.status !== "failed" && product.status !== "deal"
  );

  const result = products.map((product) => {
    const game = mockData.games.find((game) => game._id === product.gameId);
    const user = mockData.users.find((user) => user._id === product.sellerId);

    return {
      ...product,
      gameId: game ? game.title : null,
      sellerId: user ? user.name : null,
    };
  });

  return Promise.resolve(result);
});

// findById()

productService.findById.mockImplementation(async (id) => {
  const product = mockData.products.find((product) => product._id === id);
  if (product) {
    const game = mockData.games.find((game) => game._id === product.gameId);
    const seller = mockData.users.find((user) => user._id === product.sellerId);

    return {
      ...game,
      ...seller,
      _id: product._id,
      price: product.price,
      condition: product.condition,
    };
  }
  throw new Error("Product not found");
});

productService.findGameByTitle.mockImplementation(async (title) => {
  const games = mockData.games.filter((game) =>
    new RegExp(title, "i").test(game.title)
  );
  return Promise.resolve(games);
});

module.exports = productService;
