var modIndexedDB = (function(){
    var id=0;
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
    if (!window.indexedDB) {
        console.error("Your browser doesn't support a stable version of IndexedDB.")
    }else{
        console.log("IndexedDB is supported!")	
    }
    var notes = [];
    var entries=[];
    // indexed DB
    var db;
    var request = window.indexedDB.open("notes", 1);
     
    request.onerror = function(event) {
      console.log("error: ");
    };
     
    request.onsuccess = function(event) {
      db = request.result;
      console.log("success: "+ db);
      read();
    };
    request.onupgradeneeded = function(event) {
        console.log("start upgrade");
        var db = event.target.result;
        var objectStore = db.createObjectStore("notesDB", {keyPath: "id"});
        for (var i in notes) {
                objectStore.add(names[i]);      
        }
        console.log(objectStore);
    }
    function getId(){
        return id;
    }
    function incId(){
        id++;
    }
    function decId(){
        id--;
    }
    function setId(entries){
        if(entries){
            id=entries.length;
        }else{
            id=0;
        }
        return id;
    }
    function add(element) {
        //var myId=element.getAttribute('data-myId');
        var myId=element.parentElement.id;
            var ord=element.parentElement.style.order;
            var obj= { 'id': myId,'txt': element.value,'ord':id};
            //console.log('obj',obj);
            var request = db.transaction(["notesDB"], "readwrite")
                .objectStore("notesDB")
                .add(obj);
        request.onsuccess = function(event) {
            notes[myId]=obj;
                //console.log(obj.id + " added to your database.");
        };
         
        request.onerror = function(event) {
                update(obj);
                //alert("Unable to add "+obj.id);       
        }
    }
    function update(obj) {
        var objectStore = db.transaction(["notesDB"], "readwrite").objectStore("notesDB");
        objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
          if (cursor) {
                // console.log("Name for id " + cursor.key + " is " + cursor.value.txt);
                if(cursor.key === obj.id){
                    var txt=viewMod.hasNote(obj,cursor);
                    // if(obj instanceof HTMLElement){
                    //     if(obj.getAttribute('style').indexOf("order:")!= -1){
                    //         console.log('Note drop',obj.children[1].value);
                    //         txt={'id':obj.id,'txt':obj.children[1].value,'ord':obj.style.order}
                    //     }
                    // }else{
                    //     txt={'id':obj.id,'txt':obj.txt,'ord':cursor.value.ord};
                    // } 
                    //console.log(txt);
                    var request=cursor.update(txt);
                    request.onsuccess = function(event) {
                            notes[txt.id]=txt;
                            console.log(obj.id + " updated to your database.");
                    };
                    request.onerror = function(event) {
                            alert("Unable to update "+obj.id);       
                    }
                }
                cursor.continue();
          }
        }    
    }
    function rem_data(element) {
        var el=element.parentNode;
        var key=(el.getAttribute('id'));
        var request = db.transaction(["notesDB"], "readwrite")
                .objectStore("notesDB")
                .delete(key);
        request.onsuccess = function(event) {
          console.log("Removed from your database.");
        };
    }
    function read() {
        //var entries=[]
        var objectStore = db.transaction("notesDB").objectStore("notesDB");
        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
                //console.log("Text for id " + cursor.key + " is " + cursor.value.txt);
                entries.push({'id':cursor.key,'txt':cursor.value.txt,'ord':cursor.value.ord});
                notes[cursor.key]={'id':cursor.key,'txt':cursor.value.txt,'ord':cursor.value.ord};
                cursor.continue();
          }
          else {
                contMod.reload(entries);
                setId(entries);
                //console.log("No more entries!");
          }
          
        }; 
        //console.log('end read')  
    }
    return {
        getId: getId,
        incId:incId,
        decId: decId,
        add: add,
        update: update,
        rem_data: rem_data,
        read: read

    }
})();
var modMoveNote= (function(){
    function getTarget(node){
        console.log('get Target module');
        var root=node;
        while(root.className !== 'note' && root !== document.body) {
            root = root.parentNode;
        }
        if(root.className == 'note') return root;
        return null;
    };
    function newOrder(els){
        var res;
        for(var i=0; i<els.length;i++){
            var val=els[i];
            for(var j=i-1;j>-1 && els[i]> val;j--){
                res[j+1]=els[j];
            }
        }
    return res;
    };
    function sortByOrd(current,next){
        return +current.ord > +next.ord;
    };
    function getIndexById(note){
        return function(current){
            return current.id === note.id;
        }
    };
    function currentOrder(){
        var el=document.querySelectorAll(".note");
        var res=[];
        for(var i=0; i<el.length;i++){
            res.push({'id':el[i].id,'txt':el[i].querySelector('#txt').value,'ord':el[i].style.order});
        }
        return res; 
    };
    function changeOrder(org,trg,ban){
        var col=currentOrder();
        col.sort(sortByOrd);
        var orgIndex= col.findIndex(getIndexById(org));
        var trgIndex=col.findIndex(getIndexById(trg));
        var counter;
        
        if(orgIndex>trgIndex){
            counter=1;
        }else{
            counter= -1;
        }
        var condition=true;
        var aux=trg.style.order;
        for(var i=trgIndex;condition;){
            col[i].ord=col[i + counter].ord;
            i += counter
            if(orgIndex>trgIndex){
                condition= i<orgIndex;
            }else{
                condition= i>orgIndex;
            }
        }
        col[i].ord=aux;
        //console.log(col);
        //console.log('org:'+orgIndex+'trg: '+trgIndex);
        //console.log(org);
        //console.log(trg);
        dndMod.setNewOrder(col);
        if(ban != -1){
            s('do',{'cmd':'changeOrder','undo':'changeOrder','data':{org,trg}});
        }
    };
    return{
        getTarget: getTarget,
        newOrder: newOrder,
        sortByOrd: sortByOrd,
        getIndexById: getIndexById,
        currentOrder: currentOrder,
        changeOrder: changeOrder
    };
})();

function Stack(){
    var index=0;
    var stack=[];
    function cmd(name){
        // var args= Array.from(arguments).slice(1)[0];
        var arsgs= Array.prototype.slice.call(arguments,1);
        var fnName= '_'+name;
            if(actions[fnName]){
                actions[fnName].apply(actions,arsgs);
            }
            viewMod.checkButtons(index);
    };
    /* do solo guarda*/
    var actions={
        _do: function (item){
            console.log('adding item to stack ', item);
            stack[index]=item;
            index++;
            //console.log(stack.length);
            if(index < stack.length){
                console.log('hace slice');
                stack=stack.slice(0,index+1);
            }
            console.log(stack);
        },
        //undo ejecuta undo
        _undo: function(item){
            console.log('undo action');
            if(index>0){
                index--;
                var fnName='_'+stack[index]['undo'];
                this[fnName](stack[index]['data']);
            }
            
            //console.log('after: index: ', index, '\tstack.length: ', stack.length);
            //debugger
        },
        //ejecuta cmd
        _redo: function(item){
            console.log('redo action');
            if(index>0){
                index++;
                var fnName='_'+stack[index]['cmd'];
                this[fnName](stack[index]['data']);
            }
            //console.log(stack);
        },
        //just for check stack info
        _getStack: function(){
            for(var i=0;i<stack.length;i++){
                console.log(stack[i]);
            }
        },
        _getStackIndex: function(){
            for(var i=0;i<index;i++){
                console.log(stack[i]);
            }
            return index;
        },
        //functions for redo and undo
        _create: function(data){
            //console.log(data);
            viewMod.create(data);
        },
        _delete: function(data){
            console.log(data);
            var note=viewMod.getNoteElement(data);
            viewMod.rem_note(note);
        },
        _changeOrder: function(data){
            modMoveNote.changeOrder(data.org,data.trg,-1);
        }
    }
    return cmd;
}

var s= new Stack();