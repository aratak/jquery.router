(function() {
  $.router({
    "qwe": function() {
      throw "#qwe hash now";
    }
  });
  describe("Just a simple example", function() {
    return it("should get callback", function() {
      return expect(function() {
        console.log(1);
        return window.location.hash = "qwe";
      }).toThrow("#qwe hash now");
    });
  });
}).call(this);
