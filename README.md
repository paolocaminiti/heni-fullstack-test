# Server

```
/server
cp .env.def .env
provide a valid Havardart api key in .env
npm install
npm start (npm run dev to watch for changes)
npm test
```

# Client

```
/client
npm install
npm start
```

# Comments

## What I would do next?
I would investigate possible Harvardart API issues (eg. too large a page number returns 200 with an elastic search error in the payload) then either open issues with them or handle them in the service.

I would setup a deployment pipeline and since this is a public service make sure some ddos attacks mitigation is in place.

I would rise internal admin alerts (mail, slack/teams channel) to promptly handle Harvardart failures like downtime or api key expiration.

## Frontend Tests

I see no valuable business logic worth testing in the frontend. The point of failures of this frontend are it's dependency over the Harvardart api and Harvardart images provider, I would rather spend time to handle those gracefully first.
