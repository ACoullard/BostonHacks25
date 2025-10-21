# Zork Evolved
*Andre Coullard, Shayaan Hussain, Yixuan Huang, Chahat Nandrajog*

*Created for Boston Hacks 2025*

## Premise
Inspired by 1977 text based adventure game, *Zork*, Zork Evolved provides a multimedia exploration and adventure experience through the power of modern generative AI.

## Overview
Zork Evolved presents a classic text based interface to an explorable fantasy world, with a multi-media twist. Users can enter in their instructions via the central chat window and view a detailed description of the results. Behind the chat window, an ASCII art rendering of the current locatation is displayed.

## Technology
To provide the variety and interactivity of LLM's without sacrificing internal consistency, a hybrid approach is used. A concrete "world state" is stored, which users then modify and interact with through LLMs.

**Text-gen**  
Text generation models provide the internal "map-generation" and the generate user facing narration of changes to the world.

**Embedding**  
Gemini's embedding API is used to match user instructions written in natural language to the list of internal user "actions" available.

**Image-gen**  
Image generation is used to create dynamic visualzation of user's current location in the world. Custom code converts these images into ASCII art and renders it in the background of the window.
