const path = require('path')
const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    prependData: `
          @import "@/styles/_fonts.scss";
          @import "@/styles/_variables.scss";
          @import "@/styles/_functions.scss";
          @import "@/styles/_animations.scss";
          @import "@/styles/mixins/_base.scss";
          @import "@/styles/mixins/_typography.scss";
          @import '~sass-mq';
        `,
  },

  webpack(config) {
    // glsl support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    })
    return config
  },
}

module.exports = withPlugins([[withBundleAnalyzer]], nextConfig)
