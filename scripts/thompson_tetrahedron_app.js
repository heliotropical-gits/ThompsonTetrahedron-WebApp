/*
Thompson Tetrahedron Web App
Author: Frederic Houlle
email: richowl-gitty@pm.me
git:
Date: 10.05.2020

Licensed under GNU-GPL-3.0-or-later
Copyright 2020 Frederic Houlle

License notice
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from './three/examples/jsm/renderers/CSS2DRenderer.js';

var container, controls;
var camera, scene, renderer, labelRenderer;
var layers;
var string_buffer;

var coordinates_checked, text_checked;
var inner_lines_checked, faces_checked, lines_checked, inner_lines_checked;
var twinning_checked, twinning_lines_checked, twinning_inner_lines_checked;

var labels = [];

var coordinates_axis = [];

var checkbox_hashtable;

var o, x, y, z;
var coordinates_rotation_matrix;
var lx_mesh, ly_mesh, lz_mesh;

var d_material, d_mesh;
var d_vertices, d_vertices_typed, d_corner_vertices;
var faces = [];

var t_material, t_mesh;
var t_vertices, t_vertices_typed, t_corner_vertices;
var t_faces = [];

var d_edge_line, d_face_line;
var lines = [];
var t_lines = [];

var line_materials = [];

var rollOverMaterial, rollOverMesh;

var raycaster, mouse;
var dynamic_text_planes = [];

init();
render();

function init() {
  // create the viewport div
  container = document.createElement( 'div' );
  container.id = "viewport";
  document.body.appendChild( container );

  checkbox_hashtable = [
    {html_id: "show-coordinates-axis", checkbox: coordinates_checked, layers: [28]},
    {html_id: "show-text", checkbox: text_checked, layers: [13, 14]},
    {html_id: "show-faces", checkbox: faces_checked, layers: [15]},
    {html_id: "show-lines", checkbox: lines_checked, layers: [1, 5]},
    {html_id: "show-inner-lines", checkbox: inner_lines_checked, layers: [6]},
    {html_id: "show-twinning-tetrahedron", checkbox: twinning_checked, layers: [8]},
    {html_id: "show-twinning-tetrahedron-lines", checkbox: twinning_lines_checked, layers: [2, 9]},
    {html_id: "show-twinning-tetrahedron-inner-lines", checkbox: twinning_inner_lines_checked, layers: [10]},
  ]

  // create scene, set its background to white
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  // add a soft white light to the scene
  var light1 = new THREE.AmbientLight( 0xffffff );
  light1.layers.set(32);
  scene.add( light1 );

  //// Create direct tetrahedron -> We define it from scratch from individual faces so we can more easily
  // set its colors and play around with interactivity.
  // Yes, I know there's a TetrahedronBufferGeometry object in three.js

  // Define corner vertices, and center face vertices
  var A = {id: 'A', pos: [1.0, 0.0, 1.0]};
  var B = {id: 'B', pos: [0.0, 1.0, 1.0]};
  var C = {id: 'C', pos: [1.0, 1.0, 0.0]};
  var D = {id: 'D', pos: [0.0, 0.0, 0.0]};
  var Dp = {id: 'D\'', pos: [1.334, 1.334, 1.334]}; // D prime, the (evil) twin mirror of D.
  var a = {id: 'α', pos: [0.332, 0.667, 0.332]};
  var b = {id: 'β', pos: [0.667, 0.332, 0.332]};
  var c = {id: 'γ', pos: [0.332, 0.332, 0.667]};
  var d = {id: '𝛿', pos: [0.667, 0.667, 0.667]};
  var ap = {id: 'α\'', pos: [0.8, 1.123, 0.8]};
  var bp = {id: 'β\'', pos: [1.123, 0.8, 0.8]};
  var cp = {id: 'γ\'', pos: [0.8, 0.8, 1.123]};
  var d_corner_vertices = [A, B, C, D];
  var t_corner_vertices = [A, B, C, Dp];
  var d_colors = [0xffffff, 0xff0000, 0x00ff00, 0x1111ff]; // tetrahedron face colors
  var t_colors = [0xffffff, 0xff4444, 0x44ff44, 0x5555ff]; // twinning tetrahedron face colors (same but paler)

  // create each side
  for (var i = 0; i < 4; i++) {
    // create each face mesh
    var d_tet_geometry = new THREE.BufferGeometry();
    //var d_vertices = d_corner_vertices.slice(i*9, (i + 1)*9 ) // Picks 9 elements at a time, i.e. 3 points in 3D space
    // use a rolling index for the corner vertices, i.e. after picking [1,2,3], pick [2,3,0]
    d_vertices = [d_corner_vertices[i % 4].pos, d_corner_vertices[(i + 1) % 4].pos, d_corner_vertices[(i + 2) % 4].pos];
    d_vertices_typed = new Float32Array([
      d_vertices[0][0], d_vertices[0][1], d_vertices[0][2],
      d_vertices[1][0], d_vertices[1][1], d_vertices[1][2],
      d_vertices[2][0], d_vertices[2][1], d_vertices[2][2],
    ]);
    d_tet_geometry.setAttribute( 'position', new THREE.BufferAttribute( d_vertices_typed, 3 ) );
    d_material = new THREE.MeshLambertMaterial( { color: d_colors[i] } );
    d_material.transparent = true;
    d_material.opacity = 0.7;
    d_material.side = THREE.DoubleSide;
    d_mesh = new THREE.Mesh( d_tet_geometry, d_material );
    d_mesh.layers.disableAll();
    d_mesh.layers.set( 15 ); // layers definition for faces: 15
    faces.push( d_mesh );
    scene.add( d_mesh );
  };

  //// create lines for the vectors
  // edges: AB, BC, CD, DA, BD, DC
  var d_corner_vertex_pairs = [[A, B], [B, C], [C, D], [D, A], [B, D], [C, A]];
  makeLinesFromPairs(d_corner_vertex_pairs, "full");

  // create partial vectors, on the faces.
  var d_corner_to_center_vertex_pairs = [
    [A, d], [B, d], [C, d], // (d) plane
    [B, a], [C, a], [D, a], // (a) plane
    [A, b], [C, b], [D, b], // (b) plane
    [B, c], [D, c], [A, c], // (c) plane
  ]
  makeLinesFromPairs(d_corner_to_center_vertex_pairs, "partial");

  // create inner vectors
  var d_center_to_center_vertex_pairs = [[a, b], [b, c], [c, d], [d, a], [d, b], [c, a]];
  makeLinesFromPairs(d_center_to_center_vertex_pairs, "inner");

  //// Create the twinning tetrahedron

  // faces
  for (var i = 0; i < 4; i++) {
    // create each face mesh
    var t_tet_geometry = new THREE.BufferGeometry();
    //var d_vertices = d_corner_vertices.slice(i*9, (i + 1)*9 ) // Picks 9 elements at a time, i.e. 3 points in 3D space
    // use a rolling index for the corner vertices, i.e. after picking [1,2,3], pick [2,3,0]
    t_vertices = [t_corner_vertices[i % 4].pos, t_corner_vertices[(i + 1) % 4].pos, t_corner_vertices[(i + 2) % 4].pos];
    t_vertices_typed = new Float32Array([
      t_vertices[0][0], t_vertices[0][1], t_vertices[0][2],
      t_vertices[1][0], t_vertices[1][1], t_vertices[1][2],
      t_vertices[2][0], t_vertices[2][1], t_vertices[2][2],
    ]);
    t_tet_geometry.setAttribute( 'position', new THREE.BufferAttribute( t_vertices_typed, 3 ) );
    t_material = new THREE.MeshLambertMaterial( { color: t_colors[i] } );
    t_material.transparent = true;
    t_material.opacity = 0.7;
    t_material.side = THREE.DoubleSide;
    t_mesh = new THREE.Mesh( t_tet_geometry, t_material );
    t_mesh.layers.disableAll();
    t_mesh.layers.set( 8 ); // layers definition for twinning tetrahedron faces: 8
    t_faces.push( t_mesh );
    scene.add( t_mesh );
  };

  // edge vectors
  var t_corner_vertex_pairs = [[C, Dp], [Dp, A], [B, Dp]];
  makeLinesFromPairs(t_corner_vertex_pairs, "full", true);
  // partial vectors
  var t_corner_to_center_vertex_pairs = [
    [A, d], [B, d], [C, d],
    [B, ap], [C, ap], [Dp, ap],
    [A, bp], [C, bp], [Dp, bp],
    [B, cp], [Dp, cp], [A, cp],
  ];
  makeLinesFromPairs(t_corner_to_center_vertex_pairs, "partial", true);
  // inner vectors
  var t_center_to_center_vertex_pairs = [[ap, bp], [bp, cp], [cp, d], [d, ap], [d, bp], [cp, ap]];
  makeLinesFromPairs(t_center_to_center_vertex_pairs, "inner", true);

  // Line roll-over helper sphere
  var rollOverGeo = new THREE.SphereBufferGeometry( 0.01, 10, 10 );
	rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 1.0, transparent: false} );
	rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
  rollOverMesh.layers.set(31); // rollOverMesh on the same layer as our
	scene.add( rollOverMesh );

  // labels
  var verts = [A, B, C, D, a, b, c, d]
  for (var i=0; i < verts.length; i++) {
    verts[i].labelDiv = document.createElement( 'div' );
    verts[i].labelDiv.className = 'label';
    verts[i].labelDiv.textContent = verts.id;
    verts[i].labelDiv.style.marginTop = '-1em';
    verts[i].labelObject = new CSS2DObject( verts[i].labelDiv );
    verts[i].labelObject.position.set( verts[i].pos );
    labels.push( verts[i].labelObject );
  }

  // create a perspective camera (FOV=45deg), set its position arbitrarily
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
  camera.rotation.set(Math.PI / 2, Math.PI / 2, Math.PI / 2);
  camera.position.set( 2.5, 2.5, 2.5 );
  camera.layers.enableAll();

  // Raycaster and mouse definitions
  raycaster = new THREE.Raycaster();
  raycaster.layers.enableAll();
  raycaster.layers.disable(0);
  // Raycaster parameters
  raycaster.params.Line.threshold = 0.03
  mouse = new THREE.Vector2();

  // Renderer setup
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild( renderer.domElement );

  // labelRenderer Setup
  labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize( window.innerWidth, window.innerHeight );
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
	document.body.appendChild( labelRenderer.domElement );

  // Camera controls and initial orientation setup
  controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  controls.minDistance = 2.5;
  controls.maxDistance = 5;
  controls.target.set( 0.5, 0.5, 0.5 );
  controls.screenSpacePanning = true;
  controls.update();

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  document.getElementById( "apply-button" ).addEventListener( 'click', rotateCoordinateAxis, false );
  document.getElementById( "settings-toggle" ).addEventListener( 'click', toggleSettings, false );
  window.addEventListener( 'resize', onWindowResize, false );

  createCoordinateAxis();
  checkboxManager();

}

////////////////////// SUPPORTING FUNCTIONS AND PROCEDURES

// Check which settings are set.
function checkboxManager( event ) {
  for (var i = 0; i < checkbox_hashtable.length; i++) {
    checkbox_hashtable[ i ].checkbox = document.getElementById(checkbox_hashtable[ i ].html_id).checked;
    for (var j = 0; j < checkbox_hashtable[ i ].layers.length; j++){
      if (checkbox_hashtable[ i ].checkbox) {
        addLayerToViewAndRaycaster(checkbox_hashtable[ i ].layers[ j ]);
      } else {
        removeLayerFromViewAndRaycaster(checkbox_hashtable[ i ].layers[ j ]);
      }
    }
  }
  render();
}

function addLayerToViewAndRaycaster( layer ){
  camera.layers.enable(layer);
  raycaster.layers.enable(layer);
}

function removeLayerFromViewAndRaycaster( layer ){
  camera.layers.disable(layer);
  raycaster.layers.disable(layer);
}

// resize the camera aspect ratio accordingly if window resized
function onWindowResize( event ) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  render();
}

// Check for mouse movement and intersection with object.
// Interact with first object from camera.
function onDocumentMouseMove( event ) {
  mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1.000, - ( event.clientY / window.innerHeight ) * 2 + 1.00 );
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( lines, true );
  var t_intersects = raycaster.intersectObjects( t_lines, true );

  if ( intersects.length > 0 || t_intersects.length > 0 ){
    if ( intersects.length > 0 ) {
      var intersect = intersects[0];
    } else {
      var intersect = t_intersects[0];
    }
    rollOverMesh.visible = true;
    rollOverMesh.position.copy( intersect.point );
  } else {
    rollOverMesh.visible = false;
  }
  render();
}

// Check for mouse movement and intersection with object.
// Interact with first object from camera that's intersected with mouse.
function onDocumentMouseDown( event ){
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( lines, true );
  var t_intersects = raycaster.intersectObjects( t_lines, true);
  if ( intersects.length > 0 || t_intersects.length > 0 ){
    if ( intersects.length > 0 ) {
      var intersect = intersects[0];
    } else {
      var intersect = t_intersects[0]
    }
    console.log(intersect);
    console.log(intersect.object.thompsonNotation);
    console.log(intersect.object.burgersVector);
  }
  render();
}

function makeLinesFromPairs(pointsPairs, materialToUse, twinningCase = false){
  var b_length, prefactor, material;
  if (materialToUse === "full") {
    b_length = 1.414213562373095;
    material = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2
    });
    prefactor = "a/2";
  } else if (materialToUse === "partial") {
    b_length = 2.449489742783178;
    material = new THREE.LineDashedMaterial({
      color: 0x000000,
      linewidth: 2,
  	  dashSize: 3,
  	  gapSize: 1
    });
    prefactor = "a/6";
  }
    else if (materialToUse === "inner") {
      b_length = 1.414213562373095;
      material = new THREE.LineDashedMaterial({
        color: 0x00ffff,
        linewidth: 2,
    	  dashSize: 3,
    	  gapSize: 1
      });
      prefactor = "a/3";
    }
    if (materialToUse === "inner" && twinningCase) {
      material.color.set(0xff00ff);
    }
  for (var i = 0; i < pointsPairs.length; i++){
    // Define a pair of points to make a line
    var v1  = new THREE.Vector3(
      pointsPairs[i][0].pos[0],
      pointsPairs[i][0].pos[1],
      pointsPairs[i][0].pos[2]
    );
    var v2 = new THREE.Vector3(
      pointsPairs[i][1].pos[0],
      pointsPairs[i][1].pos[1],
      pointsPairs[i][1].pos[2]
    );
    var points = [v1, v2];

    // Get the corresponding vector from this pair of points.
    var b_v = new THREE.Vector3(
      v2.x - v1.x,
      v2.y - v1.y,
      v2.z - v1.z
    );
    b_v.setLength(b_length);
    b_v.round();
    var vector_string = b_v.x.toString() + " " + b_v.y.toString() + " " + b_v.z.toString();

    // create the line
    var line_geometry = new THREE.BufferGeometry().setFromPoints( points );
    var line = new THREE.LineSegments( line_geometry, material );
    if (materialToUse === "inner") {
      if (twinningCase) {
        line.layers.set( 10 ); // twinning tet inner lines layer is 10
      } else {
        line.layers.set( 6 ); // direct tet inner lines layer is 6
    }
    } else if (materialToUse === "partial"){
        if (twinningCase) {
          line.layers.set(9); // twinning tet partial lines layer is 9
        } else {
      line.layers.set( 5 ); // direct partial lines layer is 5
      }
    } else {
      if (twinningCase) {
        line.layers.set(2); // twinning tet edge lines layer is 2
      } else {
        line.layers.set(1) // direct tet edge lines layer is 1
      }
    }

    // Add a burgersVector attribute to our line object3D we can reference
    line.thompsonNotation = ''.concat(pointsPairs[i][0].id, pointsPairs[i][1].id)
    line.burgersVector = ''.concat(prefactor ," [", vector_string, "]");
    line.showingText = false;
    line.computeLineDistances();
    if (twinningCase == true) {
      t_lines.push( line );
    } else {
      lines.push( line );
    }
    scene.add( line );
  };
}

function onDocumentMouseUp( event ){
  /* Timeout one: once we've released the mouse, the box unchecks/checks
  and THEN we can see if it was checked or unchecked. */
  setTimeout(() => { checkboxManager(); }, 3);
  render();
}

function createCoordinateAxis(){
  //// Everything coordinate axis - related
  // set their material
  line_materials.push(new THREE.LineBasicMaterial({color: 0xff0000}));
  line_materials.push(new THREE.LineBasicMaterial({color: 0x00ff00}));
  line_materials.push(new THREE.LineBasicMaterial({color: 0x0000ff}));

  // create the lines and add to scene
  o = new THREE.Vector3( 0, 0 ,0 );
  x = new THREE.Vector3( 1, 0, 0 );
  y = new THREE.Vector3( 0, 1, 0 );
  z = new THREE.Vector3( 0, 0, 1 );
  var radius = 0.01;
  var length = 1;
  var lx = new THREE.BufferGeometry().setFromPoints([o, x]);
  var ly = new THREE.BufferGeometry().setFromPoints([o, y]);
  var lz = new THREE.BufferGeometry().setFromPoints([o, z]);
  lx_mesh = new THREE.Line(lx, line_materials[0]);
  ly_mesh = new THREE.Line(ly, line_materials[1]);
  lz_mesh = new THREE.Line(lz, line_materials[2]);

  // add to scene, set layers for visibility / no raycasting conflict.
  coordinates_axis.push( lx_mesh );
  coordinates_axis.push( ly_mesh );
  coordinates_axis.push( lz_mesh );
  lx_mesh.layers.set(28);
  ly_mesh.layers.set(28);
  lz_mesh.layers.set(28);
  scene.add( lx_mesh );
  scene.add( ly_mesh );
  scene.add( lz_mesh );

  // read the basis vectors
  readBasisCoordinateInput();
  // apply the transformation (sanity check), initial value is identity matrix so nothing should happen.
  rotateCoordinateAxis();
}

function readBasisCoordinateInput(){
  x.x = parseInt(document.getElementById( "xx" ).value);
  x.y = parseInt(document.getElementById( "xy" ).value);
  x.z = parseInt(document.getElementById( "xz" ).value);
  y.x = parseInt(document.getElementById( "yx" ).value);
  y.y = parseInt(document.getElementById( "yy" ).value);
  y.z = parseInt(document.getElementById( "yz" ).value);
  z.x = parseInt(document.getElementById( "zx" ).value);
  z.y = parseInt(document.getElementById( "zy" ).value);
  z.z = parseInt(document.getElementById( "zz" ).value);
  x.setLength(3);
  y.setLength(3);
  z.setLength(3);
}

function rotateCoordinateAxis(){
  // Read current desired orientation
  readBasisCoordinateInput();
  var lx = new THREE.BufferGeometry().setFromPoints([o, x]);
  var ly = new THREE.BufferGeometry().setFromPoints([o, y]);
  var lz = new THREE.BufferGeometry().setFromPoints([o, z]);
  console.log(x);
  console.log(y);
  console.log(z);
  scene.remove(lx_mesh);
  scene.remove(ly_mesh);
  scene.remove(lz_mesh);
  lx_mesh = new THREE.Line(lx, line_materials[0]);
  ly_mesh = new THREE.Line(ly, line_materials[1]);
  lz_mesh = new THREE.Line(lz, line_materials[2]);
  lx_mesh.layers.set(28);
  ly_mesh.layers.set(28);
  lz_mesh.layers.set(28);
  scene.add(lx_mesh);
  scene.add(ly_mesh);
  scene.add(lz_mesh);
  render();
}

function toggleSettings() {
  var settings = document.getElementById("settings-sub");
  if (settings.style.display === "none") {
    settings.style.display = "block";
    document.getElementById("settings-toggle-text").innerHTML = "> hide";
    document.getElementById("settings-toggle").style.right = "75%";
  } else {
    settings.style.display = "none";
    document.getElementById("settings-toggle-text").innerHTML = "< show";
    document.getElementById("settings-toggle").style.right = "-10%";
  }
}

function render() {
  renderer.render( scene, camera );
  labelRenderer.render( scene, camera);
}
