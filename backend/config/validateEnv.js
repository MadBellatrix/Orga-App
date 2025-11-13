const requiredEnvVars = [
  'MONGODB_URI',
  'DATABASE',
  'JWT_SECRET',
  'NODE_ENV'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((m) => console.error(`  - ${m}`));
    process.exit(1);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
};

export default validateEnv;
