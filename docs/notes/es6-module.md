# ES6和NodeJs中的模块

## ES6 模块

### export

export 可以导出模块内容。

```javascript
export const name = 'jane'
export const age = 18
export function a() {}
export class A {}
```

也可以通过解构赋值导出。

```javascript
export {
  name,
  age,
  a,
  A
}
```

export 导出时，可以使用 `as` 进行重命名，引入时就可以用别名了。

```javascript
  export {
    name as nameProp,
    name as nameProps, // 可以设置多个别名
    age as ageProp,
    a as func,
    A as classA
  }
```

export 导出的是对外的接口而不是某个值，如果直接导出一个值会报错。

```javascript
export 'jane' // error

const name = 'jane'
export name // error
```

export 导出的内容与其对应的值是动态绑定的。当这个接口在其模块中发生变化时，在引入的地方也会发生变化。

```javascript
// a.js
export let time = new Date()

setInterval(() => {
  time = new Date()
}, 1000)

// b.js
import { time } from './a.js'

setInterval(() => {
  console.log(time)
})
// 打印的值每秒都会变
```

:::tip
export 可以出现在模块中处于模块顶层的任何位置。(export 不能出现在块级作用域中)
:::

### export default

在模块中，可以使用 `export default` 导出一个默认内容，一个模块只能使用一次。

```javascript
export default {
  name
}

// 引入时的变量名和模块导出的可以不一样
import nameProp from 'a.js'
```

也可以使用 `as`

```javascript
// 导出时
export { name as nameProp }
// 引入时
import { default as Name } from 'a.js'
```

如果需要在一个js文件中引入一个模块后再导出它，可以将引入和导出写成一句话。

import 和 export default 复合写法：

```javascript
import { name } from 'a.js'
export default name

// 复合写法 =>

export { default as name } from 'a.js'
// 当引入这个导出时，引入的名字必须一致
```

import 和 export 复合写法：

```javascript
export { name } from 'a.js'
```

```javascript
export { name as nameProp } from 'a.js'

export * from 'a.js'

// 作为default
import { name } from 'a.js'
export default name
// 合并 =>
export { name as default  } from 'a.js'

export { default as nameProp } from 'a.js'
```

export default 后不能跟声明语句，可以直接导出一个值，和 export 不同。

```javascript
export default 'jane'

const name = 'jane'
export default name
```

当一个模块中既有 export ,又有 export default 时，可以一起引入

```javascript
// a.js
export const name = 'jane'
const age = 18
export default age

// b.js
import age, { name } from 'a.js'
```

### import

import 可以引入模块的内容。

```javascript
import { name, age } from 'a.js'
```

import 引入时，也可以用 `as` 进行重命名。

```javascript
import { name as nameProp, age } from 'a.js'
```

import 引入的内容是只读的，如果引入的内容是一个对象则可以修改其属性。

```javascript
// a.js
export const obj = {
  name: 'jane',
  age: 18
}

// b.js
import { obj } from 'a.js'
obj.name = 'tom'
// { name: 'tom', age: 18 }
```

import 有提升效果，会提升到整个模块的头部首先执行，所以在引入之前使用引入的内容也是可以的，但不推荐。

```javascript
console.log(name) // 'jane'
import { name } from 'a.js'
```

improt 会把重复的导入在编译时合并成一个语句只执行一次

```javascript
import { name } from 'a.js'
import { age } from 'a.js'

// 合并 =>

import { name, age } from 'a.js'
```

可以用 `*` 引入模块所有内容并赋给一个变量

```javascript
import * as info from 'a.js'
```

### import()方法

import()方法可以实现动态加载模块，这是一个新的提议，但在webpack等编译工具已经实现了。

```javascript
const status = 1

if (status) {
  import('a.js')
} else {
  import('b.js')
}
```

## NodeJs模块

### exports

```javascript
// a.js
exports.name = 'jane'
exports.age = 18

// b.js
const info = reuqire('a.js')
```

### module.exports

```javascript
// a.js
module.exports = function () {
  console.log('jane')
}

// b.js
const print = require('a.js')
print() // 'jane'
```
