const { defineConfig } = require("@medusajs/framework/utils");
console.log(defineConfig({ admin: { disable: false } }).admin);
