# Simeon's Best Hit Songs
![Next.js](https://img.shields.io/badge/Next.js-React-blue)
[![React.js](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strongly%20Typed-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-20232A?style=for-the-badge&logo=prisma)](https://www.typescriptlang.org/](https://www.prisma.io/))
[![Prisma](https://img.shields.io/badge/postgresql-darkblue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

## Overview
This is a site that displays my favorite Billboard Hot 100 hit songs in order of quality. All the songs come from the [Billboard Year-End Hot 100 lists](https://www.billboard.com/charts/year-end/), which have been released annually since 1959 and list the biggest Billboard hits of each year. This website is still a work in progress as I have not yet listened to every single previous Billboard Year-End Hot 100 list yet or determined what my favorite hits of each year are. But when I have listened through all the year-end lists and ranked them in order of quality, the finished site will contain my 1,000 favorite Billboard year-end hits, and that number may increase down the line. Users can even narrow it down by decade or year to see what my top 100 favorite hit songs of a certain decade or top 20 favorite hits of a certain year are, or even search for songs or artists to see if they made the list. You can view the site [here](https://simeon-s-best-hit-songs.vercel.app/).

## Inspiration
I have a YouTube channel where I do various videos on cartoons and music. One series of videos I do are [my best and worst hit songs videos](https://www.youtube.com/playlist?list=PLdViXKJLgLoICH9IJIp4XnpgLqTvx9Kue). Every December since 2020, when the new Billboard year-end list is released, I do two videos where I share my picks for the top 10 best and worst hit songs of the year based on the songs that debuted on the list (sometimes songs make two year-end lists, particularly those that are popular in the winter between two years, but I only consider them for the list if this is their first time debuting on a year-end list). Starting in May 2025, I began doing [a subseries of these videos](https://www.youtube.com/playlist?list=PLdViXKJLgLoJnrsx3aEcvHYMAkOXRBbMQ), sharing my picks for the top 10 best hit songs of every year from 2000-2019. At the end of the series, I've decided to reveal my top 100 songs of all the years from 2000-2019 combined. I decided to take that idea one step further and make a website revealing my top 1,000 Billboard year-end hits of all time. This way, when a new year-end list comes out, I can easily add it to the list, as well as reorder songs down the line when my opinions change (which happens from time to time). In any case, this website always contains my most up-to-date opinions of all the years that I've currently added and will grow as I continue listening to more year-end lists and determine the best hits of each year.

## Site structure
This site is built with Next.js, React, Tailwind and TypeScript and uses a Prisma ORM, connecting to a PostgreSQL database. The site contains simply two pages--the front-end where users can view the table and even narrow down the songs displayed to certain decades/years or search for songs or artists, and an admin backend, only accessible with an admin username and password. On this backend, I can easily add new songs, reorder songs if a certain song grows or cools on me over time or even edit existing songs. Users can also click on a song in the table to view more information about it. It also features responsive design for mobile users and pagination allowing users to go to the next page of results (only 20 songs are visible in the table at a time). Many of the site's features, such as the search button and the pagination, were built using Cursor. My app contains these environment variables:
```
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```
The first two environment variables are the username and password hash for accessing the admin page or using the API routes. The last three are the environment variables necessary for using Cloudinary, as my site fetches the single covers for the songs (which are visible when a user clicks on a song in the table for additional info) from Cloudinary.

## Database
As previously mentioned, this site uses a Prisma ORM and connects to a PostgreSQL database. The PostgreSQL database is hosted on Neon. Since I already have a Neon account, which I created because of a previous project, and since I wanted the data to be available whether the site was local or live on the web, I decided hosting the database on Neon would be the best way to store all the data. My database consists of a single table--Song--whose structure is defined in prisma/schema.prisma:
```
model Song {
  id            Int      @id @default(autoincrement())
  rank          Int      @unique
  title         String
  artist        String
  year          Int
  year_end_pos  Int
  hot_100_pos   Int
  createdAt     DateTime @default(now())
  updatedAt     DateTime @default(now()) @updatedAt
  album         String?
  label         String?
  genre         String
  albumNote     String?
  coverPublicId String
  coverURL      String
}
```
This was actually my first time building an app with Prisma, and despite some difficulty with a Prisma type mismatch at one part and nearly having to start my app over from scratch, I was able to get the hang of using it fairly easily. There is also one more environment variable required in my app--`DATABASE_URL`, which is the PostgreSQL connection string. Every time I add, edit or reorder a song in my admin backend, my site calls an API route and updates my database accordingly.

## Conclusion
This was a very interesting project for me to work on, and allowed me to combine my love of music and my love of web development. It also gave me some experience with working with Prisma and Cloudinary for my site. I hope I can put these newfound skills to good use down the line. I also hope my YouTube subscribers will appreciate this site and check back on it every now and then once I listen to a new year-end list or I mention that my opinions have changed and I have shuffled some songs around on the list. I hope you enjoy seeing my opinions on various music throughout the years. And you can always check out [my YouTube channel](https://www.youtube.com/@NorbertSD) to see me discuss music (and cartoons) in greater detail.
