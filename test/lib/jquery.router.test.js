(function() {
  describe("Just a simple example", function() {
    beforeEach(function() {
      return window.location.hash = "";
    });
    return it("should get callback", function() {
      return expect(function() {
        $.router({
          routes: {
            qwe: function() {
              throw "#qwe hash now";
            }
          }
        });
        return window.location.hash = "qwe";
      }).toThrow("#qwe hash now");
    });
  });
}).call(this);
