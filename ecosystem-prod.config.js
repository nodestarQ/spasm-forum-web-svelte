require('dotenv').config();
// const packageJson = require('./package.json');

module.exports = {
  apps: [
    {
      // name: `prod-front@${packageJson.version}`,
      name: process.env.FRONTEND_PM2_PROD_NAME || 'dr-prod-front',
      // SvelteKit adapter-node output (built with `npm run build`)
      script: './build/index.js',
      exec_mode: process.env.FRONTEND_PM2_PROD_EXEC_MODE || 'cluster',
      instances: process.env.FRONTEND_PM2_PROD_INSTANCES || 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: process.env.FRONTEND_PM2_PROD_MAX_MEMORY_RESTART || '1G',
      env: {
        NODE_ENV: "production",
        // adapter-node reads PORT/HOST (HOST defaults to 0.0.0.0)
        PORT: parseInt(process.env.FRONTEND_PROD_PORT) || 3000,
        HOST: process.env.FRONTEND_PROD_HOST || "0.0.0.0",
      }
    }
  ]
}
