var REPL = (function() {

  var ENTER    = 13,
      ARROW_UP = 38,
      ARROW_DN = 40

  function prepend(element, html) {
    var frag = document.createDocumentFragment(),
        tmp  = document.createElement('body'),
        child

    tmp.innerHTML = html

    while (child = tmp.firstChild)
      frag.appendChild(child)

    element.insertBefore(frag, element.lastChild)

    frag = tmp = null;
  }

  function pad(number, length) {
    var str = '' + number
    while (str.length < length)
        str = '0' + str
    return str
  }

  /************************************************
   * History Iterator Thingy                      *
   ************************************************/

  function History() {
    this.list = []
    this.curr = 0
  }

  History.prototype.length = function() {
    return this.list.length
  }

  History.prototype.push   = function(cmd) {
    this.list.push(cmd)
    this.curr = this.length() - 1
  }

  History.prototype.up    = function(cmd) {
    this.curr = Math.max(this.curr - 1, 0)
    return this.list[this.curr]
  }

  History.prototype.down  = function(cmd) {
    this.curr = Math.min(this.curr + 1, this.length() - 1)
    return this.list[this.curr]
  }

  /************************************************
   * REPL                                         *
   ************************************************/

  function REPL(container, options) {

    this.options = options || ({
      exec : function() {}
    })

    this.container = container
    this.history   = new History()
    this.build_prompt()
    this.next_prompt()

    var that = this

    container.querySelector('.repl_input').onkeypress = function(e) { that.keypress(e) }

  }

  REPL.prototype.build_prompt = function() {
    prepend(this.container, '<p class="repl_output"><span class="repl_prompt"></span><input type="text" size="70" class="repl_input" /></p>')
  }

  REPL.prototype.prompt_string = function() {
    return "lisp.js " + pad(this.history.length() + 1, 3) + " >"
  }

  REPL.prototype.next_prompt = function() {
    this.container.querySelector('.repl_prompt').innerHTML = this.prompt_string()
    this.container.querySelector('.repl_input').focus()
    this.container.querySelector('.repl_input').value = ""
  }

  REPL.prototype.update_prompt = function(cmd) {
    this.container.querySelector('.repl_input').value = cmd
    this.container.querySelector('.repl_input').focus()
  }

  REPL.prototype.run_cmd    = function() {
    var command = this.prompt_string() + " " + this.container.querySelector('.repl_input').value
    prepend(this.container, '<p class="repl_output">' + command + '</p>')
    this.history.push(this.container.querySelector('.repl_input').value)
    prepend(this.container, '<p class="repl_output">' + this.options.exec(this.container.querySelector('.repl_input').value) + '</p>')
    this.next_prompt()
    this.container.scrollTop = 500000;
  }

  REPL.prototype.keypress   = function(e) {
    switch(e.keyCode) {
      case ENTER:
        this.run_cmd()
        break;
      case ARROW_UP:
        this.update_prompt(this.history.up())
        break;
      case ARROW_DN:
        this.update_prompt(this.history.down())
        break;
    }
  }

  return REPL

})()

window.onload = function() {

  var env = new Env({}, global_env)

  var lisp_repl = new REPL(document.getElementById('repl'), {
    exec : function(cmd) {
      return to_string(evaluate(parse(cmd), env))
    }
  })
}
