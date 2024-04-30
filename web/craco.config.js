const path = require('path');
const CracoAlias = require("craco-alias");

module.exports = {

  devServer: {
    devMiddleware: {
        writeToDisk: true,
    },
  },

  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "options",
        aliases: {
          '@sharedTypes': path.resolve(__dirname, "../types"),
        },
      }
    }
  ],

  webpack: {
    // alias: {
    //   '@sharedTypes': path.resolve(__dirname, "../types"),
    // },
    configure: webpackConfig => {
      // const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
      //   ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      // );

      // webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      webpackConfig['resolve'] = {
        fallback: {
          crypto: require.resolve("crypto-browserify"),
          buffer: require.resolve("buffer/"),
          stream: require.resolve("stream-browserify")
        },
        // TODO: figure out why this is needed
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      }

      webpackConfig.module.rules.push({
        test: /\.(ts)$/,
        include: [
          path.resolve(__dirname, "../types"),
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-typescript"],
          },
        },
      });

      return webpackConfig;
    },
  },
};