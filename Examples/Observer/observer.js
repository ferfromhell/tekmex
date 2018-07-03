function Model(){
    var self = this;
    this.heading = "Hello";
    //collection of observers 
      this.observers = []; 
    //add to the collection of observers
    this.registerObserver = function(observer){
      self.observers.push(observer);
    }
    //Iterate over observers, calling their update method
    this.notifyAll = function(){
      self.observers.forEach(function(observer){
        observer.update(self);
      })
    }
  }
  function View(controller){
    this.controller = controller; 
    this.heading = document.getElementById('heading');
    this.heading.addEventListener('click', controller);
    this.heading.innerText = controller.getModelHeading();
    this.update = function(data){
         this.heading.innerText = data.heading;
    }
    this.controller.model.registerObserver(this);
}
function Controller(model){
    var self = this;
    this.model = model;
  //EVENTLISTENER INTERFACE
    this.handleEvent = function(e){
      e.stopPropagation();
      switch(e.type){
        case "click":
          self.clickHandler(e.target);
          break;
        default:
          console.log(e.target);
      }
    }
  //GET MODEL HEADING
    this.getModelHeading = function(){
      return self.model.heading;
    }
  //CHANGE THE MODEL
    this.clickHandler = function(target){
      self.model.heading = 'World';
     //now we just notify our observers
      self.model.notifyAll();
    }
}
(function main(){
    var model = new Model();
    var controller = new Controller(model);
    console.log(controller);
    var view = new View(controller);
  })();
