describe('evaluator', function() {

  function test_evaluator(lisp, expected) {
    it("should evaluate " + lisp + " to " + expected, function() {
      var parsed = parse(lisp),
          evaled = evaluate(parsed, global_env),
          resp   = to_string(evaled)
      expect(resp).toEqual(expected)
    })
  }

  test_evaluator("(quote (testing 1 (2) -3.14e159)))", "( testing 1 ( 2 ) -3.14e+159 )")
  test_evaluator("(list 1 2 3 4)", "( 1 2 3 4 )")
  test_evaluator("(+ 2 2)", '4')
  test_evaluator("(+ (* 2 100) (* 1 10))", '210')
  test_evaluator("(if (> 6 5) (+ 1 1) (+ 2 2))", "2")
  test_evaluator("(if (< 6 5) (+ 1 1) (+ 2 2))", "4")
  test_evaluator("(define x 3)", "null")
  test_evaluator("x", "3")
  test_evaluator("(+ x x)", "6")
  test_evaluator("(begin (define x 1) (set! x (+ x 1)) (+ x 1))", "3")
  test_evaluator("((lambda (x) (+ x x)) 5)", "10")
  test_evaluator("(define twice (lambda (x) (* 2 x)))", "null")
  test_evaluator("(twice 5)", "10")
  test_evaluator("(define compose (lambda (f g) (lambda (x) (f (g x)))))", "null")
  test_evaluator("((compose list twice) 5)", "( 10 )")
  test_evaluator("(define repeat (lambda (f) (compose f f)))", "null")
  test_evaluator("((repeat twice) 5)", "20")
  test_evaluator("((repeat (repeat twice)) 5)", "80")
  test_evaluator("(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))", "null")
  test_evaluator("(fact 3)", "6")
  test_evaluator("(fact 50)", "3.0414093201713376e+64")
  test_evaluator("(define abs (lambda (n) ((if (> n 0) + -) 0 n)))", "null")
  test_evaluator("(list (abs -3) (abs 0) (abs 3))", "( 3 0 3 )")
  test_evaluator("(define combine (lambda (f)" +
                    "(lambda (x y)" +
                      "(if (null? x) (quote ())" +
                        "(f (list (car x) (car y))" +
                          "((combine f) (cdr x) (cdr y)))))))", "null")
  test_evaluator("(define zip (combine cons))", "null")
  test_evaluator("(zip (list 1 2 3 4) (list 5 6 7 8))", "( ( 1 5 ) ( 2 6 ) ( 3 7 ) ( 4 8 ) )")
  test_evaluator("(define riff-shuffle (lambda (deck) (begin" +
                  "(define take (lambda (n seq) (if (<= n 0) (quote ()) (cons (car seq) (take (- n 1) (cdr seq))))))" +
                    "(define drop (lambda (n seq) (if (<= n 0) seq (drop (- n 1) (cdr seq)))))" +
                      "(define mid (lambda (seq) (/ (length seq) 2)))" +
                        "((combine append) (take (mid deck) deck) (drop (mid deck) deck)))))", "null")
  test_evaluator("(riff-shuffle (list 1 2 3 4 5 6 7 8))", "( 1 5 2 6 3 7 4 8 )")
  test_evaluator("((repeat riff-shuffle) (list 1 2 3 4 5 6 7 8))", "( 1 3 5 7 2 4 6 8 )")
  test_evaluator("(riff-shuffle (riff-shuffle (riff-shuffle (list 1 2 3 4 5 6 7 8))))", "( 1 2 3 4 5 6 7 8 )")

})
