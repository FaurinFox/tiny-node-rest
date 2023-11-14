import https from 'https'; // Change every occurance of https to http if needed, and vice versa
import config from './conf.json' assert {type: 'json'};

const isValidNumber = (value) => !isNaN(Number(value));

const performGetRequest = (days) => {
  const url = `https://${config.requesterConfig.targetHost}/sl-cda?days=${days}&secret=${config.secret}`;

  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Unexpected response: ${res.statusCode}, ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

const main = async () => {
  // Check if a argument is provided
  if (process.argv.length < 3) {
    console.error('Please provide a number as a command line argument.');
    process.exit(1);
  }

  // Extract argument and validate it
  const daysArg = process.argv[2];
  if (!isValidNumber(daysArg)) {
    console.error('Invalid number provided.');
    process.exit(1);
  }

  try {
    const responseData = await performGetRequest(Number(daysArg));
    console.log('Response:', responseData);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

main();
