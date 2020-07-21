import { ToyReact, Component } from "./ToyReact"

class MyComponent extends Component {
  render() {
    return (
      <div>
        <div>
          <span>Hello</span>
          <span>world</span>
          <span>!</span>
        </div>
        <div>
          {true}
          {this.children}
        </div>
      </div>
    )
  }
}

const a = <MyComponent name="a" id="id-a">
  <span>Child</span>
</MyComponent>

ToyReact.render(
  a,
  document.getElementById("root")
)
