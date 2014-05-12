var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var index = 0;
var target_url = 'http://www.appledaily.com.tw/realtimenews/section/new/';
var category = ['動物', 'FUN', '瘋啥', '搜奇', '正妹', '體育', 
'臉團', '娛樂', '時尚', '生活', '社會', '國際', '財經', '地產', '政治', '論壇'];


function switch_target(url, num){
	//console.log((url+num).toString());
	return (url + num).toString();
}

function writeTofile(data){
	fs.writeFile('appledaily.json', data, 'utf8', function(err){
		if(err) throw err;
		console.log('it is saved!');
	});
}
appledaily = [];
function initAppledaily(){
	category.map(function(content, index){
		//content = $(content);
		var type = {
			'category': content,
			'news_count': 0,
			'news':[]
		};
		appledaily.push(type);
	});
}
initAppledaily();
//console.log(appledaily);
function crawler(){
	request(switch_target(target_url, index + 1), function(err, response, body){
		if(err) return err;
		if(index === 5){
			appledaily = JSON.stringify(appledaily, null, 4);
			writeTofile(appledaily);
			return;
		}
		var $ = cheerio.load(body);
		var content = $('.rtddt');
		content.map(function(index, li){
			li = $(li);
			var type = li.find('h2').text();
			
			var news = {
				'title': li.find('h1').text(),
				'url': li.find('a').attr('href'),
				'time': li.find('time').text(),
				'video': false 
			};
			if(li.hasClass('hsv')){
				news['video'] = true;
			}
			//console.log(news);
			category.map(function(data, index){
				if(data === type){
					appledaily[index]['news'].push(news);
					appledaily[index]['news_count'] += 1;
				}
			});
		});	
		index++;
		setTimeout(crawler, 0);
	});
}

crawler();

