1. What is the difference between var, let, and const?
var is the oldest way to declare a variable in JavaScript. It is function-scoped (or globally scoped), meaning it can be accessed outside of the block ({}) it was defined in, and it can be updated or re-declared.
let is block-scoped. It only exists within the specific curly braces {} it was created in. It can be updated later, but it cannot be re-declared in the same scope.
const is also block-scoped, but it is meant for values that shouldn't change. Once you assign a value to a const, you cannot reassign it. (However, if it's an object or array, you can still modify its contents).
2. What is the spread operator (...)? 
The spread operator allows you to easily "unpack" or spread out elements of an array or properties of an object into a new array or object. It's incredibly useful for copying arrays without modifying the original, or for combining multiple arrays/objects together quickly.
3. What is the difference between map(), filter(), and forEach()?
forEach() just loops over every item in an array and runs a function for each one. It doesn't create or return anything new.
map() also loops over the array, but it takes whatever your function returns and creates a brand new array out of those returned values, keeping the same length as the original array.
filter() looks at every item in an array and tests it against a condition. If the condition is true, it keeps the item; if false, it skips it. It returns a new array containing only the passing items.
4. What is an arrow function? 
An arrow function (=>) is a shorter, cleaner way to write a function in JavaScript compared to the traditional function keyword. Besides looking nicer, its main feature is that it doesn't create its own this context—it inherits this from whatever surrounds it, making it much easier to use in callbacks and event listeners.
5. What are template literals? 
Template literals are strings wrapped in backticks (`) instead of standard quotes (' or " ). They allow you to easily write multi-line strings without using \n, and more importantly, they let you inject JavaScript variables and math directly into the string using the ${variable} syntax.

