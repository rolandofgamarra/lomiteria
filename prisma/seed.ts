import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ZarfPizzas - OFFICIAL 2026 MENU UPDATE...");

  // --- 1. USERS ---
  const passwordHash = await bcrypt.hash("zarf123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash, role: "ADMIN" },
  });
  await prisma.user.upsert({
    where: { username: "waiter1" },
    update: {},
    create: { username: "waiter1", passwordHash, role: "WAITER" },
  });

  // --- 2. TABLES ---
  const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  await Promise.all(
    tables.map((n) =>
      prisma.table.upsert({
        where: { number: n },
        update: {},
        create: { number: n, status: "AVAILABLE", capacity: 4 },
      })
    )
  );

  // --- 3. EXTRAS (Agregados) ---
  await prisma.productExtra.deleteMany({});
  await prisma.productExtra.createMany({
    data: [
      { name: "Agregado Pizza (Bacon/Queso/etc)", price: 5000 },
      { name: "Agregado Lomitería (Huevo/Queso/etc)", price: 3000 },
    ],
  });

  // --- 4. CATEGORIES ---
  const categories = [
    { name: "Pizzas Especiales" },
    { name: "Pizzas Tradicionales" },
    { name: "Papas" },
    { name: "Bebidas" },
    { name: "Lomitería" },
  ];

  const createdCategories = await Promise.all(
    categories.map((c) =>
      prisma.category.upsert({
        where: { name: c.name },
        update: {},
        create: c,
      })
    )
  );

  const getCatId = (name: string) => createdCategories.find((c) => c.name === name)!.id;

  // --- 5. PRODUCTS ---
  
  // PIZZAS ESPECIALES
  const pizzasEspeciales = [
    { name: "Borde 1 sabor", price: 55000 },
    { name: "Borde 2 sabores", price: 60000 },
    { name: "BORDE SUPREMA DE LOMITO", price: 60000 },
    { name: "BORDE SUPREMA DE POLLO", price: 60000 },
    { name: "BORDE PANCETA CATUPIRY", price: 60000 },
    { name: "BORDE LOMITO CATUPIRY", price: 60000 },
    { name: "BORDE MEXICANA", price: 60000 },
    { name: "BORDE POLLO CATUPIRY", price: 60000 },
    { name: "SUPREMA DE LOMITO", price: 50000 },
    { name: "PANCETA CATUPIRY", price: 50000 },
    { name: "NAPOLITANA CATUPIRY", price: 40000 },
    { name: "LOMITO CATUPIRY", price: 50000 },
    { name: "POLLO CATUPIRY", price: 50000 },
    { name: "CHOCLO CON CATUPIRY", price: 40000 },
    { name: "SUPREMA DE POLLO", price: 50000 },
    { name: "VEGETARIANA", price: 40000 },
    { name: "ROMANA", price: 40000 },
    { name: "JAMÓN Y MORRONES", price: 35000 },
    { name: "AMERICANA", price: 40000 },
    { name: "PRIMAVERA", price: 40000 },
    { name: "DOBLE PEPPERONI", price: 40000 },
    { name: "PALMITO Y ROQUEFORT", price: 40000 },
    { name: "MEXICANA", price: 50000 },
    { name: "FRANCESA", price: 40000 },
    { name: "LOMIPIZZA (4 PORCIONES)", price: 50000 },
    { name: "LOMIPIZZA (8 PORCIONES)", price: 90000 },
  ];

  // PIZZAS TRADICIONALES
  const pizzasTradicionales = [
    { name: "Borde 1 sabor (Trad)", price: 50000 },
    { name: "Borde 2 sabores (Trad)", price: 55000 },
    { name: "BORDE MUZZA", price: 45000 },
    { name: "MUZZARELLA", price: 30000 },
    { name: "MUZZARELLA DOBLE", price: 35000 },
    { name: "PEPPERONI", price: 35000 },
    { name: "PALMITO", price: 35000 },
    { name: "CATUPIRY", price: 35000 },
    { name: "4 QUESOS", price: 40000 },
    { name: "CHAMPIÑON", price: 40000 },
    { name: "NAPOLITANA", price: 35000 },
    { name: "JAMON Y QUESO", price: 35000 },
    { name: "CHOCLO", price: 35000 },
    { name: "PANCETA", price: 45000 },
    { name: "TOMATE CATUPIRY", price: 35000 },
    { name: "MARGARITA", price: 35000 },
    { name: "ATÚN", price: 40000 },
  ];

  // PAPAS
  const papas = [
    { name: "PAPA MEDIANA", price: 10000 },
    { name: "PAPA GRANDE", price: 20000 },
    { name: "PAPA CHEDDAR Y CATUPIRY", price: 18000 },
    { name: "PAPA CHEDDAR Y CATUPIRY G", price: 30000 },
    { name: "PAPA CHEDDAR Y PANCETA", price: 18000 },
    { name: "PAPA CHEDDAR Y PANCETA G", price: 30000 },
  ];

  // BEBIDAS
  const bebidas = [
    { name: "VASO DE CAIPIRIÑA", price: 18000 },
    { name: "JARRA DE CAIPIRIÑA", price: 30000 },
    { name: "VASO DE SANGRÍA", price: 18000 },
    { name: "JARRA DE SANGRÍA", price: 30000 },
    { name: "VASO DE FERNET", price: 15000 },
  ];

  // LOMITERÍA
  const lomiteria = [
    { name: "HAMBURGUESA KIDS", price: 10000 },
    { name: "HAMBURGUESA", price: 15000 },
    { name: "HAMBURGUESA DOBLE CARNE", price: 25000 },
    { name: "HAMBURGUESA AMERICANA", price: 20000 },
    { name: "HAMBURGUESA ESPECIAL", price: 25000 },
    { name: "LOMITO COMPLETO", price: 25000 },
    { name: "LOMITO DOBLE CARNE", price: 37000 },
    { name: "LOMITO ESPECIAL", price: 35000 },
    { name: "LOMITO AMERICANO", price: 32000 },
    { name: "LOMITO ESPAÑOL", price: 32000 },
    { name: "SÁNDWICH DE POLLO", price: 20000 },
    { name: "ÁRABE MIXTO", price: 26000 },
    { name: "ÁRABE DE POLLO", price: 26000 },
    { name: "ÁRABE DE CARNE", price: 33000 },
    { name: "ÁRABE MIXTO ESPECIAL", price: 33000 },
    { name: "ÁRABE DE CARNE ESPECIAL", price: 38000 },
    { name: "ÁRABE VEGETARIANO", price: 23000 },
    { name: "TACO MEXICANO", price: 33000 },
    { name: "CHIVITO URUGUAYO MIXTO", price: 45000 },
    { name: "CHIVITO URUGUAYO AL PLATO MIXTO", price: 45000 },
    { name: "CHIVITO AL PLATO DE CARNE", price: 33000 },
    { name: "CHIVITO URUGUAYO DE CARNE", price: 50000 },
  ];

  const insertProducts = async (list: { name: string, price: number }[], catId: number) => {
    return prisma.product.createMany({
      data: list.map((p) => ({
        name: p.name,
        price: p.price,
        categoryId: catId,
      })),
    });
  };

  // CLEAN START
  await prisma.orderItemExtra.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  await insertProducts(pizzasEspeciales, getCatId("Pizzas Especiales"));
  await insertProducts(pizzasTradicionales, getCatId("Pizzas Tradicionales"));
  await insertProducts(papas, getCatId("Papas"));
  await insertProducts(bebidas, getCatId("Bebidas"));
  await insertProducts(lomiteria, getCatId("Lomitería"));

  console.log("✅ Seeding complete. All ZarfPizzas 2026 prices synced.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
