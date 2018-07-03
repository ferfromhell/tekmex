var viewMod = (function(){
    function create(entries){
        entries=entries || {};
        var frag=document.createDocumentFragment();
        var temp= document.getElementById('temp_note');
        temp=temp.cloneNode(true);
        frag.appendChild(temp.content);
        //console.log(frag);
        var txt=frag.children[0].children[1];
        txt.setAttribute('data-myId',(modIndexedDB.getId()));
        if(entries.txt != undefined){
            //console.log('if',entries);
            txt.value=entries.txt;
        }
        document.getElementById("container").appendChild(frag);
        var note=document.getElementById('note');
        note.id='note'+modIndexedDB.getId();
        note.style.order=entries.ord ? entries.ord:modIndexedDB.getId();
        blur(txt,blur);
        dndMod.eventNote(note,dndMod.dragstart);
        modIndexedDB.add(txt);
        modIndexedDB.incId();
        //s('do',{'cmd':'create','undo':'delete','data':{id:note.id,txt:txt.value,ord:note.style.order}});
        return {id:note.id,txt:txt.value,ord:note.style.order};
    };
    function rem_note(element){
        //console.log(element.nextElementSibling.value);

        // debugger;
        try{
            element.removeEventListener('blur',blur,false);
        }catch (e){
            console.error(e);
        }
        modIndexedDB.rem_data(element);
        modIndexedDB.decId();
        document.getElementById("container").removeChild(element.parentNode);
        //console.log(element.parentNode);
    };
    function remove(element){
        element.addEventListener('click',function(event){
                if(event.target.id == 'remove'){
                    rem_note(event.target);
                    var note=event.target.parentNode;
                    //console.log(note.querySelector('#txt').value);
                    s('do',{'cmd':'delete','undo':'create','data':{id:note.id,txt:note.querySelector('#txt').value,ord:note.style.order}});
                }
            });
    };
    function blur(element,fn){
        element.addEventListener('blur',function(event){
                console.log(event);
                if(event.target.id == 'txt'){
                    //add(event.target);
                    var note=event.target.parentElement;
                    var txt=event.target.value;
                    var obj={ 'id': note.id,'txt': txt,'ord':note.style.order};
                    modIndexedDB.update(obj);
                    //
                }
            });
    };
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
                        elements[i].parentElement.style.display='none';
                    }
                }
            }
        }
    };
    function hasNote(obj,cursor){
        var txt;
        if(obj instanceof HTMLElement){
            if(obj.getAttribute('style').indexOf("order:")!= -1){
                //console.log('Note drop',obj.children[1].value);
                txt={'id':obj.id,'txt':obj.children[1].value,'ord':+cursor.value.ord}
            }
        }else{
            //txt={'id':obj.id,'txt':obj.txt,'ord':+cursor.value.ord};
            txt={'id':obj.id,'txt':obj.txt,'ord':+obj.ord};
        }
        return txt;
    };
    function getNoteElement(data){
        return document.getElementById(data.id).querySelector('#txt');
    };
    function checkButtons(i){
        var uButton=document.getElementById('undo');
        var rButton=document.getElementById('redo');
        console.log(i);
        if(i>0){
            enableButton(uButton);
        }else{
            disableButton(uButton);
        }
    
    };
    function disableButton(button){
        console.log(button);
        button.disabled=true;
    };
    function enableButton(button){
        console.log(button);
        button.disabled=false;
    };
    return {
        create: create,
        rem_note: rem_note,
        remove: remove,
        blur: blur,
        search: search,
        hasNote: hasNote,
        getNoteElement: getNoteElement,
        checkButtons: checkButtons
    }
})();
var dndMod=(function(){
    function drop(event) {
        // console.log('drop event');
        var note_id = event.dataTransfer.getData('Data');
        var note_tg=modMoveNote.getTarget(event.target);
        // console.log(event);
        var n1=document.getElementById(note_id);
        //var oldIndex= n1.style.order;
        // console.log('note',n1);
        var n2=document.getElementById(note_tg.id);
        //var newIndex=n2.style.order;
        
        modMoveNote.changeOrder(n1,n2);
      };
      function setNewOrder(notes){
        for(var i=0;i<notes.length;i++){
            console.log(notes[i]);
            document.getElementById(notes[i].id).style.order=notes[i].ord;
            modIndexedDB.update(notes[i]);
        }
    };
    function dragstart(event) {
        var note=event.target;
        // console.log(event);  
        // console.log('noteid',note.id);
        event.dataTransfer.setData('Data', note.id);
        
    };
    function eventNote(note,fn){
        note.addEventListener(fn.name,fn);
    };
    function dragend(note, event) {
        // console.log('dragend');
        return false;
    };  
    function dragenter(target, event) {
        // console.log('dragenter')
        return false;
    };
    function dragover( event) {
        event.preventDefault();
    }; 
      return {
        drop: drop,
        setNewOrder: setNewOrder,
        dragstart: dragstart,
        eventNote: eventNote,
        dragend:dragend,
        dragenter:dragenter,
        dragover:dragover    
      }
})();
document.getElementById("create").addEventListener('click',function(){
    var note=viewMod.create();
    console.log(note);
    s('do',{'cmd':'create','undo':'delete','data':note});
});
document.getElementById("search").addEventListener('input',viewMod.search);
document.getElementById("undo").addEventListener('click',function(){
console.log('Undo btn:', this);
s('undo');
});
document.getElementById("redo").addEventListener('click',function(){
console.log('Redo');
s('redo');
});
var container=document.getElementById('container');
container.addEventListener('drop',dndMod.drop);
container.addEventListener('dragover', dndMod.dragover);
viewMod.remove(container,viewMod.remove);
