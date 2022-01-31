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

### More endpoints are coming soon and will be documented as they are created. It should be noted that this is a personal project and is hosted via free resources and as such cannot be expected to the most performant API. Please don't expext to be able to field 1000's of responses per second 😂

Coming soon...

- [x] GET request to receive a totally random bourbon (like a Bourbon of the Day!)
- [x] modifying the server response of the GET request to include the total number of records
- [x] access api via authorized api keys
- [x] add a USER Model/Schema
- [x] add a COLLECTION Model/Schema
- [x] add a WISHLIST Model/Schema
- [ ] add corresponding User routes (auth)
- [ ] add corresponding Collection routes (full crud)
- [ ] add corresponding Wishlist routes (full crud)
- [ ] integration into a frontend project that will allow for the building of digital bourbon collections and wishlists
