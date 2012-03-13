// Basic operations

var Operations = {
  '+'       : function(a, b) { return a + b },
  '-'       : function(a, b) { return a - b },
  '*'       : function(a, b) { return a * b },
  '/'       : function(a, b) { return a / b },
  '<'       : function(a, b) { return a < b },
  '>'       : function(a, b) { return a > b },
  '<='      : function(a, b) { return a <= b },
  '>='      : function(a, b) { return a >= b },
  '='       : function(a, b) { return a == b },
  'equal?'  : function(a, b) { return a == b },
  'length'  : function(a)    { return a.length },
  'cons'    : function(a, b) { return [a].concat(b) },
  'car'     : function(a)    { return a[0] },
  'cdr'     : function(a)    { return a.slice(1) },
  'append'  : function(a, b) { return a.concat(b) },
  'list'    : function()     { return Array.prototype.slice.call(arguments) },
  'list?'   : function(a)    { return a instanceof Array },
  'null?'   : function(a)    { return a.length == 0 },
  // 'symbol?' , TODO
  // 'eq? : op.is_, TODO
}

// Env container

function Env(properties, outer) {
  this.properties = properties || {}
  this.outer      = outer      || { find : function(key) { return this }, get : function() { return null }, set: function() {} }
}

Env.prototype.get  = function(key)      { return this.properties[key] }
Env.prototype.set  = function(key, val) { this.properties[key] = val  }
Env.prototype.find = function(key)      { return this.get(key) ? this : this.outer.find(key) }

var global_env = new Env(Operations)

// Evaluator

function evaluate(x, env) {

  var _, exp, test, conseq, alt, variable, vars, exps, proc

  if (typeof x == 'string') {  // Variable reference
    return env.find(x).get(x)
  } else if (x instanceof Array == false) {
    return x
  } else if (x[0] == 'quote') {
    [_, exp] = x
    return exp
  } else if (x[0] == 'if') {
     [_, test, conseq, alt] = x
     if (evaluate(test, env)) {
       return evaluate(conseq, env)
     } else {
       return evaluate(alt, env)
     }
  } else if (x[0] == 'set!') {
    [_, variable, exp] = x
    env.find(variable).set(variable, evaluate(exp, env))
  } else if (x[0] == 'define') {
    [, variable, exp] = x
    env.set(variable, evaluate(exp, env))
  } else if (x[0] == 'lambda') {
    [_, vars, exp] = x
    return function() {
      var properties = {}
      args = arguments
      vars.forEach(function(x, i) { properties[x] = args[i] })
      return evaluate(exp, new Env(properties, env))
    }
  } else if (x[0] == 'begin') {
    var val
    x.slice(1).forEach(function(exp) {
      val = evaluate(exp, env)
    })
    return val
  } else {
    exps = x.map(function(exp) { return evaluate(exp, env) })
    proc = exps.shift()
    return proc.apply(null, exps)
  }

}

// Parser, etc

function parse(string) {
  return read_from(tokenize(string))
}

function tokenize(string) {
  return string.replace('(',' ( ', 'g').replace(')',' ) ', 'g').split(" ").filter(function(s) { return s != ""})
}

function read_from(tokens) {

  if (tokens.length == 0) {
    throw 'unexpected EOF while reading'
  }

  var token = tokens.shift()

  if ('(' == token) {
    var L = []
    while (tokens[0] != ')') {
      L.push(read_from(tokens))
    }
    tokens.shift()
    return L
  } else if (')' == token) {
    throw 'unexpected )'
  } else {
    return atom(token)
  }

}

function atom(token) {
  return isNaN(parseFloat(token)) ? token : parseFloat(token)
}

function to_string(exp) {
  if (exp instanceof Array) {
      return "( " + exp.map(to_string).join(" ") + " )"
  } else if (typeof exp == 'undefined' || exp == null) {
    return "null"
  } else {
    return exp.toString()
  }
}


