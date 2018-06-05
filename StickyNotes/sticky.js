	var id=0;
	var objA = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
	localStorage.setItem('notes', JSON.stringify(objA));
	var data = JSON.parse(localStorage.getItem('notes'));
	//
	function store(element){
		//console.log(element.value);
		//var el=document.getElementById("notes");
		//console.log((el));
		var myId=element.getAttribute('data-myId');
		objA.push({'myId' : myId,'txt' : element.value});
		
		localStorage.setItem("notes",JSON.stringify(objA));
	}
	function create(entries){
		var frag=document.createDocumentFragment();
		var temp= document.getElementById('temp_note');
		temp=temp.cloneNode(true);
		frag.appendChild(temp.content);
		var txt=frag.children[0].children[1];
		txt.setAttribute('data-myId',(id++));
		blur(txt,blur);
		document.getElementById("notes").appendChild(frag);

	}
	function rem_note(element){
		//console.log(element.nextElementSibling.value);
		try{
			element.nextElementSibling.removeEventListener('blur',blur,false);
		}catch (e){
			console.error(e);
		}
		rem_data(element);
		document.getElementById("notes").removeChild(element.parentNode);
		//console.log(element.parentNode);
	}
	function remove(element){
		element.addEventListener('click',function(event){
				if(event.target.id == 'remove'){
					rem_note(event.target);
				}
			});
	}
	function blur(element,fn){
		element.addEventListener('blur',function(event){
				//console.log(event);
				if(event.target.id == 'txt'){
					add(event.target);
					//console.log(event.target.value);
				}
			});
	}
	document.getElementById("create").addEventListener('click',create);
	remove(document.getElementById("notes"),remove);
	
	