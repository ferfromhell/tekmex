var contMod = (function(){
    function reload(entries){
        for(var i in entries){
            //console.log(entries[i]);
            // create2(entries[i]);
            viewMod.create(entries[i]);
    
        }
    };
    return {
        reload: reload
    }
})();

