# Game of Death

It is a simple javascript application meant for showing graphically how a genetic algorithm works. The idea is that you could learn playing with the [options](#Options). 

![overview](/assets/img/overview.png)

## Name origin
The name comes as joke becouse of the well known [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life).
The idea of the game is that in each new generation the citizens should be further from the colored blocks.

## Rules:
- Red blocks or blocks with red border are a **citizens**.
- Colored non red blocks are **polution** the citizens should avoid it!
- Each new citizen will be born mixin the chromosome X and the chromosome Y of its parents. X and Y means the coordinates in the *world*.
![example](/assets/img/example.png)
- If the things go well, every new child should be born in a position where the sum of all the colored blocks in X and Y is less than tha same sum for its parents.

## Options
- Mutation: The percent of mutants citizens in each generation.
- Elitism: The percent of citizens (from the best) which will continue to be in the next generation.
- Population size: number of citizens.
- Animation step time: Time in ms for each step.
- World width: Number of blocks within a row in the *world*.
- World height: Number of rows in a *world*.
- Polution level: Number related to the size of each *dot* of polution




