function dragstart(note, event) {
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

function drop(target, event) {
  var note = event.dataTransfer.getData('Data');
  console.dir(target);
  target.appendChild(document.getElementById(note));
}
