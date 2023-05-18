# Blep

Blep is a little toolkit for managing bootstrapping components into the DOM. It is ultra-lightweight, feature-sparse and opinion-free (just like the author). Blep will help you get your encapsulated code into the DOM tree but will leave you there to get on with what you need to do. It is designed to let you hack stuff together with minimal effort.

## Registration and hydration

Blep works in the intersection between the static page markup and the attachment of DOM scripting. To make it work you first update your HTML to add an element which Blep can recognise:

`<div data-component="true" data-component-type="examplecomponent"></div>`

Blep can now be used to mount this block as a JS component. Blep components are merely functions which receive a `Blep.BindingProps` object as their argument:

```
import {BindingProps} from @sfdl/blep;

const ExampleComponent = (props:BindingProps) => {
    // your component logic goes here
}

export default ExampleComponent;

```

All that now remains is to register your component with Blep and hydrate it. Usually the best place to do this is in a top level JS function (perhaps an IIFE or a dom-ready event handler):

```
import ExampleComponent from './ExampleComponent.js'
import { register, getMap, init } from '@sfdl/blep';

// get all the hydrateable elements on the page
const domList = document.querySelectorAll('[data-component]');

//register the component against Blep with the matching DOM element
register('examplecomponent', ExampleComponent);

// get the list of Blep components and hook it to the DOM
const map = getMap();
init(map, domList)

```

...and you have... nothing. Or at least nothing displayed. But this is just the start. Your component now has a reference to its relative place in the DOM and some other useful information with which to run.

## Why do this?

Or maybe "Why not use React/Angular/Vue/Svelte" etc etc. The short answer is that this is something very different. I write code on top of React pretty regularly and for building complex web apps at scale that kind of approach is perfect. Blep is intended for a world in which web _pages_ are the target. It's trivial, of course, to write a chunk of JS and stick it in a script tag on the page. Blep provides a small toolset for modularity, separation of concerns and encapsulation for interactive elements on web pages. It doesn't need to do much to enable this; really it just offers hydration of DOM elements, a small rendering loop and some basic cross-component message passing. But with these tools in hand, a developer can write sophisticated, modular components in modern code.

## How can I use it?

Pretty much any way you like. Your component is essentially a function which provides an entry point to any structure you like. You can just write imperative JS now if you like, perhaps with a little bit of encapsulation of your DOM access using the element reference provided to you in the props passed into your function. But you could do other things to - that DOM reference could also be a suitable entry point for one or more React applications - meaning that you could coexist React and non-React JS componentry in the same page and in the same codebase.

I like to use the imperative approach but with a minor enhancement to use the element reference returned from the `render` function to build a recursive rendering loop:

```
import {BindingProps, render} from @sfdl/blep;

const ExampleComponent = (props:BindingProps) => {

    let element = props.domElement;

    const doRender = () => {

        const date = new Date().getTime();

        const body = document.createElement('p');
        body.innerHTML = date;

        element = render(element, body)

        element.querySelector('p').addEventListener('click', () => {
            doRender();
        })

    }

    doRender();
}

export default ExampleComponent;
```

This (somewhat naive) example will drop an updated timestamp into the component on the page every time you click it, refreshing the DOM element with the newly created paragraph. `render` destroys all of the bound event listeners inside its container on call so you start from a clean sheet and can safely add new ones.

## Messaging

Through the `props` argument passed into every component, a pair of message related functions is received:

`ready`: is a callback function from the initializer. Call this _once_ on component initialization with a handler function reference to receive messages from the bus.

`sendMessage`: is a function reference - call this when you want to send a message to every Blep component on the page. It should be called with a Message type, which contains two keys: message (string) and type (string, optional).
