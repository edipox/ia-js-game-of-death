var GA = (function(){
  function getNonPercent(val, populationSize){
    return val*populationSize/100;
  }

  var Population = {
    new: function(size, randomCitizen){
      var citizens = [];
      for(var i = 0; i < size; i++)
        citizens.push( randomCitizen() );
      return citizens;
    },
    build: function(elements, ga){
      var citizens = [];
      _.each(elements, function(e){
        citizens.push( new Citizen(ga.options.builder(e), ga) );
      })
      return citizens;
    }
  }

  var Citizen = function(element, ga){
    var self = this;
    _.extend(self, element);
    self.fitness = function(){
      var fitness = 0;
      _.each(ga.options.chromosomesToEvolve, function(calculator, chromosome){
        fitness += calculator(self, chromosome, self[chromosome]);
      });
      return fitness;
    }
    self.makeChild = function(c2, mutAmmount, childNumber){
      var evolvedChromosomes = {};
      var time = true;
      var chromosomes = ga.options.chromosomesToEvolve;
      _.each(chromosomes, function(calculator, chromosome){
        evolvedChromosomes[chromosome] = time ? self[chromosome] : c2[chromosome];
        time = !time;
      });
      if(childNumber <= mutAmmount){
        var mutableChromosome = _.sample(_.keys(chromosomes));
        evolvedChromosomes[mutableChromosome] = ga.options.randomBuilder()[mutableChromosome];
      }
      return new Citizen(ga.options.builder(evolvedChromosomes), ga)
    }
  }  

/* @params:
*   options: 
*     elitismPercent: percent of population, composed by the best citizens, 
*       which citizens will be the fathers and mothers of the next citizens
*     mutationPercent: percent of mutation applyed to evolve.
*     populationSize: the size of the population.
*     generateFirstGen: true if the first population will be generated
*       false if it will be given.
*     firstPopulation: the first population (list of citizens), in case that it wont be 
*       generated by the GA algorithm.
*     chromosomesToEvolve: the list of chromosomes which will be evolved and its comparators. eg:
          { 
            x: function(citizen, chromosome, value){ 
              // own logic
            },
            z: function(citizen, chromosome, value){ 
              // own logic
            }
           },
*     builder: function that returns a new citizen given an object with evolved chromosomes.    
*     randomBuilder: function that return a new citizen to generate the first popultation
*       in case that the first population was'nt given.
*/
  var GA = function (options) {
    var self = this;

    self.options = options;
    var populationSize = self.options.populationSize;
    self.elitism = getNonPercent(self.options.elitismPercent, populationSize);
    self.mutation = getNonPercent(self.options.mutationPercent, populationSize);

    function randomCitizen(){
      return new Citizen(self.options.builder(self.options.randomBuilder()), self);
    }

    self.population = _.isUndefined(self.options.firstPopulation) ?
       Population.new(populationSize, randomCitizen) : 
        Population.build(self.options.firstPopulation, self);

    self.getNextPopulation = function(child1Callback, child2Callback, onFinish){

      var createChildren = function(basePopulation, newPopulation, params, index1, index2, mutation){
        var citizen1 = basePopulation[index1];
        var citizen2 = basePopulation[index2];
        var c1Child = citizen1.makeChild(citizen2, self.mutation, index1);
        var c2Child = citizen2.makeChild(citizen1, self.mutation, index2);
        newPopulation.push(c1Child);
        newPopulation.push(c2Child);
        params.push({c1: citizen1, c2: citizen2, child: c1Child})
        params.push({c1: citizen1, c2: citizen2, child: c2Child})
      }

      console.log(self.population.length)
      var basePopulation = _.sortBy(self.population, function(c){ return c.fitness() }).slice(0, self.elitism);
      console.log(basePopulation.length)
      var newPopulation = [];
      var params = [];
      for(var i = 1; i < basePopulation.length; i++)
        createChildren(basePopulation, newPopulation, params, i-1, i, self.mutation);

      console.log(newPopulation.length)

      for(var i = 0; i < (basePopulation.length/2); i++)
        for(var j = parseInt(basePopulation.length/2); j >= 0; j--)
          createChildren(basePopulation, newPopulation, params, i, j, self.mutation);

      if(_.isFunction(onFinish))onFinish(params);
      console.log(newPopulation.length)
      return newPopulation;
    }

    self.evolve = function(child1Callback, child2Callback, onFinish){
      self.population = self.getNextPopulation(child1Callback, child2Callback, onFinish);
    }

  }

  return GA;
})();
