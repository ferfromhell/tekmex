function Stack(){
    this.index=0;
     this.stack=[];
}
Stack.prototype={
    cmd: function(name){
        // var args= Array.from(arguments).slice(1)[0];
        var arsgs= Array.prototype.slice.call(arguments,1);
        var fnName= '_'+name;
        if(this[fnName]){
            this[fnName].apply(this,arsgs);
        }
    },
    /* do solo guarda*/
    _do: function (item){
        console.log('adding item to stack');
        this.stack[this.index]=item;
        this.index++;
        //console.log(this.stack.length);
        if(this.index < this.stack.length){
            console.log('hace slice');
            this.stack=this.stack.slice(0,this.index);
        }
        console.log(this.stack);
    },
    //undo ejecuta undo
    _undo: function(item){
        console.log('undo action');
        this.index--;
        console.log(this.stack);
    },
    //ejecuta cmd
    _redo: function(item){
        console.log('redo action');
        this.index++;
        console.log(this.stack);
    },
    _delete: function(){
        //sticky notes delete
    }
}

var m= new Stack;

//test
m.cmd('do',{'cmd':'create','undo':'delete','data':{id:1,txt:'',ord:1}});// new
m.cmd('do',{'cmd':'create','undo':'delete','data':{id:1,txt:'',ord:2}});//new
m.cmd('do',{'cmd':'create','undo':'delete','data':{id:1,txt:'',ord:3}});//new
m.cmd('do',{'cmd':'create','undo':'delete','data':{id:1,txt:'',ord:4}});//new index 5
m.cmd('undo',{'cmd':'delete','undo':'create','data':{id:1,txt:'',ord:3}});//ctrl z
m.cmd('undo',{'cmd':'delete','undo':'create','data':{id:1,txt:'',ord:4}});//ctrl z index 3
m.cmd('do',{'cmd':'create','undo':'delete','data':{id:1,txt:'',ord:5}});

