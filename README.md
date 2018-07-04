# Broken Link Cleaner

Helps remove broken links from text/HTML files.

Here's how it works: 
* Reads code and finds anchor tags
* Sends an AJAX request to test links, and logs the links found to be broken
* For each broken link, it unwraps the anchor tags(Leaving behind the text)

