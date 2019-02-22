const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const abortController = require('abort-controller');

let linkErrors = [404, 400, 408, 502];
let currentDomain = "injuryverdicts.com";
const $ = cheerio.load(fs.readFileSync('./input.txt', 'utf8').toString(), { decodeEntities: false });

var checkBroken = function(status){
	if( linkErrors.indexOf(status) > -1){
		return true;
	}
	else
		return false;
}

var asyncForEach = async function(array, callback){
	for(var i =0; i < array.length; i++){
		await callback(i, array[i]);
	}
};

asyncForEach($('a, img'), async function(i,elem){
	let link = $(elem).attr('href') || $(elem).attr('src');
	let domainMatch = new RegExp(".*" + currentDomain + ".*", "gi");
	if( link == "/Contact.shtml" || link.match(/^mailto.*/gi) ){
		// console.log('Contact link')
	}
	else if( !link.endsWith(".jpg") && !link.endsWith(".png") && (link == "" || link.match(/^tel.*/gi) || link.match(domainMatch) || link.match(/^\/.*/gi) ) ){//Empty links and tel links. Ignore all images before blind replacing
		let contents = $(elem).contents();
		console.log("Blind replace:" + link);
		console.log("Content:" + contents);
		$(elem).replaceWith(contents);
	}
	else{
		const controller = new abortController(); //for Timeout. pulled off node-fetch API explanation
		const timeout = setTimeout(
		  () => { controller.abort() },
		  1000,
		);
		let fetchOptions = {
			method: 'GET',
			signal: controller.signal,
			headers : {
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
			}
		}
		try{
			console.log("Attempting fetch:" + link);
			var res = await fetch(encodeURI(link), fetchOptions);
			if(checkBroken(res.status)){
				let contents = $(elem).text();
				console.log("Replacing Broken: " + link);
				console.log("Content:" + contents);
				$(elem).replaceWith($(elem).text());
			}
		}
		catch(err){
			console.log(`Error: ${err} \n Error for Link: ${$(elem).text()}`);
			if(err.code == "ENOTFOUND" || "ECONNRESET" || "ERR_TLS_CERT_ALTNAME_INVALID" || "ETIMEDOUT" || "UNABLE_TO_VERIFY_LEAF_SIGNATURE"){ //Handle incorrect addresses
				let contents = $(elem).text();
				console.log("Replacing Erdearor Link: " + link);
				console.log("Content:" + contents);
				$(elem).replaceWith($(elem).text());
			}
		}
		finally{
			clearTimeout(timeout);
		}
	}
}).then(()=>{
	console.log("Sucessfully completed. I sometimes add html, head & body tags to the beggining/end of the output, make sure you remove if necessary.")
	fs.writeFileSync('output.txt', $.html());
});
