# html-ast

## 几十行代码初识编译原理，cs 界的屠龙宝刀！

## 学习理解 vue 和 react 等等模板引擎 虚拟 DOM 必备！

- 执行：`node index`

### 过程

- `html` 需要转换的 html 字符串（标签上暂不可写属性）

```html
<node>
  hello
  <a>这是一个a标签</a>
</node>
```

- `tokens = tokenizer(html)` 词法分析，从头到尾逐个分析，提取词单元`token`

```json
[
  { "type": "tagStart", "value": "node" },
  { "type": "text", "value": "hello" },
  { "type": "tagStart", "value": "a" },
  { "type": "text", "value": "这是一个a标签" },
  { "type": "tagEnd", "value": "a" },
  { "type": "tagEnd", "value": "node" }
]
```

- `ast = parser(tokens)` 语法分析，将 tokens 解析成语法树

```json
[
  {
    "type": "tag",
    "value": {
      "name": "node",
      "children": [
        {
          "type": "text",
          "value": "hello"
        },
        {
          "type": "tag",
          "value": {
            "name": "a",
            "children": [
              {
                "type": "text",
                "value": "这是一个a标签"
              }
            ]
          }
        }
      ]
    }
  }
]
```
