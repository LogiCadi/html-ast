// const html =
//     `  <a>
//       hel  lo  s
//      </a> `
const html =
    `<node>
        hello
        <a>这是一个a标签
            <b>bb</b>
        </a>
     </node>`

// const AST = {
//     "type": "tag",// tag标签 text文本
//     "value": {
//         "name": "node",// 标签的名字
//         "attr": {// 标签属性
//             "p": "ok"
//         },
//         "children": [
//             {
//                 "type": "text",
//                 "value": "hello"
//             }, {
//                 "type": "tag",
//                 "value": {
//                     "name": "a",
//                     "attr": null,
//                     "children": [
//                         {
//                             "type": "text",
//                             "value": "这是一个a标签"
//                         }
//                     ]
//                 }
//             }
//         ],
//     }
// }

// 任务：将html String转化为AST 抽象语法树 即 虚拟DOM

// 词法分析
function tokenizer(input) {
    let tokens = []
    let index = 0

    while (index < input.length) {
        let char = input[index]

        if (char === '<') {
            // 标签
            // 跳过<
            char = input[++index]
            let type
            if (char !== '/') {
                // 标签头
                type = 'tagStart'
            } else {
                // 标签尾
                // 跳过/
                char = input[++index]
                type = 'tagEnd'
            }
            // 标签内容
            let value = ''
            while (char !== '>') {
                value += char
                char = input[++index]
            }
            tokens.push({
                type,
                value
            })
            // 跳过>
            index++
        } else {
            // 文本
            let value = ''
            while (char && char !== '<') {
                value += char
                char = input[++index]
            }
            value = value.trim()
            if (value) {
                tokens.push({
                    type: "text",
                    value
                })
            }
        }
    }

    return tokens
}

// const tokens = [
//     { type: 'tagStart', value: 'a' },
//     { type: 'text', value: 'hello' },
//     { type: 'tagEnd', value: 'a' }
// ]

// const astOrign = [
//     {
//         "type": "tag",
//         "value": {
//             "name": "a",
//             "children": [
//                 {
//                     "type": "text",
//                     "value": "hello"
//                 }
//             ]
//         }
//     }
// ]

// 语法分析
function parser(tokens) {
    // 抽象语法树 Abstract Syntax Tree
    let ast = []
    let index = 0

    function walk() {
        let token = tokens[index]

        let node
        if (token.type === 'tagStart') {
            // 标签
            let tagName = token.value
            node = {
                type: "tag",
                value: {
                    name: tagName,
                    children: []
                }
            }
            // 解析子元素
            // 跳过左标签
            token = tokens[++index]
            while (token && !(token.type === 'tagEnd' && token.value === tagName)) {
                node.value.children.push(walk())
                token = tokens[index]
            }
        } else {
            // 文本
            node = {
                type: "text",
                value: token.value
            }
        }

        index++
        return node
    }

    while (index < tokens.length) {
        ast.push(walk())
    }

    return ast
}

const tokens = tokenizer(html)
console.log('tokens', tokens)

const ast = parser(tokens)
console.log('AST', JSON.stringify(ast))