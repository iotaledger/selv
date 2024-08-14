const path = require('path');
const CracoAlias = require("craco-alias");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// console.log(process.env);

module.exports = {

  devServer: {
    port: 9000,
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
          '@shared': path.resolve(__dirname, "../shared"),
        },
      }
    },
  ],

  webpack: {
    // alias: {
    //   '@shared': path.resolve(__dirname, "../shared"),
    // },

    plugins: [ 
      // new Dotenv({
      //   path: '.../.env',
      // })
      // Use BundleAnalyzer to inspect bundle
      // new BundleAnalyzerPlugin({ analyzerMode: "server" })
    ],

    configure: webpackConfig => {


      // const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
      //   ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      // );

      // webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      webpackConfig['resolve'] = {
        fallback: {
          //crypto: require.resolve("crypto-browserify"),
          buffer: require.resolve("buffer/"),
          stream: require.resolve("stream-browserify")
        },
        // TODO: figure out why this is needed
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      }

      webpackConfig.module.rules.push({
        test: /\.(ts)$/,
        include: [
          path.resolve(__dirname, "../shared/types"),
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