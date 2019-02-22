/**
 * pages模版快速生成脚本,执行命令 npm run tep `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run new:comp test');
  process.exit(0);
}

// 页面模版
const indexTep = `import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.scss';

export default class ${dirName} extends Component {
  static externalClasses = ['extra-class']
  static defaultProps = {
  };
  
  render() {
    return (
      <View className='${dirName.toLowerCase()}-comp extra-class'>
        ${dirName}
      </View>
    )
  }
}
`;

// scss文件模版
const scssTep = `@import "../../styles/mixin";

.${dirName.toLowerCase()}-comp {

}
`;

fs.mkdirSync(`./src/components/${dirName}`); // mkdir $1
process.chdir(`./src/components/${dirName}`); // cd $1

fs.writeFileSync('index.tsx', indexTep);
fs.writeFileSync('index.scss', scssTep);

console.log(`模块${dirName}已创建`);

process.exit(0);
