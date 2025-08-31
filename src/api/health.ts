// Health check endpoint for deployment verification
export const healthCheck = {
  status: 'ok',
  message: 'LinkedIn Post Generator is running',
  timestamp: new Date().toISOString(),
  version: '1.0.0'
};

// This can be used by hosting providers for health checks
if (typeof window === 'undefined') {
  // Server-side health check logic if needed
  console.log('Health check: Application is healthy');
}