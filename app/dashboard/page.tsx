const DashboardPage = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard Feature Ideas</h1>
      <ul className="space-y-4">
        <li>
          <strong>Progress Bars</strong>
          <ul className="list-disc ml-6">
            <li>Overall Task Completion: Percentage of tasks completed vs. total.</li>
            <li>Next Actions Progress: Progress bar for next actions completed per task.</li>
          </ul>
        </li>
        <li>
          <strong>Key Stats</strong>
          <ul className="list-disc ml-6">
            <li>Tasks: Total, open, completed, overdue</li>
            <li>Next Actions: Total, open, completed, high priority</li>
            <li>Work Done: Total entries, work done this week/month, total hours logged</li>
          </ul>
        </li>
        <li>
          <strong>Timeframe Summaries</strong>
          <ul className="list-disc ml-6">
            <li>Work done this week/month (count and hours spent)</li>
            <li>Tasks completed this week/month (count)</li>
          </ul>
        </li>
        <li>
          <strong>Activity Feed</strong>
          <ul className="list-disc ml-6">
            <li>Recent work done entries (with timestamps)</li>
            <li>Recently completed tasks/next actions</li>
          </ul>
        </li>
        <li>
          <strong>Focus/High Priority Section</strong>
          <ul className="list-disc ml-6">
            <li>List of high priority tasks/next actions needing attention</li>
          </ul>
        </li>
        <li>
          <strong>Charts &amp; Visuals</strong>
          <ul className="list-disc ml-6">
            <li>Pie chart: Task status breakdown (open, in progress, completed)</li>
            <li>Bar chart: Work done per week/month</li>
            <li>Line chart: Productivity trend over time</li>
          </ul>
        </li>
        <li>
          <strong>Quick Actions</strong>
          <ul className="list-disc ml-6">
            <li>Button to add a new task, next action, or work done</li>
            <li>Button to start daily review</li>
          </ul>
        </li>
        <li>
          <strong>Upcoming Deadlines</strong>
          <ul className="list-disc ml-6">
            <li>List of tasks/next actions due soon or overdue</li>
          </ul>
        </li>
        <li>
          <strong>Personal Bests</strong>
          <ul className="list-disc ml-6">
            <li>Most productive day/week</li>
            <li>Longest streak of completed tasks</li>
          </ul>
        </li>
        <li>
          <strong>Search &amp; Filter</strong>
          <ul className="list-disc ml-6">
            <li>Quick search bar for tasks, next actions, work done</li>
          </ul>
        </li>
      </ul>
    </div>
  )
}
export default DashboardPage