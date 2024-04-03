expect(2).toBe(2);

expect(() => {
    throw new Error('it does throw')
}).toThrow()

