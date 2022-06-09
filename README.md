# brotest
Tool for testing code in web browser.

features:
 * support asynchronous programming
 * hot reloading
 * typescript
 * automatically added file that contains **.test.** in file name
 * focus on class that current working on


## config

Brotest require to set folder where source code is.
In this example is **src**.
**package.json**
```js
  "scripts": {,
    "test": "npx brotest src",
  },
```

## usage
Tests must contain **.test.** in file name. In files must by set **export default class**.
Ich public method in class must contain assert parameter. Assert is callback for function that is responsible to check if test is correct.
In assert first argument must by boolean, second is string that is optional. When first argument is set to **true** test display as **PASS**. When is set to **false** is display as FAIL. When status is **FAIL**, optional message is shown.

## example

```js
export default class {
  test1(assert) {
    //test pass
    assert(true)
  }

  test2(assert) {
    //test failed
    assert(false, "Something is wrong!")
  }
}
```
![image](./img/show.png)

## issues
Sometime hot reload don't work when test is created. This require manual reload page.

## demo video
[![watch video](https://img.youtube.com/vi/sY_C3skjVIk/0.jpg )](https://youtu.be/sY_C3skjVIk)
