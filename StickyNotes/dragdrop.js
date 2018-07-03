function dragstart(note, event) {
  //console.log('dragstart',note);
  event.dataTransfer.setData('Data', note.id);
}

function drag(note, event) {
  return false;
}

function dragend(note, event) {
  return false;
}

function dragenter(target, event) {
  return false;
}

function dragleave(target, event) {
  return false;
}

function dragover(event) {
  event.preventDefault();
  return false;
}
function drop(event) {
  var note_id = event.dataTransfer.getData('Data');
  var note_tg=getTarget(event.target);
  console.log(event);
  var n1=document.getElementById(note_id);
  var oldIndex= n1.style.order;
  console.log('note',n1);
  var n2=document.getElementById(note_tg.id);
  var newIndex=n2.style.order;
  
  n1.style.order=newIndex;
  n2.style.order=oldIndex;
  update(n1);
  update(n2);
  //target.appendChild(document.getElementById(note));
}
function getTarget(node){
  var root = node;
  while(root.className !== 'note' && root !== document.body) {
    root = root.parentNode;
  }
  if(root.className == 'note') return root;
  return null;
}