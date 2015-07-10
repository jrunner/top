	//build the top menu
function buildTopMenuItem(topMenuObjects) {
	var navBarNode = document.getElementById("top.menu.navBar.node");
	/*
	 <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="caret"></span> </a>
	 <ul class="dropdown-menu" role="menu">
	 <li><a href="#">Action</a></li>
	 <li><a href="#">Another action</a></li>
	 <li><a href="#">Something else here</a></li>
	 <li class="divider"></li>
	 <li class="dropdown-header">Nav header</li>
	 <li><a href="#">Separated link</a></li>
	 <li><a href="#">One more separated link</a></li>
	 </ul></li>
	 */
	for(var i = 0; i < 5 && i < topMenuObjects; i++) {
		//
		var menuNode = document.createElement("LI");
		var menuNodeId = "top.menu." + i;
		//
		menuNode.id = menuNodeId;

		//
		if(i == 0) {
			//sonLiNode.setAttribute("class", "dropdown active");
			menuNode.className = "dropdown active";
		}
		//
		var menuNodeAction = document.createElement("A");
		menuNodeAction.className = "dropdown-toggle";
		menuNodeAction.href = "#";
		//send menu node click event;
		//menuNodeAction.onclick=function(){alert('click me!');};
		menuNodeAction.setAttribute("data-toggle", "dropdown");
		menuNodeAction.innerHTML = menuNodeId + " <span class=\"caret\"></span>";
		//
		menuNode.appendChild(menuNodeAction);
		//
		var sonMenuNode = document.createElement("UL");
		sonMenuNode.className = "dropdown-menu";
		sonMenuNode.setAttribute("role", "menu");
		menuNode.appendChild(sonMenuNode);

		//
		for(var sonIndex = 0; sonIndex < 5; sonIndex++) {

			var sonMenuLINode = document.createElement("LI");
			sonMenuLINode.innerHTML = "<a href=\"javascript:alert();\">Action" + sonIndex + "</a>";
			//
			sonMenuNode.appendChild(sonMenuLINode);
			
			var sonDividerNode=document.createElement("LI");
			sonDividerNode.className="divider";
			sonMenuNode.appendChild(sonDividerNode);
		}
		//

		//sonLiNode.innerHTML="<a href=\"javascript:selectTopMenu('top.menu."+i+"')\">top.menu."+i+"</a>";
		navBarNode.appendChild(menuNode);
	}
	if(topMenuObjects <= 5) {
		return;
	}
	//add more top menu

}