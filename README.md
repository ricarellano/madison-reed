# madison-reed

This project is a monorepo usin lerna the service package is a express
bootstrapped app and ui package was made with create-react-app

to run the application please install all the dependencies using 
``` 
npx lerna bootstrap
```
and then to run all the project
```
npx lerna run start
```
each project has his own test you can run in each package
```
yarn test
```

and also you can find a postman collection on the
root of the repo to add transactions


## integration tests

this tests are in the UI package to run them locate in the package and run

```
yarn run cypress open
```
