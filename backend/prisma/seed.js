const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@storerating.com' },
    update: {},
    create: {
      name: 'System Administrator Account',
      email: 'admin@storerating.com',
      password: adminPassword,
      address: '123 Admin Street, Admin City, Admin State 12345',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create a sample store owner
  const ownerPassword = await bcrypt.hash('Owner@123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@beststore.com' },
    update: {},
    create: {
      name: 'Best Store Owner Full Name Here',
      email: 'owner@beststore.com',
      password: ownerPassword,
      address: '456 Store Avenue, Commerce City, State 67890',
      role: 'STORE_OWNER',
    },
  });
  console.log(`✅ Store Owner created: ${owner.email}`);

  // 5. Create a Store for the Owner with some mock products
  const store = await prisma.store.upsert({
    where: { email: 'contact@beststore.com' },
    update: {},
    create: {
      name: 'The Best Store In Town',
      email: 'contact@beststore.com',
      address: '456 Store Avenue, Commerce City, State 67890',
      ownerId: owner.id,
      products: {
        create: [
          { name: 'Fresh Apples (1kg)', description: 'Crisp and sweet apples.', price: 120.00 },
          { name: 'Basmati Rice (5kg)', description: 'Premium quality long-grain rice.', price: 450.00 },
          { name: 'Farm Milk (1L)', description: 'Fresh, organic whole milk.', price: 65.00 },
        ]
      }
    },
  });
  console.log(`✅ Store created: ${store.name}`);

  // Create a sample normal user
  const userPassword = await bcrypt.hash('User@1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      name: 'John Doe Regular User Account',
      email: 'john.doe@example.com',
      password: userPassword,
      address: '789 User Lane, Residential City, State 11111',
      role: 'USER',
    },
  });
  console.log(`✅ Normal User created: ${user.email}`);

  console.log('\n🎉 Seeding complete!');
  console.log('\nDefault credentials:');
  console.log('  Admin:       admin@storerating.com   / Admin@123');
  console.log('  Store Owner: owner@beststore.com     / Owner@123');
  console.log('  Normal User: john.doe@example.com    / User@1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
