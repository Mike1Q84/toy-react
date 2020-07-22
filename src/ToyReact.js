class ElementWrapper {
  constructor(type) {
    this.type = type
    this.props = Object.create(null)
    this.children = []
  }

  setAttribute(name, value) {
    this.props[name] = value
  }

  appendChild(vchild) {
    this.children.push(vchild)
  }

  mountTo(range) {
    this.range = range
    range.deleteContents()
    const element = document.createElement(this.type)

    for (const name in this.props) {
      // if (this.props.hasOwnProperty(name)) {
      const value = this.props[name]

      if (name.match(/^on([\w]+)$/)) {
        const eventName = RegExp.$1.replace(/^[\w]/, s => s.toLowerCase())
        element.addEventListener(eventName, value)
      }

      if (name === "className") {
        element.setAttribute("class", value)
      }

      element.setAttribute(name, value)
      // }
    }

    for (const child of this.children) {
      const range = document.createRange()
      if (element.children.length) {
        range.setStartAfter(element.lastChild)
        range.setEndAfter(element.lastChild)
      } else {
        range.setStart(element, 0)
        range.setEnd(element, 0)
      }
      child.mountTo(range)
    }

    range.insertNode(element)
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
    this.type = "#text"
    this.chidren = []
    this.props = Object.create(null)
  }

  mountTo(range) {
    this.range = range
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export class Component {
  constructor() {
    this.children = []
    this.props = Object.create(null)
  }

  get type() {
    return this.constructor.name
  }

  setAttribute(name, value) {
    this.props[name] = value
    this[name] = value
  }

  mountTo(range) {
    this.range = range
    this.update()
  }

  update() {
    const vdom = this.render()
    if (this.vdom) {
      const isSameNode = (node1, node2) => {
        if (node1.type !== node2.type) {
          return false
        }

        for (const name in node1.props) {
          if (typeof node1.props[name] === "function"
            && typeof node2.props[name] === "function"
            && node1.props[name].toString() === node2.props[name].toString()) {
            continue
          }

          if (typeof node1.props[name] === "object"
            && typeof node2.props[name] === "object"
            && JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name])) {
            continue
          }

          if (node1.props[name] !== node2.props[name]) {
            return false
          }
        }

        if (Object.keys(node1.props).length !== Object.keys(node2.props).length) {
          return false
        }

        return true
      }

      const isSameTree = (node1, node2) => {
        if (!isSameNode(node1, node2)) {
          return false
        }

        if (node1.children.length != node2.children.length) {
          return false
        }

        for (let index = 0; index < node1.children.length; index++) {
          if (!isSameTree(node1.children[index], node2.children[index])) {
            return false
          }
        }

        return true
      }

      const replace = (newTree, oldTree, indent) => {
        if (isSameTree(newTree, oldTree)) {
          return
        }

        if (!isSameNode(newTree, oldTree)) {
          newTree.mountTo(oldTree.range)
        } else {
          for (let index = 0; index < newTree.children.length; index++) {
            replace(newTree.children[index], oldTree.children[index], "  " + indent)
          }
        }
      }

      replace(vdom, this.vdom, "")
    } else {
      vdom.mountTo(this.range)
    }
    this.vdom = vdom
  }

  appendChild(vchild) {
    this.children.push(vchild)
  }

  setState(state) {
    const merge = (oldState, newState) => {
      for (const p in newState) {
        if (typeof newState[p] === "object" && newState[p] !== null) {
          if (typeof oldState[p] !== "object") {
            if (newState[p] instanceof Array) {
              oldState[p] = []
            } else {
              oldState[p] = {}
            }
          }

          merge(oldState[p], newState[p])
        } else {
          oldState[p] = newState[p]
        }
      }
    }

    if (!this.state && state) {
      this.state = {}
    }

    merge(this.state, state)
    this.update()
  }
}

export const ToyReact = {
  createElement(type, attributes, ...children) {
    let element

    if (typeof type === "string") {
      element = new ElementWrapper(type)
    } else {
      element = new type
    }

    for (const name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        element.setAttribute(name, attributes[name])
      }
    }

    const insertChildren = children => {
      for (let child of children) {
        if (typeof child === "object" && child instanceof Array) {
          insertChildren(child)
        } else {
          if (child === null || child === void 0) {
            child = ""
          }

          if (!(child instanceof Component)
            && !(child instanceof ElementWrapper)
            && !(child instanceof TextWrapper)) {
            child = String(child)
          }

          if (typeof child === "string") {
            child = new TextWrapper(child)
          }

          element.appendChild(child)
        }
      }
    }
    insertChildren(children)

    return element
  },
  render(vdom, element) {
    const range = document.createRange()
    if (element.children.length) {
      range.setStartAfter(element.lastChild)
      range.setEndAfter(element.lastChild)
    } else {
      range.setStart(element, 0)
      range.setEnd(element, 0)
    }

    vdom.mountTo(range)
  }
}