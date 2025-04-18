import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
const FILE_PATH = "./data.json";
const git = simpleGit();

// Define weeks with random commit patterns (some days will have 0 commits)
const COMMIT_PATTERNS = [
  // 18 weeks ago
  {
    weekAgo: 18,
    pattern: [0, 8, 0, 7, 3, 0, 5], // 23 commits
  },
  // 19 weeks ago
  {
    weekAgo: 19,
    pattern: [6, 0, 11, 0, 4, 2, 9], // 23 commits
  },
  // 20 weeks ago
  {
    weekAgo: 20,
    pattern: [5, 9, 0, 6, 0, 8, 4], // 27 commits
  },
];

async function makeCommits() {
  try {
    // Process each week
    for (const week of COMMIT_PATTERNS) {
      console.log(`\nProcessing week from ${week.weekAgo} weeks ago:`);

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const commitsToday = week.pattern[dayIndex];
        if (commitsToday === 0) continue; // Skip days with no commits

        const daysAgo = week.weekAgo * 7 + dayIndex;
        const dateStr = moment().subtract(daysAgo, "days").format("YYYY-MM-DD");
        console.log(`Creating ${commitsToday} commits for ${dateStr}`);

        for (let j = 0; j < commitsToday; j++) {
          // Add some randomness to the time of day for each commit
          const randomHour = Math.floor(Math.random() * 12) + 8; // Between 8 AM and 8 PM
          const randomMinute = Math.floor(Math.random() * 60);
          const date = moment()
            .subtract(daysAgo, "days")
            .hour(randomHour)
            .minute(randomMinute)
            .format();

          const data = {
            date: date,
            index: j,
            week: week.weekAgo,
            message: `Update ${j + 1} for ${dateStr}`,
          };

          await jsonfile.writeFile(FILE_PATH, data);
          await git.add([FILE_PATH]);
          await git.commit(`Update for ${dateStr}`, { "--date": date });
        }
      }
    }

    // Push all commits at once
    await git.push();
    console.log("\nAll commits pushed successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the async function
makeCommits();
