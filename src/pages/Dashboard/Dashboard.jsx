import React from 'react';
import './Dashboard.css';
import icons from '../../contents/Icons';
import Chart from '../../UI/Chart/Chart';
const MetricsCard = ({ icon, title, value, growth, isPositive }) => (
  <div className="bg-white shadow-md rounded-lg p-4 flex items-center border">
    <div className="text-3xl mr-4">{icon}</div>
    <div>
      <h3 className="text-xl font-bold">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
      <span
        className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}
      >
        {growth}% {isPositive ? '↑' : '↓'}
      </span>
    </div>
  </div>
);

const ProgressBar = ({ stage, value }) => (
  <div className="mb-4 ">
    <div className='flex justify-between'>

      <span className="block text-sm font-medium mb-1">{stage}</span>
      <span className='text-sm text-gray-500'>{value} deals</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="top-bg-clr h-2 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const ActivityItem = ({ icon, description, time, amount }) => (
  <li className="flex items-start mb-4">
    <div className="text-xl mr-3">{icon}</div>
    <div>
      <p className="text-sm font-medium">{description}</p>
      <span className="text-xs text-gray-400">{amount}</span>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  </li>
);

const TaskItem = ({ description, time }) => (
  <li className="">
    <label className="flex items-center">
      <input type="checkbox" className="mr-2" />
      {/* <span className="text-sm">{task}</span> */}
      <p className="text-sm font-medium p-0 m-0">{description}</p>
    </label>
    <span className="text-xs text-gray-400 ps-8">{time}</span>

  </li>
);

const Dashboard = () => {
  const metrics = [
    { icon: '👥', title: 'Total Projects', value: '1,024', growth: 15, isPositive: true },
    { icon: '💰', title: 'Revenue', value: '$78,456', growth: -5, isPositive: false },
    { icon: '📈', title: 'Active Deals', value: '36', growth: 10, isPositive: true },
    { icon: '😊', title: 'Satisfaction', value: '94%', growth: 2, isPositive: true },
  ];

  const pipelineStages = [
    { stage: 'Inspection', value: 50 },
    { stage: 'Estimation', value: 70 },
    { stage: 'In Progress', value: 30 },
    { stage: 'Completed', value: 20 },

  ];

  const activities = [
    { icon: '✔️', description: 'Roof replacement completed for Smith Residence', amount: '$45,000 - By Sarah Wilson', time: '2 hours ago' },
    { icon: '📞', description: 'Inspection scheduled with Johnson Family', amount: 'Product Demo - Tech Solutions Inc', time: '4 hours ago' },
    { icon: '✉️', description: 'Estimate sent to Thompson Property', amount: 'Proposal Follow-up', time: '1 day ago' },
  ];
  const topcustomer = [
    { icon: '', description: 'Tech Solutions Inc', time: '$128,000 revenue' },
    { icon: '', description: 'Global Industries', time: '$128,000 revenue' },
    { icon: '', description: 'Acme Consulting', time: '$128,000 revenue' },
  ];
  const tasks = [
    { description: 'Follow up with Brown residence inspection', time: 'Due today' },
    { description: 'Order materials for Wilson project', time: 'Due tomorrow' },
    { description: 'Schedule crew for Davis roof repair', time: 'Due in 2 days' }];

  return (
    <div className="container mx-auto p-6 ">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
        {metrics.map((metric, index) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <div className='flex justify-between'>
          <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
          <select className="mb-4 p-2 border rounded">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select></div>
          <div id="salesChart" className="h-50 rounded-lg flex items-center justify-center">
            {/* Chart Placeholder */}
            <Chart />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="text-xl font-bold mb-4">Project Status</h2>
          {pipelineStages.map((stage, index) => (
            <ProgressBar key={index} {...stage} />
          ))}
        </div>
      </section>
      <div className='flex gap-4'>

        <section className="mb-8 w-1/3">
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <ul className="bg-white border rounded-lg p-6">
            {activities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </ul>
        </section>

        <section className=' w-1/3'>
          <h2 className="text-xl font-bold mb-4">Tasks</h2>
          <ul className="bg-white border rounded-lg p-6 mb-4">
            {tasks.map((task, index) => (
              <TaskItem key={index} {...task} />
            ))}
            <div className='flex items-center justify-center'>
              <button className='p-2 rounded-md mt-2 w-full top-bg-clr text-white-50'>Add Task</button>
            </div>

          </ul>
        </section>
        <section className="mb-8  w-1/3">
          <h2 className="text-xl font-bold mb-4">Top Customer</h2>
          <ul className="bg-white border rounded-lg p-6 pb-18">
            {topcustomer.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
