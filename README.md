# Eventhos Web Platform v0.0.2

This the web platform to use eventhos.

## Technologies Used

- Angular 13
- Webpack 5

## Requirement

- Nodejs >12

## Dynamic Settings

You will only have to use one settings file. For more info about this take a look at: <https://github.com/usil/nodeboot-spa-server>.

- Just modify the included `settings.json` file, with env variables that you need.
- Only create one build instead of creating one build for each stage (testing, production, development, etc). Just modify or replace the `settings.json` file.
- You can change the name of the file if you desire to do so, then you will need to also modify the `custom-webpack.config.js` file.

## For Development

### Adding Angular Materials

Add the materials in the materials folder that is present in each module.

Just run `ng serve` like always. This template uses a modified angular development server.

## Environment variables

| Variable                             | Description                                    | Default Value |
| ------------------------------------ | ---------------------------------------------- | ------------- |
| EVENTHOS_API_BASE_URL                       | The eventhos api base url           | NULL      |

## For Production

First use `ng build` then `npm start`, this will run `nodeboot-spa-server dist/template-dashboard -s settings.json -p 2000 --allow-routes`

## Testing

You can also look a the testing here as a template. The testing only covers the general parts of the app, adding for example a new angular material component, (in a any way different to the mentioned before), will break the testing. For more info take a look at <https://angular.io/guide/testing-components-scenarios>

`more functionalities in progress`

## Contributors

<table>
  <tbody>
    <td>
      <img src="https://i.ibb.co/88Tp6n5/Recurso-7.png" width="100px;"/>
      <br />
      <label><a href="https://github.com/TacEtarip">Luis Huertas</a></label>
      <br />
    </td>
    <td>
      <img src="https://avatars0.githubusercontent.com/u/3322836?s=460&v=4" width="100px;"/>
      <br />
      <label><a href="http://jrichardsz.github.io/">JRichardsz</a></label>
      <br />
    </td>
  </tbody>
</table>
