# Recipe-Creator
A VS Code extension that allows you to quickly create custom recipes for your Minecraft Datapack.`

Tested with Minecraft 1.19.

## How to use
Open the Command Palette (Ctrl+Shift+P), search for `Create New Recipe`.
Input the name of the file (e.g. "ice_boots"). 
Recipe-Creator will look for all namespaces and prompt you which
namespace to target (or the first one if there is only one).
Then, Recipe Creator will create the appropriate files for you to modify.

## What makes these recipes 'custom?'
With Minecraft's datapacks, you can create recipes for any items - however, these recipes dont support NBT or any other features other than giving the player items. With Recipe-Creator, you can quickly generate files to create recipes that grant the player with NBT-rich items, create particle effects, anything! 

## How does it work?
Each recipe generated will make a `recipe`, `advancement` and `mcfunction` file. 
For example, lets assume this item recipe is for **Ice Boots**.
The respective files made are:
- `recipes/ice_boots.json`
- `advancements/ice_boots.json`
- `functions/ice_boots.mcfunction`

The `advancement` generated fires when the `recipe` is unlocked/made by the player. When the `advancement` fires, it calls the `mcfunction` on the respective player who crafted that specific recipe and removes the temporary item granted to the player (as of now, a Knowledge Book). 

The `mcfunction` file can be modified and run whatever logic you wish! For example, give them an item with NBT, or give them potion effects, experience, etc.

The `recipe` file can be modified to create whatever recipe you want.