/*
$(document).ready(function(){
  // Retrieve access token from sessionStorage
  let accessToken = sessionStorage.getItem('accessToken');

  // Function to fetch menu information based on menu ID
  function fetchMenuInformation(menuId){
    return $.ajax({
      url: `${API_BASE_URL}/menus/${menuId}`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
  }

  function organizeMenuData(menuResponses){
    // Extract menu data from responses
    const menuData = menuResponses.map(response => response[0].data);
    // console.log(menuData);

    // Organize menu data into a tree-like structure
    const menuTree = {};

    menuData.forEach(menuItem => {
      const parentId = menuItem.parentId;
      if(!parentId){
        // If menuItem has no parentId, it's a top-level item
        if(!menuTree[menuItem.id]){
          menuTree[menuItem.id] = { ...menuItem, children: [] };
        }
      }else{
        // If menuItem has a parentId, it's a child item
        if(!menuTree[parentId]){
          menuTree[parentId] = { children: [] };
        }

        menuTree[parentId].children.push(menuItem);
      }
    });

    // Convert menu tree object into an array
    console.log(menuTree) // bener
    const menuArray = Object.values(menuTree);
    console.log(menuArray) // salah

    // Remove children from top-level items if they have the same id as a child
    menuArray.forEach(item => {
      if(menuTree[item.id]){
        delete item.children;
      }
    });

    return menuArray;
  }

  // Function to render menu tree in the sidebar container
  function renderMenuTree(menuTree){
    const $sidebarContainer = $("#sidebarContainer");

    // Recursively create HTML elements for each menu item
    function createMenuElements(menuItem){
      const $menuItemElement = $("<div>").text(menuItem.name);

      if(menuItem.children && menuItem.children.length > 0){
        const $submenuElement = $("<ul>");
        menuItem.children.forEach(child => {
          const $submenuItemElement = createMenuElements(child);
          $submenuElement.append($submenuItemElement);
        });

        $menuItemElement.append($submenuElement);
      }

      return $menuItemElement;
    }

    // Clear existing content in the sidebar container
    $sidebarContainer.empty();

    // Render menu tree in the sidebar container
    menuTree.forEach(menuItem => {
      const $menuItemElement = createMenuElements(menuItem);
      $sidebarContainer.append($menuItemElement);
    });
  }

  // Make an AJAX request to fetch user data
  $.ajax({
    url: `${API_BASE_URL}/auth`,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: function(response){
      // Extract menu IDs from user information
      const menuIds = response.data.role.menuIds;

      // Fetch menu information for each menu ID
      const menuPromises = menuIds.map(menuId => fetchMenuInformation(menuId));

      // Wait for all menu requests to complete
      $.when.apply($, menuPromises)
        .then(function(){
          // Extract menu data from responses
          const menuResponses = Array.prototype.slice.call(arguments);
            
          // Organize menu data into a tree-like structure
          const menuTree = organizeMenuData(menuResponses);
          
          // Render menu tree in the sidebar container
          renderMenuTree(menuTree);
        })
        .fail(function(error){
          console.error("Error fetching menu data:", error);
        });

      // Populate dropdown with user data
      $('#userName').text(response.data.username);
      // $('#userRole').text(response.data.role);
      // $('#userAvatar').attr('src', response.data.avatar);
      // Greeting message
      $('#greetingHeader').text('Hello, ' + response.data.username + '!');
    },
    error: function(xhr, status, error){
      console.error('Error fetching user data:', error);
    }
  });
}); 
*/
$(document).ready(function(){
  // Retrieve access token from sessionStorage
  let accessToken = sessionStorage.getItem('accessToken');
  
  // Make an AJAX request to fetch user data
  $.ajax({
    url: `${API_BASE_URL}/auth`,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: function(response){
      // Populate dropdown with user data
      $('#userName').text(response.data.username);
      // $('#userRole').text(response.data.role);
      // $('#userAvatar').attr('src', response.data.avatar);
      // Greeting message
      $('#greetingHeader').text('Hello, ' + response.data.username + '!');
    },
    error: function(xhr, status, error){
      console.error('Error fetching user data:', error);
    }
  });
});


// Add click event to logout button
$("#logoutButton").click(function(event){
  event.preventDefault(); // Prevent the default action of the link

  // Remove user data and user ID from sessionStorage
  sessionStorage.removeItem('accessToken');
  // sessionStorage.removeItem('userId');

  // Redirect to the login page
  window.location.href = '../../login.html';
});