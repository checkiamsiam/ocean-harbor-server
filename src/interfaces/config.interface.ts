interface IConfig {
  isDevelopment: boolean;
  port: number | string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

export default IConfig;
