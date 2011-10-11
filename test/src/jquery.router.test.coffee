describe "Just a simple example", ->

  beforeEach ->
    window.location.hash = ""

  it "should get callback", ->
    expect(-> 
      $.router
      	routes: 
          qwe: -> throw "#qwe hash now"
      window.location.hash = "qwe"
    ).toThrow("#qwe hash now")
