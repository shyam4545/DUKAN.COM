const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products for the logged in owner's store
const getOwnerProducts = async (req, res) => {
  try {
    const store = await prisma.store.findUnique({ where: { ownerId: req.user.id } });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const products = await prisma.product.findMany({ where: { storeId: store.id } });
    return res.json({ products });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    let imageUrl = req.body.imageUrl; // fallback to text URL if provided
    
    if (req.file) {
      imageUrl = `/uploads/products/${req.file.filename}`;
    }

    const store = await prisma.store.findUnique({ where: { ownerId: req.user.id } });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // price comes in as a string from FormData, convert to float
    const parsedPrice = parseFloat(price);

    const product = await prisma.product.create({
      data: { name, description, price: parsedPrice, imageUrl, storeId: store.id }
    });
    return res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create product' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/products/${req.file.filename}`;
    }
    
    // Verify ownership
    const product = await prisma.product.findUnique({ where: { id: parseInt(id) }, include: { store: true } });
    if (!product || product.store.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const dataToUpdate = { name, description };
    if (price !== undefined) dataToUpdate.price = parseFloat(price);
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });
    return res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update product' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id: parseInt(id) }, include: { store: true } });
    if (!product || product.store.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.product.delete({ where: { id: parseInt(id) } });
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};

// Get products for a specific store (for users)
const getStoreProducts = async (req, res) => {
  try {
    const { id } = req.params; // store id
    const products = await prisma.product.findMany({ where: { storeId: parseInt(id) } });
    return res.json({ products });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
};

module.exports = {
  getOwnerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getStoreProducts
};
