/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  staticDirs: ['../public'],
  // fixed storybook webpack issue with https://github.com/storybookjs/storybook/issues/15336#issuecomment-906809203
  typescript: { reactDocgen: false },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            additionalData: `
              @import '~sass-mq';
              @import "${path.resolve(__dirname, '../src/styles/_fonts.scss')}";
              @import "${path.resolve(__dirname, '../src/styles/_variables.scss')}";
              @import "${path.resolve(__dirname, '../src/styles/_functions.scss')}";
              @import "${path.resolve(__dirname, '../src/styles/_animations.scss')}";
              @import "${path.resolve(__dirname, '../src/styles/mixins/_base.scss')}";
              @import "${path.resolve(__dirname, '../src/styles/mixins/_typography.scss')}";
            `,
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    })

    // fix font loading issue: https://github.com/storybookjs/storybook/issues/12844
    config.resolve.roots = [path.resolve(__dirname, '../public'), 'node_modules']

    // resolve typescript alias issues
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ]

    // Return the altered config
    return config
  },
}
