"use strict";
var app = app || {};

app.Tree = function() {

    // Create a new tree for the scene
    function Tree()
    {
        var treeTrunkGeo = new THREE.CylinderGeometry(10,15,120,32);
		var treeTrunkMat = new THREE.MeshLambertMaterial({color: 0xbb2222});
		var treeTopGeo = new THREE.SphereGeometry(25,20,20);
		var treeTopMat = new THREE.MeshLambertMaterial({color: 0x00ff00});
				
		var tree = new THREE.Mesh(treeTrunkGeo,treeTrunkMat);
		var treeTop1 = new THREE.Mesh(treeTopGeo,treeTopMat);
		var treeTop2 = new THREE.Mesh(treeTopGeo,treeTopMat);
		var treeTop3 = new THREE.Mesh(treeTopGeo,treeTopMat);
		var treeTop4 = new THREE.Mesh(treeTopGeo,treeTopMat);
		var treeTop5 = new THREE.Mesh(treeTopGeo,treeTopMat);
		tree.castShadow = true;
		treeTop1.castShadow = true;
		treeTop2.castShadow = true;
		treeTop3.castShadow = true;
		treeTop4.castShadow = true;
		treeTop5.castShadow = true;
		
		treeTop1.position.x = 0+(2*treeTopGeo.radius/3);
		treeTop1.position.y = 0+treeTrunkGeo.height/3;
		treeTop1.position.z = 0+(2*treeTopGeo.radius/3);
		treeTop2.position.x = 0+(2*treeTopGeo.radius/3);
		treeTop2.position.y = 0+treeTrunkGeo.height/3;
		treeTop2.position.z = 0-(2*treeTopGeo.radius/3);
		treeTop3.position.x = 0-(2*treeTopGeo.radius/3);
		treeTop3.position.y = 0+treeTrunkGeo.height/3;
		treeTop3.position.z = 0-(2*treeTopGeo.radius/3);
		treeTop4.position.x = 0-(2*treeTopGeo.radius/3);
		treeTop4.position.y = 0+treeTrunkGeo.height/3;
		treeTop4.position.z = 0+(2*treeTopGeo.radius/3);
		treeTop5.position.x = 0;
		treeTop5.position.y = 0+treeTrunkGeo.height/3+(2*treeTopGeo.radius/3);
		treeTop5.position.z = 0;
		
		var combinedGeo = new THREE.Geometry();
		THREE.GeometryUtils.merge(combinedGeo, treeTop1);
		THREE.GeometryUtils.merge(combinedGeo, treeTop2);
		THREE.GeometryUtils.merge(combinedGeo, treeTop3);
		THREE.GeometryUtils.merge(combinedGeo, treeTop4);
		THREE.GeometryUtils.merge(combinedGeo, treeTop5);
		
		var treeTops = new THREE.Mesh(combinedGeo, treeTopMat);
		tree.add(treeTops);
		
		this.mesh = tree;
		
		// random position within the "forest" area
		this.mesh.position.y = 20;
		this.mesh.position.x = app.utilities.getRandom(-900, 300);
		this.mesh.position.z = app.utilities.getRandom(300, 900);
    };
    
    var p = Tree.prototype;
	
	return Tree;
		
}();