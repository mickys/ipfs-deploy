const updateCloudflareDnslink = require('dnslink-cloudflare')
const _ = require('lodash')
const fp = require('lodash/fp')
const { logger, logError } = require('../logging')

module.exports = {
  name: 'Cloudflare',
  validate: ({ apiEmail, apiKey, apiToken, zone, record } = {}) => {
    if (fp.all(_.isEmpty)([apiKey, apiEmail]) && _.isEmpty(apiToken)) {
      throw new Error(`Missing the following environment variables:

IPFS_DEPLOY_CLOUDFLARE__API_EMAIL
IPFS_DEPLOY_CLOUDFLARE__API_KEY // or...
IPFS_DEPLOY_CLOUDFLARE__API_TOKEN`)
    }

    if (fp.some(_.isEmpty)([zone, record])) {
      throw new Error(`Missing the following environment variables:

IPFS_DEPLOY_CLOUDFLARE__ZONE
IPFS_DEPLOY_CLOUDFLARE__RECORD`)
    }
  },
  link: async (domain, hash, { apiEmail, apiKey, apiToken, zone, record }) => {
    const api = {}

    if (_.isEmpty(apiKey)) {
      api.token = apiToken
    } else {
      api.email = apiEmail
      api.key = apiKey
    }

    const opts = {
      zone: zone || domain,
      record: record || `_dnslink.${domain}`,
      link: `/ipfs/${hash}`
    }

    const log = logger({})
    log.info('🔗  DNS TXT: ' + opts.record)

    const content = await updateCloudflareDnslink(api, opts)

    log.info('🔗  Website URL: https://' + domain)

    return {
      record: opts.record,
      value: content
    }
  }
}
