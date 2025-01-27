// console.js - File sederhana untuk logging ke konsol

const Console = {
  log: (message) => {
    console.log(`[LOG]: ${message}`);
  },

  info: (message) => {
    console.info(`[INFO]: ${message}`);
  },

  warn: (message) => {
    console.warn(`[WARN]: ${message}`);
  },

  error: (message) => {
    console.error(`[ERROR]: ${message}`);
  },

  debug: (message) => {
    if (process.env.DEBUG) {
      console.debug(`[DEBUG]: ${message}`);
    }
  }
};

// Contoh penggunaan
Console.log("Ini adalah pesan log biasa.");
Console.info("Ini adalah pesan informasi.");
Console.warn("Ini adalah pesan peringatan.");
Console.error("Ini adalah pesan error.");
Console.debug("Ini adalah pesan debug (hanya muncul jika DEBUG diaktifkan).");

module.exports = Console;
