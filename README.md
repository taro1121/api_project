# api_project

This is the repository for Shintaro's API project.

Project Name: Shintaro's Bicycle YouTube channel.

API: YouTube data API
(https://developers.google.com/youtube/v3/getting-started)

Purpose: Users who love to watch <bicycle> related YouTube come to this site and browse YouTube videos organized by various criteria.

Technology in use: HTML/CSS/JS/jQuery/YouTubeDataAPI/node.js

Support: Chrome (Desktop and Mobile)

UI: See wireframe.HEIC file in this repository for the visual structure.

Limitation: Depends on the data availability of the API.  May not support some search criteria/pagination/mobile.
There may be some limitations for showing videos (country, language, minimum view,,,).

User scenario:
1. By default, user can see videos (up to 100?) sorted by date.
2. User can search videos by custom string (i.e. "Tour de France").
3. User can see videos sort by Date/Views/Ranking/....
4. User can have most of the functionality in mobile.
5. Clicking video tile should open the video on new tab.
