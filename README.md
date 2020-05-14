# Thompson Tetrahedron Web App

This app builds and displays an interactive [Thompson Tetrahedron](https://www.tf.uni-kiel.de/matwis/amat/def_en/kap_5/backbone/r5_4_2.pdf) you can use for studying / as a reference for [slip systems](https://en.wikipedia.org/wiki/Slip_(materials_science)#Slip_systems) on which [dislocations](https://en.wikipedia.org/wiki/Dislocation) can easily glide during [plastic deformation](https://en.wikipedia.org/wiki/Plasticity_(physics)) in [face centered cubic (FCC) crystals](https://en.wikipedia.org/wiki/Cubic_crystal_system).

Interactivity includes:
* Displaying specific slip system info on click
* Coordinate axis rotation 
* Hiding and displaying specific features 
* Displaying a [twinning](https://en.wikipedia.org/wiki/Crystal_twinning) (mirrored) Thompson Tetrahedron, assuming (d) = (111) as the twinning plane
* Choice of perspective or orthographic view

Slip systems, dislocations splitting and reactions between several dislocations can be handily described using the Thompson notation detailed in ref. [1], which transforms large, sometimes unwieldy [Miller index](https://en.wikipedia.org/wiki/Miller_index) notation for dislocations into something akin to a linear algebra.
In the web app, both notations are provided, giving a handy reference to convert from one to the other, and get an orientable view of e.g. the slip systems involved in a dislocation reaction you might be interested in.

Built using HTML/CSS and javascript, and licensed under GPL-v3.0-or-later [2].  
For effectively everything, the three.js library was used [3], which is licensed under the MIT License [4].


### Hosting the app

Hosting the app simply requires you to clone / download all the files provided in the git onto your webserver and link to the **.html** file from somewhere else.


### Note about testing the app on your machine

As a security measure, all assets on a page need to have the same source for your browser to open it.  
This means that if you just download everything here and open the **.html** page locally with your browser, it won't work.
If you want to play around with the app locally and without an internet connection, you can use local server tools like e.g. [http-server](https://www.npmjs.com/package/http-server) or [browser-sync](https://www.browsersync.io/#install). (Both of these examples require a local installation of [node.js](https://nodejs.org)) 


### References

[1] Hirth, John Price, Jens Lothe, and T. Mura. "Theory of dislocations." (1983): 476-477.  
[2] [GPL-v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)  
[3] [three.js library](https://github.com/mrdoob/three.js)  
[4] [MIT License](https://en.wikipedia.org/wiki/MIT_License)  
