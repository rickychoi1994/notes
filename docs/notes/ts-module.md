# TS中的模块

[官方文档](https://www.tslang.cn/docs/handbook/modules.html)

## 模块

在 TypeScript 1.5版本之前，分为内部模块和外部模块；1.5版本开始内部模块改称 "命名空间"，外部模块改称 "模块"。

TypeScript与ECMAScript 2015一样，任何包含顶级import或者export的文件都被当成一个模块。相反地，如果一个文件不带有顶级的import或者export声明，那么它的内容被视为全局可见的（因此对模块也是可见的）。

TS 中的模块除了遵循ES6的标准模块语法外还有特定的语法。

TS 中的 export 能导出任何声明，包括 TS 中的 类型别名、接口。

```typescript
export interface Interface {
  name: string;
  age: number;
}

class ClassA {
  constructor() {}
}

export { classA as ClassNameA }
// 也可以使用 as 别名
```

ES6中的 `export default` 和 NodeJs中的 `module.exports` 是不兼容的。TS 为了兼容这两种写法，解决导入和引入commonJs和AMD模块时，不同模块规范实现不一致的问题，增加了 `export = name` 和 `import name = require()`

```typescript
// a.ts
export name = 'jane'
// b.ts
import name = require('a.ts')
```

## 命名空间

命名空间和模块的使用场景：

当在程序内部，用于防止全局污染的时候，想把相关的内容放在一起的时候用命名空间；当封装了一个工具或库要适用于模块系统中引用的时候，适合使用模块。

```typescript
// namespace 关键字
// 命名空间中内容若想对外可使用需要用 export 标记
namespace Validation {
  const isLetter = /^[a-zA-Z]+$/
  export const isNumber = /^[0-9]+$/
  export checkLetter = (text: any) => {
    return isLetter.test(text)
  }
}
```


当在终端使用 `tsc` 编译时，引入命名空间：

```typescript
/// <reference path="a.ts"/>

// 终端中需要制定一个outFile参数：
// tsc --outFile src/index.js src/modules/index.ts
```

当应用变得越来越大时，需要将代码分离到不同的文件中以便于维护。

```typescript
// letter-Validation.ts
namespace Validation {
  const isLetter = /^[a-zA-Z]+$/
  export checkLetter = (text: any) => {
    return isLetter.test(text)
  }
}

// number-Validtion.ts
namespace Validation {
  const isNumber = /^[0-9]+$/
  export checkNumber = (text: any) => {
    return isNumber.test(text)
  }
}

// index.ts
/// <reference path="letter-Validation.ts"/>
/// <reference path="number-Validtion.ts"/>
// 多个文件的同名命名空间编译时会合并为一个
```

## 别名

简化命名空间操作的方法是使用import q = x.y.z给常用的对象起一个短的名字。解决，简化深层次嵌套取里面的内容的过程

```typescript
namespace Shapes {
  export namespace Polygons {
    export class Triangle{}
    export class Squaire{}
  }
}

import polygons = Shapes.Polygons
let triangle = new polygons.Triangle()
```

## 模块解析

[官方文档](https://www.tslang.cn/docs/handbook/module-resolution.html)
