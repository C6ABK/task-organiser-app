import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create users and get their IDs
  const alice = await prisma.user.create({
    data: { firstName: "Colin", lastName: "Smith", email: "colin@example.com" }
  });
  const bob = await prisma.user.create({
    data: { firstName: "Rebecca", lastName: "Brown", email: "rebecca@example.com" }
  });
  const charlie = await prisma.user.create({
    data: { firstName: "Bill", lastName: "Davis", email: "bill@example.com" }
  });

//   // Create tasks using string IDs
//   await prisma.task.createMany({
//     data: [
//       { title: "Task 1", description: "Description for Task 1", categoryId: "categoryId1", userId: alice.id },
//       { title: "Task 2", description: "Description for Task 2", categoryId: "categoryId2", userId: bob.id },
//       { title: "Task 3", description: "Description for Task 3", categoryId: "categoryId3", userId: charlie.id },
//     ],
//   });

  console.log("Seeding completed.");
}

main();