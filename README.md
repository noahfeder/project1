# SCUMM - The Game

### Based on the LucasArts classic The Secret of Monkey Island, a combination text and visual adventure game.

### User Experiences:

* See available commands and inventory DONE

* Type commands for Guybrush, our protagonist DONE

* Control Guybrush on the screen either through arrow keys  DONE `scrapped typed commands`

* Win when you arrive at the trophy DONE `changed to boss`

* Die at two or three particular challenge points DONE



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
     Verbs can take 0, 1, or 2 arguments DONE
     ```

  * Left/right/stop DONE
  * Open DONE
  * Use X on Y DONE
  * Grab DONE
  * Look DONE
  * Say DONE
  * Inventory DONE
  * Push DONE

3. Objects

  1. First screen
    * Gates DONE
    * Chests DONE
    * Turtle DONE
    * Chicken DONE
  2. Second Screen
    * Statues DONE
    * Knife DONE
  3. Third screen
    * Final Boss DONE
  4. Starting inventory
    * Sword DONE
    * Bomb DONE

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
  * take in and parse text DONE
  * prepare response DONE
  * print response DONE
  * [arrow keys to walk] DONE

5. "Plot"
  * Find key in chest, interact with Turtle DONE
  * Push buttons in right order, pick up Knife DONE
  * Fight boss! DONE

6. STRETCH GOALS / TODO
  * Welcome screen/instructions
  * Loading screen
  * Victory screen!!
  * Fix message box!!
  * change rat to something??? uzi??? shield?
  * name Hera Athena Aphrodite
  * more descriptive names in general
  * change .place() method to take position
    * change Item constructor to obj
  * sounds????
  * Additional screen???
