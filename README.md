# PropertyPulse

## Description

This is the [refactor of the PropertyPulse project](https://github.com/bradtraversy/property-pulse/tree/refactor) from [Brad Traversy](https://github.com/bradtraversy)'s [2024 Next.js from Scratch](https://learning.oreilly.com/course/next-js-from-scratch/9781836207979/) course on [O'Reilly](https://learning.oreilly.com/home/).

I made the following modifications:

- Added TypeScript

- Replaced `mapbox-gl` and `react-geocode` with Google Maps

- Added a link to the property inquired about in the Message Card

- Added the Bookmark Button to the Bookmarks Page

- Added Featured Properties and Pagination to Search Results

- Kept the RESTful API instead of using Server Actions

- Added roles to users. The first user is the root user, and each subsequent user is an ordinary user by default.

- Added an API endpoint for changing a property's featured status. Only an admin or the root user can do this.

- Added API endpoints for adding photos to and deleting a photo from a property.

- Added the page for adding images to a property

- Moved `NEXT_PUBLIC_DOMAIN` and `NEXT_PUBLIC_API_DOMAIN` into `next.config.ts`

- Deleting a property also deletes its images

- Editing a property only sends the changes

- Moved geocoding into an API endpoint

- Removed image upload limit

- API efficiency improvements

- Installed `sharp`

- Other minor modifications
