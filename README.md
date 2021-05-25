# sleact
sleact 채널 클론 코딩 



<h1>sleact 📲 </h1>

![Group 5 (1)](https://user-images.githubusercontent.com/61695175/119512434-4389de00-bdae-11eb-88cf-59a1ef10310f.png)

## Getting Started
관련 백엔드는 미리 만들어둔 api를 사용합니다.

## ✔ Prerequisites
#### 프로젝트 초기 세팅 ( CRA없이 )

#### ✔Installing
npm 패키지를 initialize 하기 => npm init

react사용 => npm i react
react를 웹에서 그려줄 react-dom 도설치

typescript 를 사용한다면,,!
typescript @types/react @types/react-dom

package.json 프로젝트 package 정보, 다운받은 npm package의 버전정보 
node_modules엔 다운받은 패키지의 의존하고 있는 패키지가 모두 다운로드 된다.
package-lock.json 에서 확인하며 의존성 버전체크시 오류가 날때 여기서 확인 할 수 있다.

eslint, prettier 세팅하기
npm i -D eslint preittier 
eslint-plugin-prettier eslint-config-prettier (eslint 와 prettier를 연결해줄 플러그인 다운)

.prettierrc (prettier.json) (리눅스쪽에선 숨김파일 이라는 의미..)
확장자가 없고 앞에 .이 붙은 애들은 보통 설정파일 
```
{
  "printWidth": 120, //한줄에 최대길이 설정
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true
}

```
.eslintrc 가장 기본이 되는 설정을 함 (프리티어가 추천하는 대로 따르겠다는 의미)
````{ "extents":["plugin:prettier/recommended"] } ````

타입스크립트 설정파일 
tsconfig.json 
````
{
  "compilerOptions": {
    "esModuleInterop": true, 
    //import * as React from 'react; < 이런식으로 써야 하지만 import React from 'react' 가능하게함 
    "sourceMap": true, //에러위치 찾아줌
    "lib": ["ES2020", "DOM"], // 최신문법
    "jsx": "react",
    "module": "commonJs", //최신모듈 (commonJS AMD ...)
    "moduleResolution": "Node", //노드가 해석할 수 있게
    "target": "es5", //  lib에 적어논 최신문법으로 쓰더라도 es5 로 변환
    "strict": true, //필수!
    "resolveJsonModule": true, // import json 허락
    "baseUrl": ".",
    "paths": {
      "@hooks/*": ["hooks/*"],
      "@components/*": ["components/*"],
      "@layouts/*": ["layouts/*"],
      "@pages/*": ["pages/*"],
      "@utils/*": ["utils/*"],
      "@typings/*": ["typings/*"]
    }
  }
}
//이미지나 css 파일 해석을 위해 typescript -> babel 로 넘겨주는 형태로 많이 함
````

### ✔Installing
babel, webpack 세팅전 설치되어야 할 npm
webpack, @babel/core babel-loader @babel/preset-env @babel/preset-react

타입스크립트사용시
@types/webpack @types/node @babel/preset-typescript

스타일로더
style-loader css-loader

## babel과 webpack 설정
웹팩에 타입스크립트를 받아서 > babel로 처리 > 자바스크립트로 만든다.

webpack.config.ts
````
const config: Configuration = {
  name: 'sleact', // 웹팩 설정 이름
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], //바벨이 처리할 확장자 목록
    alias: {
      '@hooks': path.resolve(__dirname, 'hooks'), // .../../../ 없애는거 (tsconfig.json, webpack 둘다 해 줘야함)
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client',   // ./app.tsx 메인이 될 파일이름
    //app2: './client', //entry를 두개이상이 될 수도 있다. 
  },
    module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader', //tsx 파일에 대해서 바벨로더가 타입스트립트를 자바스크립트로
        options: {
          presets: [ //바꿔줄때 바벨에대한 설정
            [
              '@babel/preset-env', //설정한 브라우저에서나 돌아가게 해줌 (유용하게쓰임)
              {
                targets: { browsers: ['last 2 chrome versions', 'IE11'] }, //최신크롬 지원하도록 (어떤 브라우저에 대응할지 설정)
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react', //리액트 코드 바꿔줌
            '@babel/preset-typescript', //타입스크립트 코드 바꿔줌
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
       //바벨은 css 파일도 javascript 로 바꿔준다.
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'], 
      },
    ],
  },
    plugins: [
    //타입스크립트 검사할때 블로킹식으로 해서 하나씩하게 되는데 ts, webpack 동시에 돌아가게끔해서 성능이 좋아짐
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    // 공통적인 것 리액트에서 NODE_ENV라는 변수를 사용 할 수 있게 해준다 *(보통 백엔드(노느런타임)에서만 사용됨)
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' })
  ],
  // 결과물
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js', //entry 의 app.js 
    publicPath: '/dist/',
  },
  //핫 리로딩을 위해서 서버 프록시 설정
   devServer: {
    historyApiFallback: true, // react router할때 필요한 설정
    port: 3090,
    publicPath: '/dist/',
    proxy: {
      '/api/': {
        target: 'http://localhost:3095',
        changeOrigin: true,
      },
    },
  },
  }
````

````
// 개발모드
if (isDevelopment && config.plugins) {
  // 리액트 핫 리로딩을 위한 코드 (보통 CRA로 세팅할 경우 다 포함되어있다) 
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}
// 배포모드
if (!isDevelopment && config.plugins) {
  // 좀 더 최적화되는 옛날 플러그을 위함
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}
````

## html파일 만들기
index.html
기본 세팅
````
//실제 슬랙의 html을 가져다 사용
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>슬리액트</title>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            overflow: initial !important;
          }
        </style>
        <link rel="stylesheet" href="https://a.slack-edge.com/bv1-9/client-boot-styles.dc0a11f.css?cacheKey=gantry-1613184053" crossorigin="anonymous" />
        <link rel="shortcut icon" href="https://a.slack-edge.com/cebaa/img/ico/favicon.ico" />
        <link href="https://a.slack-edge.com/bv1-9/slack-icons-v2-16ca3a7.woff2" rel="preload" as="font" crossorigin="anonymous" />
    </head>
    <body>
    <div id="app">
    // 앞으로 이 안으로 내용을 채워나갈 것이다. 
    </div>
<!--index 로 바로 실행할때는 ./dist/app.js webpack 을 통해서 시작할 때는 /dist/app.js-->
    <script src="/dist/app.js"></script>
    </body>
</html>

````

client.ts
````
import React from 'react';
import { render } from 'react-dom';

import App from '@layouts/App';
import { BrowserRouter } from 'react-router-dom';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);
````

## foldering
````
└─sleact            
   ├─ components
   ├─ hooks
   ├─ layouts
   ├─ pages
   ├─ typings
   ├─ utils
   │  .eslintrc
   │  .prettierrc
   │  client.tsx
   │  .index.html
   │  README.md
   │  package-lock.json
   │  package.json
   │  .gitignore
   │  tsconfig-for-webpack-config.json
   └─ webpack-config.ts
````

## 오류 해결하기
npx webpack 을 돌리게 되면 ".ts" 파일을 읽지 못하는 오류가 뜬다..
tscongfig-for-webpack-config.json
{
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "Node",
    "target": "ES5",
    "esModuleInterop": true
  }
}
추가해준다.

package.json
build 명령어에 명령을 추가 해준다. 
 "build": "cross-env NODE_ENV=production TS_MODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack",
 
[webpack doc 참고](https://webpack.js.org/configuration/configuration-languages/#typescript)

## 핫리로딩 설정하기
// 웹팩데브서버로 프록시서버 역할도 해주기때문에 여러가지로 유용하게 사용 가능
npm i webpack-dev-server webpack-cli
npm i @types/webpack-dev-server

npm i @pmmmwh/react-refresh-webpack-plugin
npm i react-refresh

webpack-config 설정 위 내용 참고 
"dev": "cross-env TS_MODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack serve --env development",

## ✔Acknowledgments


#### * 인프런 zerocho님의 강의를 참고하였습니다.

