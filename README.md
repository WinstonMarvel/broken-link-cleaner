# Broken Link Cleaner

Helps remove broken links from text/HTML files.

Here's how it works: 
* Reads code and finds anchor tags
* Sends an AJAX request to test links, and logs the links found to be broken
* For each broken link, it unwraps the anchor tags(Leaving behind the text)
* Incase of images, broken images are removed.

How to use:
* Run npm install once in the folder
* Paste text/html into the input.txt file
* Run the app with 'node app.js' (Edit the linkErrors array and add more errors codes if they need to be addressed)
* If the input was only text and not html. Then,open the output.txt and remove additional tags added
* Before you run the cleaner you might want to replace common links that you know need to be fixed. Eg. /contact-us/ to /Contact.html
