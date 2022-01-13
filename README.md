# TouchTypingVanilla
## What I learned from this project?
One of the most interesting (and painful) things I learned is that when you create an object from a class, the methods declared inside the class with the `method(){}` notation are added to the prototype.
On the other hand, if they're created using an arrow function they're added directly into the instance.

That detail has some implications mainly regarding to Events and the beautiful `this` keyword.
For example, if I want to add an event listener to some DOM element (inside a class constructor for example) and work with the `this` keyword pointing to other object than the correspoding to the DOM element I need to bind it with something like `method.bind(this)` which will set in stone the `this` to point to the instance itself.
That's one solution, but what if I need to add the listener and then remove it, I couldn't just do something like:
```js
element.addEventListener('click', method.bind(this));
element.addEventListener('click', method.bind(this));
```
because in order for that to work the callbacks need to be the same, in this case they're different, they're created on the fly and therefore they are not the same object in memory.

That's a silly example, I thought doing something like that would be useful when you need to hear for an event only once using the config object `{ once: true }`, but then I realized when the callback gets called the listener is actually removed right away so there's no need to do such thing.
Silly or not it led me to noticing that every time you bind, the objects are different, which actually makes sense.

I also learned that you can only add any listener once.
For example, I ran into a situation where I was doing 
```js
element.addEventListener('click', method.bind(this));
```
I inspected the events of the DOM element with the DevTools and I noticed that everytime that line of code executed, the number of listeners with the apparently same callback increased.
I thought that behavior was normal so I tried to find some workarounds and failed miserably then I tried with an arrow function as a callback instead of the regular function and boom! I didn't matter how many times I executed that line of code from above, the listener was only added one since the reference of the callback was always the same.
Also the `this` was magically set to the instance so perfect. 
However that was not enough for satisfying my curiosity, it was still confusing to me HOW could the `this` point to the object since it's an arrow functions as a property of an object so the `this` should point to the one of the surrounding scope.
What scope? Let's think this object was created using a class.
```js
const obj = {
  prop: 'yo',
  method: () => {
    //arrow function doesn't the its own this :c
    console.log(this);
  },
};
```
Well in that case `this` would be simply enough the `window` object based on everything I knew so far, NOT obj itself.

I guess I finally figured it out why `this` points to the instance.
When using the class notation that is actually converted to a constructor function behind the scenes, that's why they always say "classes are just syntactic sugar" well that's not actually quite true but for what I'm about to tell you it'll be enough.
So starting from there, any class will eventually be converted to something of the form:
```js
function constructor(){
  this.prop = 'yo'; // (*)
  Object.defineProperty(this, 'method', () => console.log(this)); // (**)
}
```
When a constructor function is called using the `new` operator a new object is created inside the function and assigned to its `this` keyword, at the end of the function it is returned implicitly.
That allows to add properties to that new object using the `this` keyword. (*)
However, considering class notation gets converted to constructor function notation, the methods added directly to the instance should look something like (**).
And what methods are added directly to the instance in class notation? Exactly, methods declared using arrow functions.
Then this gets interesting, since the method added in (**) is using an arrow function, the `this` will point to the outer `this` and what will that outer `this` be then? 
Well it's indeed the new empty object assigned to the `this` keyword created using the `new` operator.
So it makes sense that the methods declared using arrow functions in class notation have their `this` pointing to the instance.

The final object looks indeed like `obj` but since it has gone through the previus process, the `this` is already set in stone. 
The `this` of an arrow function points to the outer `this` from where it was **DECLARED**, not called as I thought at first.
