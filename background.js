var tabid;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.type=='open' && request.name != undefined){
    	tabid=sender.tab.id;
      	openCollectionPage(request.name);
    }
  	else chrome.tabs.sendMessage(tabid,request);
  	sendResponse({msg: "ok"});
  }
);
function openCollectionPage(name){
	chrome.tabs.create({url: getUrl(name), active: false});
}
function getUrl(name){
	var mapping={"Azuki":"azuki","MutantApeYachtClub":"mutant-ape-yacht-club"};
	var path=mapping[name];
	if(path==undefined)path=name;
	return 'https://blur.io/collection/'+path+'/bids';
}
