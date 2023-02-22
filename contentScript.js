window.addEventListener ("load", pageLoad, false);

function pageLoad (evt) {
	setTimeout(tryRun,3000);
}
function tryRun(){
	if(window.location.href=='https://blur.io/portfolio/bids')tryRunBidPage();
	else tryRunCollectionPage();
}
var output={};
var bids={};
const filters={'MutantApeYachtClub':1,'Azuki':1};
function tryRunBidPage(){
	var list=$('div#portfolio-main').find('div>div>div>div.interactive>div>a');
	if(list.length==0){setTimeout(tryRunBidPage,1000);return;}
	for(var idx=0;idx<list.length;idx++){
		var row=list[idx];
		var name=$(row.childNodes[0]).find('div>div')[0].innerHTML;
		var price=row.childNodes[2].childNodes[0].innerHTML;
		if(filters[name]!=undefined){
			output[name]=row.childNodes[3].childNodes[0];
			bids[name]=price;
			var type='open';
			chrome.runtime.sendMessage({type,name,price});
		}
	}
}

function tryRunCollectionPage(){
	var list=$('div#collection-main').find('div.interactive').find('div.row');
	if(list.length==0){setTimeout(tryRunCollectionPage,1000);return;}
	var name=$('div#OVERLINE>div>div>div')[1].childNodes[0].innerHTML;
	var data = [];
	for(var idx=0;idx<list.length;idx++){
		var row=list[idx];
		var price=$(row.childNodes[0]).find('div>div>div')[0].innerHTML;
		var size=$(row.childNodes[1]).find('div')[0].innerHTML;
		var total=$(row.childNodes[2]).find('div')[0].innerHTML;
		data.push({price,size,total});
	}
	console.log(data);
	var type='data';
	chrome.runtime.sendMessage({type,name,data});
	setTimeout(tryRunCollectionPage,5000);
}

function processData(name,data){
	console.log(name);
  	console.log(data);
  	if(output[name]!=undefined){
  		var topPrice=data[0].price;
  		var total=0;
  		for(var i=0;i<data.length;i++){
  			if(data[i].price==bids[name])break;
  			total+=parseFloat(data[i].total);
  		}
  		output[name].innerHTML=total.toFixed(0)+'<span  style="color:red">@</span>'+topPrice;
  	}
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.type == "data"){
    	processData(request.name,request.data);
  	}
  	sendResponse({msg: "ok"});
  }
);
