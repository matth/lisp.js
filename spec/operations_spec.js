describe('Operations', function() {

  function test_operation(expr, expected) {
    it("should defined the " + expr[0] + " operations", function() {
      expect( Operations[expr[0]].apply(null, expr.slice(1)) ).toEqual( expected )
    })
  }

  test_operation(["+", 1, 2], 3)
  test_operation(["-", 2, 1], 1)
  test_operation(["*", 3, 2], 6)
  test_operation(["/", 9, 3], 3)
  test_operation(["<", 1, 2], true)
  test_operation([">", 2, 1], true)
  test_operation([">=", 2, 2], true)
  test_operation(["<=", 2, 2], true)
  test_operation(["=", 2, 2], true)
  test_operation(["equal?", 2, 2], true)
  test_operation(["length", "foo"],  3)
  test_operation(["cons", 1, [2]], [1,2])
  test_operation(["car", [1,2,3]], 1)
  test_operation(["cdr", [1,2,3]], [2,3])
  test_operation(["append", "a", "b"], "ab")
  test_operation(["list", 1,2,3], [1,2,3])
  test_operation(["list?", [1,2,3]], true)

})