import type { Task } from "@/types";
import moment from "moment";

const today = moment();

// baseTasks will now be of type Task[] and include manually defined taskCode
const baseTasks: Task[] = [
  {
    id: "1",
    taskCode: "TASK001",
    title: "Design New Homepage Mockup",
    description:
      "Create three different mockup designs for the new homepage. Focus on modern UI/UX principles and mobile responsiveness.",
    status: "Todo",
    createdAt: today.clone().subtract(5, "days").toISOString(),
    updatedAt: today.clone().subtract(2, "days").toISOString(),
  },
  {
    id: "2",
    taskCode: "TASK002",
    title: "Finalize Q3 Report Figures",
    description:
      "Review all department data and compile the final figures for the Q3 financial report. Double-check for discrepancies.",
    status: "In Progress",
    createdAt: today.clone().subtract(3, "days").toISOString(),
    updatedAt: today.clone().subtract(1, "hour").toISOString(),
  },
  {
    id: "3",
    taskCode: "TASK003",
    title: "Deploy Feature X to Staging",
    description:
      "Merge the feature branch, run all tests, and deploy the new Feature X to the staging environment for QA testing.",
    status: "In Progress",
    createdAt: today.clone().subtract(1, "day").toISOString(),
    updatedAt: today.clone().subtract(30, "minutes").toISOString(),
  },
  {
    id: "4",
    taskCode: "TASK004",
    title: "Evaluate New CRM Software (Archived)",
    description:
      "Initial evaluation of new CRM software options. Project was archived due to budget constraints.",
    status: "Done",
    createdAt: today.clone().subtract(10, "days").toISOString(),
    updatedAt: today.clone().subtract(7, "days").toISOString(),
  },
  {
    id: "5",
    taskCode: "TASK005",
    title: "Write Documentation for API V2",
    description:
      "Document all new endpoints, authentication methods, and rate limits for the upcoming API V2 release.",
    status: "Done",
    createdAt: today.clone().subtract(7, "days").toISOString(),
    updatedAt: today.clone().subtract(4, "days").toISOString(),
  },
  {
    id: "6",
    taskCode: "TASK006",
    title: "Plan Team Offsite Event",
    description:
      "Organize a team-building offsite event for Q4. Includes venue selection, activity planning, and budget management.",
    status: "Todo",
    createdAt: today.clone().subtract(2, "days").toISOString(),
    updatedAt: today.clone().subtract(2, "days").toISOString(),
  },
  {
    id: "7",
    taskCode: "TASK007",
    title: "User Acceptance Testing for Mobile App",
    description:
      "Coordinate and execute UAT phase for the new mobile application. Collect and prioritize feedback.",
    status: "In Progress",
    createdAt: today.clone().subtract(4, "hours").toISOString(),
    updatedAt: today.clone().subtract(1, "hour").toISOString(),
  },
  {
    id: "8",
    taskCode: "TASK008",
    title: "Onboard New Marketing Manager",
    description:
      "Prepare onboarding materials and schedule introduction meetings for the new marketing manager.",
    status: "Done",
    createdAt: today.clone().subtract(1, "week").toISOString(),
    updatedAt: today.clone().subtract(1, "week").add(2, "days").toISOString(),
  },
  {
    id: "9",
    taskCode: "TASK009",
    title: "Security Audit of AWS Infrastructure",
    description:
      "Conduct a comprehensive security audit of all AWS services and configurations.",
    status: "Todo",
    createdAt: today.clone().subtract(6, "hours").toISOString(),
    updatedAt: today.clone().subtract(6, "hours").toISOString(),
  },
  {
    id: "10",
    taskCode: "TASK010",
    title: "Refactor User Authentication Module",
    description:
      "Improve the security and performance of the user authentication module by refactoring legacy code.",
    status: "In Progress",
    createdAt: today.clone().subtract(2, "days").add(3, "hours").toISOString(),
    updatedAt: today.clone().subtract(1, "day").toISOString(),
  },
  {
    id: "11",
    taskCode: "TASK011",
    title: "Prepare Presentation for Investors Meeting",
    description:
      "Create a compelling presentation deck for the upcoming investors meeting, highlighting recent achievements and future roadmap.",
    status: "Done",
    createdAt: today.clone().subtract(9, "days").toISOString(),
    updatedAt: today.clone().subtract(3, "days").toISOString(),
  },
  {
    id: "12",
    taskCode: "TASK012",
    title: "Migrate Database to New Server (Archived)",
    description:
      "Plan and execute the migration of the primary database to a new, more powerful server. Project archived due to resource reallocation.",
    status: "Done",
    createdAt: today.clone().subtract(15, "days").toISOString(),
    updatedAt: today.clone().subtract(12, "days").toISOString(),
  },
];

// mockTasks can now directly be baseTasks as it's already Task[]
export const mockTasks: Task[] = baseTasks;
