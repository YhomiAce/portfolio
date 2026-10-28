/** `GET /api/health`: liveness plus a database round-trip. Public. */
export default {
  routes: [
    {
      method: 'GET',
      path: '/health',
      handler: 'health.check',
      config: { auth: false, policies: [] },
    },
  ],
};
