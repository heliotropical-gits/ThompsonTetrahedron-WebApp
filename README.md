# Thompson Tetrahedron Web App

This app builds and displays an interactive Thompson Tetrahedron you can use for studying / as a reference for [slip systems](https://en.wikipedia.org/wiki/Slip_(materials_science)#Slip_systems) on which [dislocations](https://en.wikipedia.org/wiki/Dislocation) can easily glide during [plastic deformation](https://en.wikipedia.org/wiki/Plasticity_(physics)) in [face centered cubic (FCC) crystals](https://en.wikipedia.org/wiki/Cubic_crystal_system).

Interactivity includes displaying specific slip system info on click,
coordinate axis rotation, hiding and displaying specific features, and
displaying a twinning (mirror) Thompson Tetrahedron following a (111) twinning plane.

Slip systems, dislocations splitting and reactions between several dislocations can be handily described using the Thompson Notation [1], which transforms large, sometimes unwieldy Miller index notation for dislocations into something akin to linear algebra.
In the web app, both notations are provided, giving a handy reference to convert from one to the other, and get an orientable view of e.g. the slip systems involved in a dislocation reaction you might be interested in.

Built using HTML/CSS and javascript. 
In particular the three.js library was used, licensed under the MIT License: https://github.com/mrdoob/three.js

[1] Hirth, John Price, Jens Lothe, and T. Mura. "Theory of dislocations." (1983): 476-477.
