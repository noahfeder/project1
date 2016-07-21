# SCUMM - The Game

### Based on the LucasArts classic The Secret of Monkey Island, a combination text and visual adventure game.

### User Experiences:

* See available commands and inventory

* Type commands for Guybrush, our protagonist

* Control Guybrush on the screen either through arrow keys or typed commands

* Win when you arrive at the trophy

* Die at two or three particular challenge points



### MVP:

A game that requires the player to textually interact with an on-screen character, moving from screen to screen in order to reach the final boss

### Code Requirements:

1. Animations for main character:
  * Talk DONE
  * Walk left DONE
  * Walk right DONE
  * Stand still DONE

2. Actions/verbs:

     ```
     Verbs can take 0, 1, or 2 arguments
     ```

  * Left/right/stop DONE
  * Open/close
  * Use X on Y
  * Pick up
  * Look
  * Say DONE
  * Inventory
  * Push

3. Objects

  1. First screen
    * Gates
    * Chests DONE
    * Turtle DONE
    * Chicken
  2. Second Screen
    * Podiums
    * Knife
  3. Third screen
    * Final Boss
  4. Starting inventory
    * Sword
    * Bomb

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
  * prepare response
  * print response
  * [arrow keys to walk]

5. "Plot"
  * Find key in chest, interact with Turtle
  * Push buttons in right order, pick up Knife
  * Fight boss!
