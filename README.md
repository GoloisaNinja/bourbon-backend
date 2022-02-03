# The Bourbon Backend API 🥃

## This Bourbon API was created by scraping bourbon data from [Whiskey Raiders](https://whiskeyraiders.com/archive/?sort=bourbon) and using that data to seed a MongoDB cluster. Made for an awesome bourbon enthusiast to be able to consume a not-so-lame API. The API is not intended for production use. The API is located at https://bourbon-backend.herokuapp.com/api

## IMPORTANT!

## This service is now locked behind user specific API keys to reduce traffic of unknown users. Each endpoint will now need an apiKey query parameter with a VALID and CURRENTLY ACTIVE API key that can be verified by our service. At this time we are not accepting new requests for API keys. As the project progresses this will likely change, and this README will be updated with info on how/where to obtain your key.

### all endpoints should now include the apiKey query parameter - example https://bourbon-backend.herokuapp.com/api/bourbons?page=2&apiKey=abcdefuandyourmomandyoursisterandyourjob

### Endpoints

## /bourbons

### /bourbons

- GET
  - /bourbons

The bourbons endpoint is a simple paginaged endpoint that will provide bourbons 20 records at a time. If no query params are used, the endpoint returns bourbons in alphabetical order (asc). The following query params can be used to mofify the repsonse of this endpoint. **UPDATE** **This endpoint now returns an object that contains "bourbons" and "total_records". Bourbons is an array and total records is a number. For example...**

```
{
  "bourbons": [
    { bourbon object 1 ...},
    { bourbon object 2...}
  ],
  "total_records": 2
}
```

- /bourbons?page=**\<PAGENUMBER\>**

You can provide a page query to receive bourbons from that page - bourbons limit per page is 20.

1. /bourbons?page=7 (**_this query will skip 120 records and will return bourbons 121 - 139_**)

- /bourbons?search=**\<SEARCHTERM\>**

You can provide a search term and the endpoint will normalize your request and search your term against bourbon titles, bottlers and distillers. Matches are returned in a paginated repsonse containing 20 bourbons per page.

- /bourbons?sort=**\<SORTBY\>**\_**\<SORTDIRECTION\>**

You can provide sort query params for age, abv, score, bottler, distiller, price, and title (this is default). You can separate your sort type and sort direction by an underscore. If you do not provide a sort direction, the default behavior is ascending direction. A few examples:

1. /bourbons?sort=bottler_desc (**_this will sort bourbons by bottler name in descending alphabetical order_**)
2. /bourbouns?sort=price_asc (**_this will sort bourbons by price - lowest to highest_**)
3. /bourbons?sort=score (**_note no direction is provided - this will sort bourbons by score (rating) and will default to ascending order lowest score to highest score_**)

It is also possible to combine these query parameters. You may include both a search term and a sort. Some examples would look like:

1. /bourbons?search=barton&sort=score_desc (**_this request should return bourbons bottled, distilled, or with barton (case insensitive) in the title and will sort them by bourbon score highest to lowest_**)

2. /bourbons?search=turkey&sort=price_asc (**_this request should return bourbons bottled, distilled, or with turkey (case insensitive) in the title and wil sort them by price lowest to highest_**)

### /bourbons/all

- GET
  - /bourbons/all

The bourbons/all endpoint is exactly as it sounds. Hitting this endpoint returns all the bourbons from the database at once. This response contains nearly 1MB of data and should really only be used if you REALLY need to get all the bourbons at once - otherwise the paginated route will be more efficient.

### /bourbons/random

- GET
  - /bourbons/random

This route will return a singular random bourbon. This endpoint will accept a query param of search if you'd like to fine tune your random response. Here are some examples:

1. /bourbons/random (**_this will return a truly random bourbon from all 736 (at the time of writing) bourbons_**)
2. /bourbons/random?search=barton (**_this will return a random bourbon from a collection of bourbons that contain the search term of "barton" in either the title, bottler, or distiller_**)

### /bourbons/:id

- GET
  - /bourbons/:id

This route will return a singular bourbon based on the bourbon id passed as a request parameter. Here is an example:

1. /bourbons/61ea5e11c6963461375bba80?apiKey=abcdefuandyourmomandyoursisterandyourjob

```
{
    "review": {
        "intro": "1792 Full Proof is typically a small batch, proofed release from Barton in Kentucky. Bottled at 125pf, it is hard to tell what the original barrel proof was for these releases, but all the same, 62.5% ABV isn't a bad number to run with. This is very similar to Knob Creeks Single Barrel Reserve, which is a release consistently diluted to 60% ABV and I like those all the way from fine to amazing. In this series, I'm comparing a variety of Single Barrel releases from the Full Proof lineup, selected by various stores, vendors and societies in the USA.",
        "nose": "Honey, apples and pears, vanilla cream, light cocoa. Some light almond, ethanol.",
        "taste": "Honey, ethanol. Nice medium mouth feel. Vanilla cream, fruity apple tart, faint chalky character. Some bitter oak, light pepper.",
        "finish": "Long but very hot. Apples, vanilla cream, cocoa and rich oak. Faint tobacco. Mostly fruity and hot.",
        "overall": "This is nice, but very hot. It leans towards the fruity and oaky profile with notes like caramel and toffee that I usually find in bourbons taking the back seat.",
        "score": "5",
        "author": "t8ke"
    },
    "_id": "61ea5e11c6963461375bba80",
    "title": "1792 Full Proof MCs Package Store Selection",
    "image": "https://whiskeyraiders.com/wp-content/uploads/2020/11/ORG_DSC02811-1024x683.jpg",
    "distiller": "Barton",
    "bottler": "Barton",
    "abv": "62.5%",
    "abv_value": 62.5,
    "age": "NAS",
    "age_value": 0,
    "price_array": [
        "$",
        "$"
    ],
    "price_value": 2,
    "__v": 0
}
```

## /user

### /user

- POST
  - /user

The /user POST route will create a new user in the database. The /user route expects a username, a valid email address, and a password. The password must contain at least 7 characters, one uppercase, one lowercase, and one symbol. The password also MUST NOT contain the string "password" or creating the new user will fail. The password will be hashed by the server with bcrypt before being saved to the database. Here is an exampe of a good user creation POST:

- /user?apiKey=abcdefuandyourmomandyoursisterandyourjob
  - request body looks like:

```
{
  "username": "Capone",
  "email": "tommygun01@hotmail.com",
  "password": "pAyUrTaxEs!"
}
```

If successful - your request will generate a status code 201 and return the user object in the response to be used in your frontend.

### /user/login

- POST
  - /user/login

The /user/login route, if provided with a valid user email and password will generate a user jsonwebtoken and store that token on the user object. The generated token can later be used to load a user if the token still exists in the user's token array. An example request to this endpoint looks like:

- /user/login?apiKey=abcdefuandyourmomandyoursisterandyourjob
  - request body looks like:

```
{
  "email": "tommygun01@hotmail.com",
  "password"; "pAyUrTaxEs!"
}
```

If successful - your request will generate a status code of 200 and return both the user and the token in the response to be used in your frontend.

## /collection & /wishlist

## IMPORTANT! collection routes and wishlist routes are identical given the similarity in schema design, as such you can simply replace "collection" with "wishlist" in the routes below to create/read/update/delete wishlists

### /collection

- POST
  - /collection

The /collection route requires a "name" to be sent in the request body and will create a collection with that name. An example of the collection schema:

```
{
    "user": {
        "id": "abcdefghijklmnopqrstuvwxyz",
        "username": "Capone"
    },
    "name": "tommygun bourbons #1",
    "private": true,
    "_id": "a1b1c1d1e1f1YouWon",
    "bourbons": [],
    "__v": 0
}
```

Note the empty bourbon array at collection creation - there is a corresponding post route that will allow us to start filling our collection with bourbons. The collection also contains a user reference for easier server validation to ensure that only the user that owns the collection can make changes to it. There is private flag on the collection object that defaults to true. When creating a new collection you can pass a boolean to req.body.private to set private to false if you would like your collection to be available for other users to view. Other users may only view a collection that is a: created by them, b: has a private flag set to false. Users may only modify collection objects that were created by them. The server also creates a corresponing/companion collection record on the user object under the collections array.

```
[
  {
      "collection_id": "a1b1c1d1e1f1YouWon",
      "collection_name": "tommygun bourbons #1",
      "_id": "xxccddvv1122"
  }
]
```

We don't want to store all the collection data (bourbon data, etc) on the user object, however, it is useful to keep the collection names and id's on the user object for quick access to basic collection data on the front end using just the user object data.

An example request to the /collection endpoint looks like this:

- /collection?apiKey=abcdefuandyourmomandyoursisterandyourjob
  - request body like:

```
{
  "name": "tommygun bourbons #1"
}
```

A successful request will result in a 201 status code and the return of the newly created collection object in the response.

### /collection/add/:collection_id

- POST
  - /collection/add/:collection_id

The collection/add/:collection_id route will add a bourbon to a user's collection. The :collection_id request parameter should contain a vaild collection id and the collection should belong to the authenticated user that is making the request. In order to add a bourbon to a collection the request body needs to contain a "bourbonId" and a "bourbonTitle". After successfully adding a bourbon to a collection, the collection will like:

```
{
    "user": {
        "id": "abcdefghijklmnopqrstuvwxyz",
        "username": "Capone"
    },
    "name": "tommygun bourbons #1",
    "_id": "a1b1c1d1e1f1YouWon",
    "private": true,
    "bourbons": [
        {
            "title": "1792 Full Proof",
            "bourbon_id": "aabbccddee11",
            "addedToCollection": "2022-02-01T20:21:37.972Z",
            "_id": "ssddff123345"
        },
    ],
    "__v": 3
}
```

The collection now contains a bourbon! The bourbon object will contain the name and the bourbon id, as well as an "addedToCollection" property that reflects when the bourbon was added to the collection.

An example request to the /collection/add/:collection_id endpoint looks like this:

- /collection/add/a1b1c1d1e1f1YouWon?apiKey=abcdefuandyourmomandyoursisterandyourjob
  - request body like:

```
{
  "bourbonId": "aabbccddee11",
  "bourbonTitle": "1792 Full Proof"
}
```

A successful request will result in a 200 status code and the return of the collection object in the response.

### /collection/:collection_id

- GET
  - /collection/:collection_id

The collection/:collection_id GET route will retrieve a collection and return the collection in the response with a status code of 200. A user can query their own collections and any collection that has a "private" flag set to false.

### /collection/delete/:collection_id

- DELETE
  - /collection/delete/:collection_id

The collection/delete/:collection_id DELETE route will delete a bourbon from a specified collection. The request will be authenticated and the collection must belong the user that is requesting the deletion. The bourbon id of the bourbon you wish to delete must be included in the request body. An example request will look like:

- /collection/delete/123456789abcdefg?apiKey=abcdefuandyourmomandyoursisterandyourjob
  - request body like:

```
{
  "bourbonId": "abcdef123456789"
}
```

If successful the server will respond with a status code of 200 and will return the collection object with the requested bourbon now removed.

### /collection/:collection_id

- DELETE
  - /collection/:collection_id

The collection/:collection_id DELETE route will delete an ENTIRE collection. The request will be authenticated and the collection must belong the user that is requesting the deletion. An example request will look like:

- /collection/123456789abcdefg?apiKey=abcdefuandyourmomandyoursisterandyourjob
  - no request body needed

If successful the server will respond with a status code of 200 and will return the user's collection objects with the requested collection now removed.

### /collection/update/:collection_id

- PATCH
  - /collection/update/:collection_id

The collection/update/:collection_id PATCH route will update a collection's private flag. The request will be authenticated and the collection must belong to the user that is requesting the patch. The request body must contain a boolean in the key "private". If the user collection private flag already matches the request, then the server will take no action and will respond with a status code 200 and message saying both states are equal. An example request will look like:

- /collection/update/123456789abcdefg?apiKey=abcdefuandyourmomandyoursisterandyourjob
  - request body like:

```
{
  "private": false
}
```

If successful the request will be executed and the server will respond with a status code of 200 and return the collection object with the updated "private" flag.

## /review

## review route documentation coming soon...

Example review schema:

```
{
    "bourbonName": "1792 Bottled in Bond",
    "bourbon_id": "61ea5e11c6963461375bba7b",
    "reviewTitle": "Bliss in Bond",
    "reviewScore": "7",
    "reviewText": "This smooth bourbon from Barton is a joy to drink and is not as expensive as you might think. I highly recommend this superb bourbon!"
}
```

### More endpoints are coming soon and will be documented as they are created. It should be noted that this is a personal project and is hosted via free resources and as such cannot be expected to the most performant API. Please don't expext to be able to field 1000's of responses per second 😂

Coming soon...

- [x] GET request to receive a totally random bourbon (like a Bourbon of the Day!)
- [x] modifying the server response of the GET request to include the total number of records
- [x] access api via authorized api keys
- [x] add a USER Model/Schema
- [x] add a COLLECTION Model/Schema
- [x] add a WISHLIST Model/Schema
- [x] add a REVIEW Model/Schema
- [x] add corresponding User routes (auth)
- [x] add corresponding Collection routes (full crud)
- [x] add corresponding Wishlist routes (full crud)
- [ ] add corresponding Review routes (full crud)
- [ ] integration into a frontend project that will allow for the building of digital bourbon collections and wishlists
