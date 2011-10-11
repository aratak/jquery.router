$.router
  "qwe": -> throw "#qwe hash now"

describe "Just a simple example", ->
  it "should get callback", ->
    expect(-> 
      console.log 1
      window.location.hash = "qwe"
    ).toThrow("#qwe hash now")