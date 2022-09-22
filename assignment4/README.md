# A well-know design pattern

![Case study](./assets/case-study.jpg "This a typical depedancy injection (DI)")

## Dependancy Injection (DI)

This is a typical DI example, it helps us to make our depedance classes (most of the time they are services) loosely coupled with their users. Some time, we want those users refer another implementation. You may see my unit test of controller [pattern-demo.spec.ts](./test/pattern-demo.spec.ts), it override the service by defining a mock object which implemented interface [StudentPattern](./src-ts/modules/student/student-pattern.ts).

## Show Case

Create a server using [express] (it is old school, done be bore), I use it for quick setup.

## Using Typescript

Javascript is too plain to demostrate the design pattern, therefore I setup [Typscript] and present the concept of the design pattern. 

## About Unit

I am practising TDD when doing this assignment. There are some other dependancies added for the testing purpose beside [Typscript] itself:

- [ts-node](https://www.npmjs.com/package/ts-node) - Make my life easier to allow run .ts file by transpiling them on the fly.
- [mocha] - My test runner
- [@testdeck/mocha](https://www.npmjs.com/package/@testdeck/mocha) - Mocha itself is insufficient to run [Typscript] unit test, it need another plug-in to interpret [Typscript] classes as test suites.
- [chai](https://www.npmjs.com/package/chai) - A cool validator that I have used for awhile.
- [nyc] - Something new I learn by doing this assignment. It can generate coverage report. It really cool to collect test result and able to share.
- [@istanbuljs/nyc-config-typescript] - Save my time to configure [nyc] report
- [source-map-support](https://www.npmjs.com/package/source-map-support) - It is required by [@istanbuljs/nyc-config-typescript]
- [sinon](https://www.npmjs.com/package/sinon) - I have used it for mock object a while.
- [ts-sinon] - Surprise [ts-sinon] not just [Typscript] extension but also provide stubInterface which is very helful 

### Tweaks

Set *transpileOnly* in [register.js](./register.js) to true where we avoid the compiler checking the test code. It is invoked by [mocha] via its config [.mocharc.json](./.mocharc.json).

### Enhancement

I was excited when the first unit test work, enjoy the time of practising TDD. Although, unit test can run and all the test cases are passed. By the way, there are some alert from the IDE:

* mockRespond via ts-sinon does not convince, need to find away to proper mock express response
* stub function property called is not allowed

I can't step too far to typescript unit test perfect and since it is the first assignment to submit.

## Build & Dockerized

Idealy build and run time should different stage. We need more dependancies when build but actually most of them are not really needed by run time. Here is an idea to release small package to run time:

1. Build with complete depedancies which defined in devDependencies of [package.json](./package.json). We may run below command:
> npm i --production=false

2. Build it with below command:
> npm run build

3. Clean up the node_modules
> rm -rf node_modules
> npm cache clean --force

4. Install minimun required packages
> npm i --production

5. [Dockerfile](./Dockerfile) is ready and was built successfully by using below command:
> docker build . -t student-api

Note: I don't push any docker hub since it is not required any where

## Run it in container

Run below docker command and it forward same port (3000) via localhost:
> docker run --publish 3000:3000 student-api



[express]: https://www.npmjs.com/package/express

[Typscript]: https://en.wikipedia.org/wiki/TypeScript
[mocha]: https://www.npmjs.com/package/mocha
[nyc]: https://www.npmjs.com/package/nyc
[@istanbuljs/nyc-config-typescript]: https://www.npmjs.com/package/@istanbuljs/nyc-config-typescript
[ts-sinon]: https://www.npmjs.com/package/ts-sinon