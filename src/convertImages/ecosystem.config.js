// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "convert base 64",
      script: "convertImagesToBase64CPU.mjs", // Replace with your script filename
      instances: "max", // Let PM2 manage the number of instances
      exec_mode: "cluster", // Use cluster mode
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time: true,
    },
  ],
};
