const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}

describe('getNameFromFullname', () => {
  it('should return the correct name', () => {
    const fullname = 'John.Doe'
    const result = getNameFromFullname(fullname)
    expect(result).toBe('John')
  })
})
