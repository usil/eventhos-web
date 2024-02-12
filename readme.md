# eventhos-web

## What is eventhos?

Eventhos is an open source platform that some principles of Event Driven Architectures to improve the integration or choreography between company systems.

Here a minimalist High Level Diagram

![](https://www.planttext.com/api/plantuml/png/LOv13e0W30JlVGNXpXSCFp556Y11CBJgzyM3YhVjP9fTou9DzZL3eqMmX4oA3f9OUSOjAMIb-rrkO3hGm58RXiywoVsj3ZHu57J8f9u0eszQ2b7CD5R1MFiAxxkbullC2m00)

To take a deep look into how eventhos works check the [documentation](https://github.com/usil/eventhos/wiki).

In this repository you will find the code of the artifact called **eventhos-web**

## Technologies Used

- Angular 13
- Webpack 5

## Requirement

- Nodejs >=14

## Environment variables

Following the [third commandment](https://12factor.net/config) we use environment variables to handle the configurations

| Variable                             | Description                                    | Default Value |
| ------------------------------------ | ---------------------------------------------- | ------------- |
| EVENTHOS_API_BASE_URL                       | The eventhos api base url           | NULL      |

Variables are defined in **src/settings.json**

More details about configurations [here](https://github.com/usil/eventhos-web/wiki/settings).

## Security

The authentication and authorization are managed by the api. Check [this](https://github.com/usil/eventhos-api#security) to get the login credentials

## Manual start (developers)

Export the required env variables or create a .env

```js
npm install
npm run dev
```

By default the app runs in the **4200** port.

## Manual start (production)

Export the required env variables or create a .env

```js
npm install
npm run build
npm run start
```
By default the app runs in the **2110** port.

## Usage

The artifact **eventhos-api** is required to use this web. To start the api following one of these

- https://github.com/usil/eventhos-api#manual-start-developers
- https://github.com/usil/eventhos-api#manual-start-production

## Contributions

Check this https://github.com/usil/eventhos-api/wiki/Contributions

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
    <td>
      <img src="https://avatars.githubusercontent.com/u/66818290?s=400&u=d2f95a7497efd7fa830cf96fc2dc01120f27f3c5&v=4" width="100px;"/>
      <br />
      <label><a href="https://github.com/iSkyNavy">Diego Ramos</a></label>
      <br />
    </td>
  </tbody>
</table>
