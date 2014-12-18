function HighlightEntitity(prefix, exact, suffix){

var textLayer = document.getElementsByClassName('textLayer')[0];
var search = exact;
var match = [];
var tmatch = []; // temp match
var lastMatchPos = null;
var startAt = 0;
for(i = 0; i < textLayer.children.length -1; i++){
	if(i =="length")break;
	stidx = 0;
	stlength = search.length;
	//console.log(textLayer.children);
	var divLength = textLayer.children[i].innerHTML.length;
	if(startAt !== 0) i--;
	var firstCharIndex = textLayer.children[i].innerHTML.indexOf(search[stidx], startAt);
	if(lastMatchPos !== null){ //if match started in previous div

		for(j = lastMatchPos; j < stlength; j++){
			charIdx = - lastMatchPos + j; //from the begining of the next div
			//console.log("charidx", charIdx, 'j:', j);
			console.log('secText:', textLayer.children[i].innerHTML[charIdx], 'secSearch:', search[parseInt(j)]);
			if(textLayer.children[i].innerHTML[charIdx] === search[parseInt(j)]){//if chars match in sequence push every char position in temp. match
				if(charIdx === 0){
					if(divLength === 1){
						tmatch.push({"divIdx": i, "charIdx": charIdx, position: "single"});
					}else{
						tmatch.push({"divIdx": i, "charIdx": charIdx, position: "first"});	
					}	
				}
				
				else if(j === stlength -1){
					tmatch.push({"divIdx": i, "charIdx": charIdx, position: "last"});
				}
				else{ 
					tmatch.push({"divIdx": i, "charIdx": charIdx, position: "middle"});
				}
				
				if(tmatch.length === stlength){// check every time if search is complete
					if(Prefix(tmatch) || Suffix(tmatch)) match.push(tmatch);
					console.log('prefix', Prefix(tmatch), 'suffix', Suffix(tmatch));
					tmatch = [];
					lastMatchPos = null;
				}
			}else{ // else clear temp and break early
				tmatch = [];
				break;
			}
//console.log('tempMatch2:', tmatch.length, 'j2:', (1 + j) ,"charIdx2:", charIdx,"divLength2:", (divLength -1));
			if(tmatch.length == (1 + j) && charIdx == (divLength -1)){//if all chars matched untill now and there are no more text in div, remember last matched letter index, temp match will persist
				lastMatchPos = (1 + j);
				break;
			}
	}
}

	if(firstCharIndex !== -1){
		startAt = firstCharIndex + 1;
		for(j=0; j < stlength; j++){
			charIdx = parseInt(firstCharIndex) + parseInt(j);
			console.log(textLayer.children[i].innerHTML[charIdx], search[parseInt(j)]);
			if(textLayer.children[i].innerHTML[charIdx] === search[parseInt(j)]){//if chars match in sequence push every char position in temp. match
				if(j === 0){
					if(divLength === 1){
						tmatch.push({"divIdx": i, "charIdx": charIdx, position: "single"});	
						startAt = 0;
					}else{
						tmatch.push({"divIdx": i, "charIdx": charIdx, position: "first"});	
					}
				}
				else if(j === stlength -1 || charIdx == (divLength -1)){
					tmatch.push({"divIdx": i, "charIdx": charIdx, position: "last"});
				}
				else{ 
					tmatch.push({"divIdx": i, "charIdx": charIdx, position: "middle"});
				}
				if(tmatch.length === stlength){// check every time if search is complete
					if(Prefix(tmatch) || Suffix(tmatch)) match.push(tmatch);
					console.log('prefix', Prefix(tmatch), 'suffix', Suffix(tmatch));
					tmatch = [];
					lastMatchPos = null;
				}
			}else{ // else clear temp and break early
				tmatch = [];
				break;
			}
			//console.log('tempMatch:', tmatch.length, 'j:', (1 + j) ,"charIdx:", charIdx,"divLength:", (divLength -1));
			if(tmatch.length == (1 + j) && charIdx == (divLength -1)){//if all chars matched untill now and there are no more text in div, remember last matched letter index, temp match will persist
				lastMatchPos = (1 + j);
				startAt = 0;
				break;
			}
		}
	}else{
		startAt = 0;
	}
}

console.log(match);

function Prefix(match){
	//prefix = noWhitespace(prefix);
	var k = 0;
	var j=0;
	var divIdx = match[0].divIdx;
	var charIdx = match[0].charIdx;
	var divText = textLayer.children[divIdx].innerHTML;
	for (var i = prefix.length - 1; i >= 0; i--){
		j++;

		if(charIdx -j < 0){// if end of div
			--divIdx; 
			 k = j;//remember position of j
			 //divText = noWhitespace(textLayer.children[divIdx].innerHTML);
			 divText = textLayer.children[divIdx].innerHTML;
			 charIdx = divText.length - 1; // set char index to end of previous div
			}; 
		//console.log("j", j, "k", k, "i", i);	
		if(/\s/.test(divText[charIdx - j + k])){ j--;};
		if(/\s/.test(prefix[i])){ i--;};
		console.log('divText[charIdx - j + k]:', divText[charIdx - j + k], 'prefix[i]:', prefix[i], "divTextLength", divText.length);
		if (divText[charIdx - j + k] === prefix[i]){ // if div is changed k will reset position counter (j) to start from the end of previous div
			//console.log('prefix[',i,']: true');
			continue;
		}else{
			return false;
		}
		

	};
	return true;
}

function Suffix(match){
	//suffix = noWhitespace(suffix); //trim whitespace from suffix
	var k = 0;
	var j=0;
	var divIdx = match[match.length-1].divIdx;
	var charIdx = match[match.length-1].charIdx;
	var divText = textLayer.children[divIdx].innerHTML;
	for (var i = 0; i < suffix.length - 1 ; i++){
		j++;
		if(charIdx +j > divText.length - 1){// if end of div
			++divIdx; 
			 k = j;//remember position of j
			 //divText = noWhitespace(textLayer.children[divIdx].innerHTML);
			 divText = textLayer.children[divIdx].innerHTML;
			 charIdx = 0; // set char index to the start of the next div
			}; 
		console.log(divText[charIdx + j - k], suffix[i]);
		if(/\s/.test(divText[charIdx + j - k])){ j++;}; //if next char is whitespace try next char()
		if(/\s/.test(suffix[i])){ i++;};
		if (divText[charIdx + j - k] === suffix[i]){ // if div is changed k will reset position counter (j) to start from the begining of the next div
			console.log('suffix[',i,']: true');
			continue;
		}else{
			return false;
		}
		

	};
	return true;
}

function noWhitespace(str){
return str.replace(/\s/g, "");
}

function highlight(match){
	var divIdx = match.divIdx;
	var charIdx = match.charIdx;
	var position = match.position;
	//console.log('div:', divIdx,"char:", charIdx);
	var div = textLayer.children[divIdx];
	var content = div.innerHTML;
	//console.log(position);
	switch(position) { 
	    case "first":
	        var newContent = content.substr(0, charIdx) + '<span class="highlight">' + content[charIdx] + content.substr((charIdx +1), content.length);
	        break;
	    case "middle":
	        var newContent = content;//.substr(0, charIdx) + content[charIdx] + content.substr((charIdx +1), content.length);
	        break;
	    case "last":
	        var newContent = content.substr(0, charIdx +24) + content[charIdx + 24] + '</span>' + content.substr((charIdx +25), content.length);
	        break;
	    case "single":
	        var newContent = content.substr(0, charIdx) + '<span class="highlight">' + content[charIdx] + '</span>' + content.substr((charIdx +1), content.length);
	        break;
	    default:
	        break
	}
	
	//console.log(newContent);
	div.innerHTML = newContent;//clear old content and append highlighted one
}


for (n in match) {
	for(m in match[n]){
		highlight(match[n][m]);
	}
}

}

HighlightEntitity('de, ', 'Austin', ' and'); // What if there are more "D"-s in div?
