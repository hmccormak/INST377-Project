# INST377-Project

## Page can be found [Here](https://hmccormak.github.io/INST377-Project/)

# Have I Been Breached?

### Overview

Mainly targets desktop clients of all browsers, but is also compatible with mobile devices. However, the amin focus during development was desktop devices.

### Description

Uses two APIs from [haveibeenpwned.com](https://haveibeenpwned.com/), *https://haveibeenpwned.com/api/v3/breaches* and *https://api.pwnedpasswords.com/range/*. Breach data from the first API endpoint is used to visalize breach data in several meaningful ways using the [CanvasJS](https://canvasjs.com/) library. No external CSS frameworks were used, just flexbox and suffering. Three graphs are used, a bar graph of the top five breaches of all time, or of a specific year. The second shows a timeline of breach counts for all breach data. Finally, the last graph shows a pyramid graph of the number of breaches for each number of dataclass (user information type).

The second page was orignally intended to display information of a given email from the user. It would show various metrics in both text and graph form. However, due to technical difficulties with fetching the data using the private key, the page had to be scrapped and reworked. Currently, the page will display specific information pertaining to a website from user input in text form. Additionally, the page will also take a password from the user, convert to SHA1, and return the number of exposures of the password and other information.

The intention of this project was to make a more interactive version of HIBP. I felt that if people were given some interactive graphs and interfaces concerning security, they would be more inclined to employ better security practices in their daily lives.
