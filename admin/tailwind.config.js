module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Add paths to all your source files
    './public/index.html',        // If your HTML files are in the public folder
  ],
  theme: {
    extend: {
      colors: {
        'primary':"#5F6FFF",
      }
      
    },
  },
  plugins: [],
};
