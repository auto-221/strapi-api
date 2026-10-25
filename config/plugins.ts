const config = () => ({
  upload: {
    config: {
      sizeLimit: 50 * 1024 * 1024, // 50MB max per file
    },
  },
});

export default config;
