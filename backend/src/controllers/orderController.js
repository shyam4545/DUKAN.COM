const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Check if already in cart
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId: parseInt(productId) } }
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (quantity || 1) }
      });
      return res.json({ message: 'Cart updated', cartItem: updated });
    }

    const cartItem = await prisma.cartItem.create({
      data: { userId: req.user.id, productId: parseInt(productId), quantity: quantity || 1 }
    });
    return res.status(201).json({ message: 'Added to cart', cartItem });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to add to cart' });
  }
};

// Get cart
const getCart = async (req, res) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { store: true } } }
    });
    return res.json({ cart });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to get cart' });
  }
};

// Update cart item
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const item = await prisma.cartItem.findUnique({ where: { id: parseInt(id) } });
    if (!item || item.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: parseInt(id) } });
      return res.json({ message: 'Removed from cart' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: parseInt(id) },
      data: { quantity }
    });
    return res.json({ message: 'Cart updated', cartItem: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update cart' });
  }
};

// Checkout / Place Order
const placeOrder = async (req, res) => {
  try {
    // A simplified checkout: groups cart items by store and creates an order per store
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // Group by storeId
    const storeGroups = {};
    cartItems.forEach(item => {
      if (!storeGroups[item.product.storeId]) storeGroups[item.product.storeId] = [];
      storeGroups[item.product.storeId].push(item);
    });

    const orders = [];
    for (const storeId of Object.keys(storeGroups)) {
      const items = storeGroups[storeId];
      let total = 0;
      const orderItemsData = items.map(item => {
        const lineTotal = Number(item.product.price) * item.quantity;
        total += lineTotal;
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        };
      });

      const order = await prisma.order.create({
        data: {
          userId: req.user.id,
          storeId: parseInt(storeId),
          totalAmount: total,
          status: 'PENDING',
          items: { create: orderItemsData }
        }
      });
      orders.push(order);
    }

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

    return res.status(201).json({ message: 'Order placed successfully', orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to place order' });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { store: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ orders });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get Owner Orders
const getOwnerOrders = async (req, res) => {
  try {
    const store = await prisma.store.findUnique({ where: { ownerId: req.user.id } });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const orders = await prisma.order.findMany({
      where: { storeId: store.id },
      include: { user: { select: { name: true, email: true, address: true } }, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ orders });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Update Order Status (Owner)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const store = await prisma.store.findUnique({ where: { ownerId: req.user.id } });
    const order = await prisma.order.findUnique({ where: { id: parseInt(id) } });

    if (!store || !order || order.storeId !== store.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updated = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    return res.json({ message: 'Order updated', order: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update order' });
  }
};

module.exports = {
  addToCart, getCart, updateCartItem, placeOrder,
  getUserOrders, getOwnerOrders, updateOrderStatus
};
