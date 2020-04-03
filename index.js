const html =
    `<node>
        hello
        <a>这是一个a标签
        </a>
     </node>`

// 任务：将html String转化为AST 抽象语法树 虚拟DOM 对象数组
const tokens = tokenizer(html)
console.log('tokens:', tokens)

const ast = parser(tokens)
console.log('ast:', ast)

/**词法分析*/
function tokenizer(input) {
    // 分词单元数组
    let tokens = []
    // 指针
    let index = 0

    while (index < input.length) {
        let char = input[index]

        if (char === '<') {
            // 这是个标签
            // 跳过<
            char = input[++index]
            let type
            if (char !== '/') {
                // 这是个标签头
                type = 'tagStart'
            } else {
                // 这是个标签尾
                // 跳过/
                char = input[++index]
                type = 'tagEnd'
            }
            // 提取标签名字
            let value = ''
            while (char !== '>') {
                value += char
                char = input[++index]
            }
            // 添加一个token
            tokens.push({
                type,
                value
            })
            // 跳过>
            index++
        } else {
            // 这是个文本
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

/**语法分析*/
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
                type: 'tag',
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
                type: 'text',
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