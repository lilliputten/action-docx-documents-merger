// @ts-check

const path = require('path');
const Dotenv = require('dotenv-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const prettier = require('prettier');

class PrettifyHtmlPlugin {
  /**
   * @param {{ hooks: { compilation: { tap: (arg0: string, arg1: (compilation: any) => void) => void; }; }; }} compiler
   */
  apply(compiler) {
    compiler.hooks.compilation.tap('PrettifyHtmlPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'PrettifyHtmlPlugin',
        async (data, cb) => {
          try {
            data.html = await prettier.format(data.html, {
              parser: 'html',
              printWidth: 80,
              tabWidth: 2,
              useTabs: false,
              semi: true,
              singleQuote: true,
              trailingComma: 'es5',
            });
          } catch (error) {
            console.error('Error prettifying HTML:', error);
          }
          cb(null, data);
        },
      );
    });
  }
}

const buildFolder = 'build';

module.exports = /**
 * @param {Record<string, string>} _env
 * @param {Record<string, string>} argv
 */ (_env, argv) => {
  // const DATASET = process.env.DATASET || '';
  // if (DATASET) {
  //   console.log('DATASET:', DATASET);
  // }
  const isDev = argv.mode === 'development';
  return {
    mode: 'development',
    entry: './src/main.tsx',
    devtool: isDev ? 'eval-cheap-source-map' : 'source-map',
    optimization: {
      minimize: !isDev,
    },
    output: {
      path: path.resolve(__dirname, buildFolder),
      filename: 'bundle/scripts.[fullhash:8].js',
      clean: true,
      assetModuleFilename: '[path][name][ext]',
      // publicPath: '/',
    },
    performance: {
      hints: false, // Disable performance hints completely
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    devServer: {
      open: false,
      compress: true,
      hot: true,
      liveReload: true,
      // contentBase: './static',
      watchFiles: ['*.html', 'src/styles/*.scss', 'src/styles/*.css'],
      port: 3000,
      static: {
        directory: path.join(__dirname, 'static'), // Assuming your public files are in a 'public' directory at the project root
        publicPath: '/static', // Serve these files at the root URL
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(sa|sc)ss$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
                sassOptions: {
                  // Add any specific options here if needed
                },
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(pdf|docx|doc)$/i,
          type: 'asset',
        },
        {
          test: /\.mp4$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'video',
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new Dotenv(),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'bundle/styles.[fullhash:8].css',
      }),
      new CopyWebpackPlugin({
        patterns: /** @type {import('copy-webpack-plugin').Pattern[]} */ (
          [
            {
              from: path.resolve(__dirname, 'static/js'),
              to: path.resolve(__dirname, buildFolder, 'static/js'),
            },
            {
              from: path.resolve(__dirname, 'public'),
              to: path.resolve(__dirname, buildFolder),
            },
            // // Only helps devServer to stable serve static assets (even after hotReload)
            // isDev && {
            //   from: path.resolve(__dirname, 'static'),
            //   to: path.resolve(__dirname, buildFolder, 'static'),
            // },
          ].filter(Boolean)
        ),
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.ejs',
        filename: 'index.html',
        minify: false,
        templateParameters: {
          APP_TITLE: process.env.APP_TITLE,
          APP_DESCRIPTION: process.env.APP_DESCRIPTION,
        },
        /* // @see https://github.com/jantimon/html-webpack-plugin?tab=readme-ov-file#minification
         * minify: {
         *   collapseWhitespace: false,
         *   removeComments: false,
         *   removeRedundantAttributes: false,
         *   removeScriptTypeAttributes: false,
         *   removeStyleLinkTypeAttributes: false,
         *   useShortDoctype: false,
         *   keepClosingSlash: true,
         *   minifyJS: false,
         *   minifyCSS: false,
         *   preserveLineBreaks: true,
         *   collapseBooleanAttributes: false,
         * },
         */
      }),
      new PrettifyHtmlPlugin(),
    ],
  };
};
