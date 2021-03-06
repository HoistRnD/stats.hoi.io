/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['stats.hoi.io'],
  /**
   * Your New Relic license key.
   */
  license_key: '63a758a5a61e136f0a8321b94aeb99e7dcebdb4b',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    filepath: 'stdout',
    level: 'info'
  }
};