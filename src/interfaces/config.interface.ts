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
  mailtrap: {
    host: string;
    port: string;
    auth: {
      user: string;
      pass: string;
    };
    domain: string;
    sendingEmail: string;
  };
}

export default IConfig;
