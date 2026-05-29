require('dotenv').config();
// const packageJson = require('./package.json');

module.exports = {
  apps: [
    {
      // name: `stage-front@${packageJson.version}`,
      name: process.env.FRONTEND_PM2_STAGE_NAME || 'dr-stage-front',
      // SvelteKit adapter-node output (built with `npm run build`)
      script: './build/index.js',
      exec_mode: process.env.FRONTEND_PM2_STAGE_EXEC_MODE || 'cluster',
      instances: process.env.FRONTEND_PM2_STAGE_INSTANCES || '1',
      autorestart: true,
      watch: false,
      max_memory_restart: process.env.FRONTEND_PM2_STAGE_MAX_MEMORY_RESTART || '256M',
      env: {
        NODE_ENV: "staging",
        // adapter-node reads PORT/HOST (HOST defaults to 0.0.0.0)
        PORT: parseInt(process.env.FRONTEND_STAGE_PORT) || 3000,
        HOST: process.env.FRONTEND_STAGE_HOST || "0.0.0.0",
      }
    }
  ]
}
