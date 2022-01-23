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

# Exercise specs
```
Using the api available at https://github.com/harvardartmuseums/api-docs please create a basic
api and front end app which does the following:
Delivers an API that is callable from a React built client and returns the following
unauthenticated information:
1. A feed of all public items classified as “Prints”, paged in pages of 10, ordered by rank,
descending, that have images and have been verified to the ‘Best’ standard.
2. Provide a basic react driven front end for the feed that displays the image.
3. Provide information on the detail of print you feel may be relevant (title etc).
4. Commit your code for the server and the client to GitHub and provide us with the url to the
repository.
5. Add any tests you feel are required, where necessary.
```

Requires a valid api key in /server/.env to run.
