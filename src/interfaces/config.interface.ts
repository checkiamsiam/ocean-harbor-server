interface IConfig {
  isDevelopment: boolean;
  port: number | string;
  jwt: {
    secret: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

export default IConfig;
