# PropertyPulse

## Description

This is the [serverless refactor of the PropertyPulse project](https://github.com/bradtraversy/property-pulse/tree/refactor) from [Brad Traversy](https://github.com/bradtraversy)'s [2024 Next.js from Scratch](https://learning.oreilly.com/course/next-js-from-scratch/9781836207979/) course on [O'Reilly](https://learning.oreilly.com/home/).

I made the following modifications:

- Added TypeScript

- Replaced `mapbox-gl` and `react-geocode` with Google Maps

- Kept the RESTful API even though it's currently unused

- Moved `NEXT_PUBLIC_DOMAIN` and `NEXT_PUBLIC_API_DOMAIN` into `next.config.ts`

- Deleting a property also deletes its images

- Made adding a property more efficient

- Editing a property only sends the changes

- Moved geocoding into a Server Action and an API route

- Added a link to the property inquired about in the Message Card

- Added the Bookmark Button to the Bookmarks Page

- Added Featured Properties and Pagination to Search Results

- Removed image upload limit

- Installed `sharp`

- Other minor modifications
