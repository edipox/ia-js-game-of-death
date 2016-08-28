# Game of Death

A simple javascript application meant for showing graphically how a genetic algorithm works. The idea is that you could learn playing with the [options](#options). 

![overview](/assets/img/overview.png)

## Name origin
The name comes as joke because of the well known [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life).
The idea of the game is that in each new generation the citizens should be further from the colored blocks (non-red).

## Rules:
- Red blocks or blocks with red border are **citizens**.
- Non-red colored blocks are **polution**. The citizens should avoid them!
- Each new citizen will be born mixing the chromosome X and the chromosome Y of its parents. X and Y are actually the coordinates in the *world*.
![example](/assets/img/example.png)
- If the things go well, every new child should be born in a position where the sum of all the colored blocks in X and Y is less than tha same sum for its parents.

## Options
- Mutation: The percentage of mutants citizens in each generation.
- Elitism: The percentage of citizens (from the best) which will continue to be in the next generation.
- Population size: number of citizens.
- Animation step time: Time in ms for each step.
- World width: Number of blocks within a row in the *world*.
- World height: Number of rows in a *world*.
- Polution level: Number related to the size of each *dot* of polution.


This was made as a task in the subject of Artificial Intelligence of the Informatic Engineering career at Universidad Nacional de Itapua.
