import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create or find categories using upsert
  const workCategory = await prisma.category.upsert({
    where: { name: "Work" },
    update: {},
    create: { name: "Work" }
  });
  
  const personalCategory = await prisma.category.upsert({
    where: { name: "Personal" },
    update: {},
    create: { name: "Personal" }
  });

  // Find your existing user (replace with your actual email)
  const user = await prisma.user.findUnique({
    where: { email: "adamcbark@gmail.com" } // Your email here
  });

  if (!user) {
    console.log("User not found! Make sure you've signed up first.");
    return;
  }

  // Create some sample tasks for your user
  await prisma.task.createMany({
    data: [
      {
        title: "Review quarterly reports",
        description: "Go through Q3 financial reports and prepare summary",
        categoryId: workCategory.id,
        userId: user.id,
        priority: true,
        status: "PENDING",
        dueDate: new Date("2025-08-25"),
      },
      {
        title: "Plan weekend trip",
        description: "Research destinations and book accommodation",
        categoryId: personalCategory.id,
        userId: user.id,
        priority: false,
        status: "IN_PROGRESS",
      },
      {
        title: "Update LinkedIn profile",
        description: "Add recent projects and update skills section",
        categoryId: workCategory.id,
        userId: user.id,
        priority: false,
        status: "PENDING",
      },
      {
        title: "Grocery shopping",
        description: "Buy ingredients for dinner party on Saturday",
        categoryId: personalCategory.id,
        userId: user.id,
        priority: true,
        status: "PENDING",
        dueDate: new Date("2025-08-23"),
      },
      {
  title: "Morning workout routine",
  description: "30 minutes of cardio and strength training",
  categoryId: personalCategory.id,
  userId: user.id,
  priority: false,
  status: "PENDING",
  dueDate: new Date("2025-08-22"),
},
{
  title: "Complete project presentation",
  description: "Finalize slides for client meeting on Friday",
  categoryId: workCategory.id,
  userId: user.id,
  priority: true,
  status: "IN_PROGRESS",
  dueDate: new Date("2025-08-24"),
},
{
  title: "Call dentist for appointment",
  description: "Schedule 6-month cleaning",
  categoryId: personalCategory.id,
  userId: user.id,
  priority: false,
  status: "PENDING",
},
{
  title: "Review team performance metrics",
  description: "Analyze Q3 KPIs and prepare feedback",
  categoryId: workCategory.id,
  userId: user.id,
  priority: true,
  status: "PENDING",
  dueDate: new Date("2025-08-26"),
},
{
  title: "Book flight for conference",
  description: "Tech conference in Seattle next month",
  categoryId: workCategory.id,
  userId: user.id,
  priority: true,
  status: "PENDING",
  dueDate: new Date("2025-08-23"),
},
{
  title: "Organize home office",
  description: "Declutter desk and organize filing system",
  categoryId: personalCategory.id,
  userId: user.id,
  priority: false,
  status: "PENDING",
},
{
  title: "Update website copy",
  description: "Refresh homepage content and fix typos",
  categoryId: workCategory.id,
  userId: user.id,
  priority: false,
  status: "IN_PROGRESS",
},
{
  title: "Learn new programming language",
  description: "Complete Go tutorial and build small project",
  categoryId: personalCategory.id,
  userId: user.id,
  priority: false,
  status: "PENDING",
},
{
  title: "Prepare budget proposal",
  description: "Draft 2025 department budget for approval",
  categoryId: workCategory.id,
  userId: user.id,
  priority: true,
  status: "PENDING",
  dueDate: new Date("2025-08-28"),
},
{
  title: "Clean out garage",
  description: "Sort items for donation and organize tools",
  categoryId: personalCategory.id,
  userId: user.id,
  priority: false,
  status: "PENDING",
},
{
  title: "Interview candidates",
  description: "Conduct final round interviews for developer position",
  categoryId: workCategory.id,
  userId: user.id,
  priority: true,
  status: "PENDING",
  dueDate: new Date("2025-08-25"),
},
{
  title: "Plan anniversary dinner",
  description: "Make reservation at favorite restaurant",
  categoryId: personalCategory.id,
  userId: user.id,
  priority: true,
  status: "PENDING",
  dueDate: new Date("2025-08-30"),
},
{
  title: "Update security protocols",
  description: "Review and update company security guidelines",
  categoryId: workCategory.id,
  userId: user.id,
  priority: true,
  status: "PENDING",
},
{
  title: "Read industry report",
  description: "Review latest market trends and competitive analysis",
  categoryId: workCategory.id,
  userId: user.id,
  priority: false,
  status: "PENDING",
},
{
  title: "Meal prep for the week",
  description: "Prepare healthy lunches and snacks",
  categoryId: personalCategory.id,
  userId: user.id,
  priority: false,
  status: "PENDING",
  dueDate: new Date("2025-08-25"),
},
{
  title: "Fix leaky faucet",
  description: "Replace washers in kitchen sink",
  categoryId: personalCategory.id,
  userId: user.id,
  priority: true,
  status: "PENDING",
},
{
  title: "Conduct code review",
  description: "Review pull requests from team members",
  categoryId: workCategory.id,
  userId: user.id,
  priority: false,
  status: "IN_PROGRESS",
},
{
  title: "Plan vacation itinerary",
  description: "Research activities and book accommodations for Italy trip",
  categoryId: personalCategory.id,
  userId: user.id,
  priority: false,
  status: "PENDING",
},
{
  title: "Backup computer files",
  description: "Create full system backup to external drive",
  categoryId: personalCategory.id,
  userId: user.id,
  priority: true,
  status: "PENDING",
},
{
  title: "Schedule team meeting",
  description: "Coordinate calendars for sprint planning session",
  categoryId: workCategory.id,
  userId: user.id,
  priority: false,
  status: "COMPLETED",
}
    ]
  });

  console.log("Seeding completed with sample tasks!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });