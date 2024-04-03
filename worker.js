const fs = require('fs');
const { expect } = require('expect');

exports.runTest = async (testFile) => {
    const code = await fs.promises.readFile(testFile, 'utf-8');
    const testResult = {
        success: false,
        errorMessage: null
    }

    try {
        // Can use expect package instead
        // const expect = (received) => ({
        //     toBe: (expected) => {
        //         if (received !== expected) {
        //             throw new Error(`Expected ${expected} but received ${received}`)
        //         }
        //     },
        //     toThrow: () => {
        //         let hasThrown = false;
        //         try {
        //             received()
        //         } catch (e) {
        //             hasThrown = true;
        //         }
        //         if (!hasThrown) {
        //             throw new Error("It didn't throw")
        //         }
        //     }
        // });
        eval(code);
        testResult.success = true;
    } catch (e) {
        // console.log("e: ", e.message)
        testResult.errorMessage = e.message
    }

    return testResult
}