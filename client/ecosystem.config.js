module.exports = {
  apps: [{
    name: 'client',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/ansa/client',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/tmp/.pm2/logs/client-error.log',
    out_file: '/tmp/.pm2/logs/client-out.log',
    time: true,
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 5000,
    kill_timeout: 5000
  }]
};
