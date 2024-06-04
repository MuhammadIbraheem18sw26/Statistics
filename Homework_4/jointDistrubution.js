const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to compute the joint distribution
function computeJointDistribution(data, numIntervals) {
  const jointDistribution = new Array(numIntervals.length);
  for (let i = 0; i < numIntervals.length; i++) {
    jointDistribution[i] = new Array(numIntervals[i]).fill(0);
  }

  for (let i = 0; i < data[0].length; i++) {
    const indices = data.map((variable, j) => {
      const interval = Math.floor((variable[i] - Math.min(variable)) / (Math.max(variable) - Math.min(variable)) * numIntervals[j]);
      return Math.min(interval, numIntervals[j] - 1);
    });

    jointDistribution[indices]++;
  }

  return jointDistribution;
}

// Function to prompt user for data and intervals for each variable
function getDataAndIntervals(numVariables, data, numIntervals, currentIndex) {
  if (currentIndex === numVariables) {
    computeAndDisplayJointDistribution(data, numIntervals);
    rl.close();
    return;
  }

  rl.question(`Enter data for variable ${currentIndex + 1} (comma-separated values): `, (dataInput) => {
    const dataVariable = dataInput.split(',').map(x => parseFloat(x.trim()));
    data.push(dataVariable);

    rl.question(`Enter the number of intervals (class intervals) for variable ${currentIndex + 1}: `, (intervalInput) => {
      const intervals = parseInt(intervalInput);
      numIntervals.push(intervals);
      getDataAndIntervals(numVariables, data, numIntervals, currentIndex + 1);
    });
  });
}

// Function to compute and display the joint distribution
function computeAndDisplayJointDistribution(data, numIntervals) {
  const jointDistribution = computeJointDistribution(data, numIntervals);
  console.log('\nJoint Distribution:');
  console.table(jointDistribution);
}

// Main program
rl.question('Enter the number of variables: ', (numVariablesInput) => {
  const numVariables = parseInt(numVariablesInput);
  const data = [];
  const numIntervals = [];

  getDataAndIntervals(numVariables, data, numIntervals, 0);
});