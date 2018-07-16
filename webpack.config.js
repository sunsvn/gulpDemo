let NODE_ENV=process.env.NODE_ENV;
let webpack=require('webpack'),
    autoprefixer=require('autoprefixer'),
    path=require('path'),
    jsonFile=require('jsonfile'),
    conf=jsonFile.readFileSync('./launchConf.json');
  
module.exports={
  entry:{
    //入口文件路径
    entry:'./src/lib/entry.js'
  },
  output:{
    //输出文件路径
    path:path.resolve(__dirname,'src/js'),
    publicPath:NODE_ENV==='production'?'./js/':'/js/',
    filename:'[name].bundle.js'
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use:'babel-loader'
      },
    ]
  },
   devServer:{
    port:conf.webpack.port,
    noInfo: true,
    publicPath:'/js/',
    contentBase:path.resolve(__dirname,'src')
  },
  plugins:[
    new webpack.DefinePlugin({
      __DEV__:NODE_ENV==='production'?false:true
    })
  ]
}

if(conf.preact){
  module.exports.module.rules=module.exports.module.rules.concat([
    {
      test:/\.scss$/,
      use:[
        'style-loader',
        'css-loader',
        'resolve-url-loader',
        {
          loader:'postcss-loader',
          options:{
            plugins(){
              return [autoprefixer]
            }
          }
        },
        'sass-loader'
      ]
    },
    {
      test:/\.less$/,
      use:[
        'style-loader',
        'css-loader',
        'resolve-url-loader',
        {
          loader:'postcss-loader',
          options:{
            plugins(){
              return [autoprefixer]
            }
          }
        },
        'less-loader'
      ]
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: 'assets/[name].[ext]?[hash]'
      }
    }
  ])
}

if(NODE_ENV==='production'){
  module.exports.watch=false;
  module.exports.plugins=(module.exports.plugins||[]).concat([
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  ])
}