import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import path from 'path';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
//타입스크립트 블로킹형식으로 체크 하는데 동시에 돌아갈 수 있게 해줌 (성능 좋아짐)
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { findSourceMap } from 'module';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isDevelopment = process.env.NODE_ENV !== 'production';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  name: 'sleact-1',
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], //바벨이 처리할 확장자 목록
    alias: {
      '@hooks': path.resolve(__dirname, 'hooks'), // .../../../ 없애는거 (typescript, webpack 둘다 해 줘야함)
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader', //바벨로더가 타입스트립트를 자바스크립트로
        options: {
          presets: [
            [
              '@babel/preset-env', //어느브라우저에서나 돌아가게 해줌 (유용하게쓰임)
              {
                targets: { browsers: ['last 2 chrome versions'] }, //최신크롬 지원하도록
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react', //리액트 코드 바꿔줌
            '@babel/preset-typescript',
          ],
          //핫리로딩 하기 위해 (npm run dev)
          env: {
            development: {
              //@emotion 클래스 네임 ${}적용가능
              plugins: [['@emotion', { sourceMap: true }], require.resolve('react-refresh/babel')],
            },
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    //ts, webpack 동시에 돌아가게끔
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }), //NODE.ENV 를 사용할 수 있게 해줌
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
  },
  devServer: {
    historyApiFallback: true, // react router
    port: 3090,
    publicPath: '/dist/',
    proxy: {
      '/api/': {
        target: 'http://localhost:3095',
        changeOrigin: true,
      },
    },
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}
if (!isDevelopment && config.plugins) {
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;
