const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');

let linkErrors = [404, 400];
const $ = cheerio.load(fs.readFileSync('./input.txt', 'utf8').toString());

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
	if(link == ""){
		let contents = $(elem).contents();
		$(elem).replaceWith(contents);
	}
	try{
		var res = await fetch(link);
		if(checkBroken(res.status)){
			let contents = $(elem).text();
			console.log("Removing the link. Inner Text of this link is: " +contents);
			$(elem).replaceWith($(elem).text());
		}
	}
	catch(err){
		console.log(`Error: ${err.code} for Link: ${$(elem).text()}`);
		if(err.code == "ENOTFOUND"){ //Handle incorrect addresses
			let contents = $(elem).text();
			$(elem).replaceWith($(elem).text());
		}
	}
}).then(()=>{
	console.log("Sucessfully completed. I sometimes add html, head & body tags to the beggining/end of the output, make sure you remove if necessary.")
	fs.writeFileSync('output.txt', $.html());
});
