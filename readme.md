# eventhos-web

## What is eventhos?

Eventhos is an open source platform that applies event-driven architecture principles to allow the user to orchestrate their system integrations using a simple user interface instead of complicated publisher and subscriber source codes in applications. You only need webhooks and rest APIs to integrate all your systems.

Here a minimalist High Level Diagram

![](https://www.planttext.com/api/plantuml/png/LOv13e0W30JlVGNXpXSCFp556Y11CBJgzyM3YhVjP9fTou9DzZL3eqMmX4oA3f9OUSOjAMIb-rrkO3hGm58RXiywoVsj3ZHu57J8f9u0eszQ2b7CD5R1MFiAxxkbullC2m00)

To take a deep look into how eventhos works check the [documentation](https://github.com/usil/eventhos/wiki).

## How it works?

Basically you have to identify the producers (webhooks) and consumers (apis). Then using th UI you can make a contract between the incoming event produced by a webhook (source system) to the rest api in in the target system. So with this you will have a real time integration between the producer and consumer systems without the complexity of kafka or similars.

![image](https://github.com/usil/eventhos/assets/3322836/2fafd3ab-5ad0-4cd8-a413-78caa15069a2)

More uses cases and deep explanation [here](https://github.com/usil/eventhos/wiki/Real-Use-Cases) and [here](https://github.com/usil/eventhos-web/wiki/SendEvent)


## Features

- Register all systems (producers and  consumers)
- Create contracts between your systems
- Ouath2 Security
- Manuel retry  on error
- Event Dashboard to see the received events and all the details (request/response)
- Reply-To option
- Json binding to match between the webhook json and target api json
- Vanilla javascript to binding to match between the webhook json and target api json
- Mail on error with the details
- User Management

More details [here](https://github.com/usil/eventhos/wiki/Features)

## Demo


> In this repository you will find the code of the web artifact called **eventhos-web**. You will need the [api](https://github.com/usil/eventhos-api) to get all the eventhos platform ready to use or develop

To build and start this platform you need knowledge about nodejs, mysql, angular, etc. To get your own version in less than 3 minutes, follow this guide:

https://github.com/usil/eventhos?tab=readme-ov-file#usage-get-last-stable-version-default-secrets

If you don't have errors, you will be able to see the home page at the `http://localhost:2110`

![image](https://github.com/usil/eventhos-web/assets/3322836/07394895-047a-428c-8dbf-72175f40f45e)


## Technologies

- Angular 13
- Webpack 5

## Requirement

- Nodejs >=14

## Environment variables

Following the [third commandment of 12factor](https://12factor.net/config) we use environment variables to handle the configurations

| Variable                             | Description                                    | Default Value |
| ------------------------------------ | ---------------------------------------------- | ------------- |
| EVENTHOS_API_BASE_URL                       | The eventhos api base url           | NULL      |

Variables are defined in **src/settings.json**

More details about configurations [here](https://github.com/usil/eventhos-web/wiki/settings).

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

Also you can use docker following [this](https://github.com/usil/eventhos-web/wiki/deployment_docker) guide

## Usage

The main use case could be found [here](https://github.com/usil/eventhos-web/wiki/SendEvent)

A complete user guide is in the [wiki](https://github.com/usil/eventhos-web/wiki)

## Security

The authentication and authorization are managed by the api. Check [this](https://github.com/usil/eventhos-api#security) to get the login credentials


## How to Contribute

Check this https://github.com/usil/eventhos-api/wiki/Contributions

## License

[MIT](./LICENSE)


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
