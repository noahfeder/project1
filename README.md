# SCUMM - The Game

### Based on the LucasArts classic The Secret of Monkey Island, a combination text and visual adventure game.

### User Experiences:

* See available commands and inventory

* Type commands for Guybrush, our protagonist

* Control Guybrush on the screen either through arrow keys

* `added point and click`

* Win when you ~~arrive at the trophy~~ defeat the boss

* Die at two or three particular challenge points



### MVP:

A game that requires the player to textually interact with an on-screen character, moving from screen to screen in order to reach the final boss

### Code Requirements:

1. Animations for main character:
  * Talk
  * Walk left
  * Walk right
  * Stand still

2. Actions/verbs:

     ```
     Verbs can take 0, 1, or 2 arguments
     ```

  * Left/right/stop
  * Open
  * Use X on Y
  * Grab
  * Look
  * Say
  * Inventory
  * Push

3. Objects

  1. First screen
    * Gates
    * Chests
    * Turtle
    * Chicken
  2. Second Screen
    * Statues
    * Knife
  3. Third screen
    * Final Boss
  4. Starting inventory
    * Sword
    * Bomb
  5. Object constructor that takes object of parameters

      ```
      Object properties:
        * name
        * className
        * top
        * left
        * storable
        * openable
        * usable
        * container
        * items
        * place() method
        ```

4. Input actions
  * take in and parse text
  * point and click
  * prepare response
  * print response
  * [arrow keys to walk]

5. "Plot"
  * Find key in chest, interact with Turtle
  * Push buttons in right order, pick up Knife
  * Fight boss!

![Planning Stage 1](http://i.imgur.com/pUlvsIK.jpg)
![Planning Stage 2](http://i.imgur.com/FIO9Zt7.jpg)
