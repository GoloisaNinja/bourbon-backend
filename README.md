# The Bourbon Backend API 🥃

## This Bourbon API was created by scraping bourbon data from [Whiskey Raiders](https://whiskeyraiders.com/archive/?sort=bourbon) and using that data to seed a MongoDB cluster. Made for an awesome bourbon enthusiast to be able to consume a not-so-lame API. The API is not intended for production use. The API is located at https://bourbon-backend.herokuapp.com/api

### Endpoints

### /bourbons

- GET
  - /bourbons

The bourbons endpoint is a simple paginaged endpoint that will provide bourbons 20 records at a time. If no query params are used, the endpoint returns bourbons in alphabetical order (asc). The following query params can be used to mofify the repsonse of this endpoint. **UPDATE** **This endpoint now returns an object that contains "bourbons" and "total_records". Bourbons is an array and total records is a number. For example...**

```
{
  "bourbons": [
    { bourbon data ....},
    { more bourbon data...}
  ],
  "total_records": 2
}
```

- /bourbons?page=**PAGENUMBER**

You can provide a page query to receive bourbons from that page - bourbons limit per page is 20.

1. /bourbons?page=7 _this query will skip 120 records and will return bourbons 121 - 139_

- /bourbons?search=**SEARCHTERM**

You can provide a search term and the endpoint will normalize your request and search your term against bourbon titles, bottlers and distillers. Matches are returned in a paginated repsonse containing 20 bourbons per page.

- /bourbons?sort=**SORTBY**\_**SORTDIRECTION**

You can provide sort query params for age, abv, score, bottler, distiller, price, and title (this is default). You can separate your sort type and sort direction by an underscore. If you do not provide a sort direction, the default behavior is ascending direction. A few examples:

1. /bourbons?sort=bottler_desc _this will sort bourbons by bottler name in descending alphabetical order_
2. /bourbouns?sort=price_asc _this will sort bourbons by price - lowest to highest_
3. /bourbons?sort=score _note no direction is provided - this will sort bourbons by score (rating) and will default to ascending order lowest score to highest score_

It is also possible to combine these query parameters. You may include both a search term and a sort. Some examples would look like:

- /bourbons?search=barton&sort=score_desc _this request should return bourbons bottled, distilled, or with barton (case insensitive) in the title and will sort them by bourbon score highest to lowest_

- /bourbons?search=turkey&sort=price_asc _this request should return bourbons bottled, distilled, or with turkey (case insensitive) in the title and wil sort them by price lowest to highest_

### /bourbons/all

- GET
  - /bourbons/all

The bourbons/all endpoint is exactly as it sounds. Hitting this endpoint returns all the bourbons from the database at once. This response contains nearly 1MB of data and should really only be used if you REALLY need to get all the bourbons at once - otherwise the paginated route will be more efficient.

### /bourbons/random

- GET
  - /bourbons/random

This route will return a singular random bourbon. This endpoint will accept a query param of search if you'd like to fine tune your random response. Here are some examples:

- /bourbons/random _this will return a truly random bourbon from all 736 (at the time of writing) bourbons_
- /bourbons/random?search=barton _this will return a random bourbon from a collection of bourbons that contain the search term of "barton" in either the title, bottler, or distiller_

### More endpoints are coming soon and will be documented as they are created. It should be noted that this is a personal project and is hosted via free resources and as such cannot be expected to the most performant API. Please don't expext to be able to field 1000's of responses per second 😂

Coming soon...

- [x] GET request to receive a totally random bourbon (like a Bourbon of the Day!)
- [x] modifying the server response of the GET request to include the total number of records
- [ ] integration into a frontend project that will allow for the building of digital bourbon collections and wishlists
