describe('Env', function() {

  it("should store properties" , function() {
    var env = new Env
    expect(env.get('foo')).toEqual(null)
    env.set('foo', 'bar')
    expect(env.get('foo')).toEqual('bar')
  })

  it("should find properties from an outer scope if available" , function() {
    var outer = new Env
    var inner = new Env(null, outer)

    outer.set('one', '1')
    outer.set('two', '2')
    inner.set('one', '3')

    expect(inner.find('one')).toEqual(inner)
    expect(inner.find('two')).toEqual(outer)
    expect(inner.find('foo').get('foo')).toEqual(null)

  })

})
