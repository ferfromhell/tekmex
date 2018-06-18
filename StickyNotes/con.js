var id=0;
//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
//prefixes of window.IDB objects
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

function add(element) {
    var myId=element.getAttribute('data-myId');
        var obj= { 'id': myId,'txt': element.value,'ord':myId};
        var request = db.transaction(["notesDB"], "readwrite")
            .objectStore("notesDB")
            .add(obj);
    request.onsuccess = function(event) {
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
            //console.log("Name for id " + cursor.key + " is " + cursor.value.txt);
            if(cursor.key === obj.id){
                var txt={'id':obj.id,'txt':obj.txt};
                var request=cursor.update(txt);
                request.onsuccess = function(event) {
                        console.log(obj.id + " updated to your database.");
                };
                 
                request.onerror = function(event) {
                        //update(element);
                        alert("Unable to update "+obj.id);       
                }
            }
            cursor.continue();
      }
    };     
}
function rem_data(element) {
    var el=element.nextElementSibling;
    var key=(el.getAttribute('data-myId'));
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
            entries.push({'id':cursor.key,'txt':cursor.value.txt});
            cursor.continue();
      }
      else {
              reload(entries);
            //console.log("No more entries!");
      }
      
    }; 
    //console.log('end read')  
}

function reload(entries){
    for(var i in entries){
        //console.log(entries[i]);
        // create2(entries[i]);
        create(entries[i]);

    }
}


