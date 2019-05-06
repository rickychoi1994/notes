# 枚举

[官方文档](https://www.tslang.cn/docs/handbook/classes.html)

## 数字枚举

```typescript
enum Status {
  Uploading,
  Success,
  Failed
}

Status.Uploading // 0
Status[0] // Uploading
```

数字枚举在定义值得时候，可以使用计算值和常量，如果某字段使用了计算值或常量，那该字段后面紧接着的字段必须设置初始值

```typescript
const num = 1

const getIndex = () => {
  return 2
}

enum Status {
  Uploading,
  Success = num,
  Faild = getIndex(),
  Result // error 枚举成员必须具有初始化表达式
}
```

## 反向映射

除了创建一个以属性名做为对象成员的对象之外，数字枚举成员还具有了 反向映射，从枚举值到枚举名字

## 字符串枚举

每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化

```typescript
enum Message {
  Success = 'good, success',
  Error = 'sorry, error',
  Failed = Error
}

Message.Failed // sorry, error
```

## 枚举成员类型&联合枚举

当枚举内的所有成员都满足一下条件的任意一条时，枚举值和其成员都可以作为类型使用。
枚举类型本身变成了每个枚举成员的联合。

* 任何字符串字面量
* 任何数字字面量
* 应用了一元 -符号的数字字面量

```typescript
enum Animals {
  Dog = 1,
  Cat = 2
}

interface Dog {
  type: Animals.Dog
}

const dog: Dog = {
  type: Animals.Dog,
  // type: 1,
  // type: Animals.Cat, // 不能将类型“Animals.Cat”分配给类型“Animals.Dog”
}
```

```typescript
// 联合枚举
enum Status {
  On,
  Off
}

interface Light {
  status: Status
}

const light: Light = {
  status: Status.On
}
```

## 运行时的枚举

枚举是在运行时真正存在的对象

## const枚举

const枚举只能使用常量枚举表达式，并且不同于常规的枚举，它们在编译阶段会被删除。 常量枚举成员在使用的地方会被内联进来。 之所以可以这么做是因为，常量枚举不允许包含计算成员。

```typescript
const enum User {
  SUPER_MANAGER = 1,
  MANAGER = 2,
}

let userArr = [ User.SUPER_MANAGER, User.MANAGER ]
// [1 /* SUPER_MANAGER */, 2 /* MANAGER  */]
```
