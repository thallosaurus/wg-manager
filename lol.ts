import {assert } from "@std/assert";

const isEven = (n: number) => !Boolean(n & 1)
console.log(isEven(7)) //false
console.log(isEven(6)) //true

Deno.test("7 is not even", () => {
    assert(isEven(7) == false);
})

Deno.test("6 is even", () => {
    assert(isEven(6) == true);
})