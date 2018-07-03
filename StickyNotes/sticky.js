	var id=0;
	var objA = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
	localStorage.setItem('notes', JSON.stringify(objA));
	var data = JSON.parse(localStorage.getItem('notes'));
	//
	function store(element){
		var myId=element.getAttribute('data-myId');
		objA.push({'myId' : myId,'txt' : element.value});
		
		localStorage.setItem("notes",JSON.stringify(objA));
	}
	function create(entries){
		entries=entries || null;
		var frag=document.createDocumentFragment();
		var temp= document.getElementById('temp_note');
		temp=temp.cloneNode(true);
		frag.appendChild(temp.content);
		//console.log(frag);
		var txt=frag.children[0].children[1];
		txt.setAttribute('data-myId',(id));
		if(entries.txt != undefined){
			//console.log('if',entries);
			txt.value=entries.txt;
		}
		blur(txt,blur);
		document.getElementById("notes").appendChild(frag);
		document.getElementById('note').id='note'+id;
		document.getElementById('note'+id).style.order=entries.ord ? entries.ord:id;
		
		//var nota = {'id':'note'+id, 'txt':, 'ord':}
		id++;
		//return nota;
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
	function search(){
		var elements= document.getElementsByClassName('txt');
		var text=this.value; var txtNote;
		if(elements.length != 0){
			for(var i=0; i<elements.length;i++){
				if(text ==''){
					elements[i].parentElement.style.display='block';
				}else{
					txtNote=elements[i].value;
					if(txtNote.indexOf(text) === -1){
						// console.log();
						elements[i].parentElement.style.display='none';
					}
				}
			}
		}
		//debugger
	}
	document.getElementById("create").addEventListener('click',create);
	document.getElementById("search").addEventListener('input',search);
	remove(document.getElementById("notes"),remove);
	
	//command pattern test
	
	