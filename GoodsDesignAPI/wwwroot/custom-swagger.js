const myInitFunction = () => {
    var searchDiv = document.createElement("div");

    // Styling the container, search input, and checkbox container using inline CSS
    searchDiv.innerHTML = `
        <span style="font-size: 20px; font-weight: 900;">Search</span>
        <input 
            type="text" 
            id="apiSearch" 
            placeholder="Search APIs..." 
            style="
                flex: 1 1 0%; 
                height: 40px; 
                width: 100%; 
                border-radius: 8px; 
                border: 1px solid #d1d5db; 
                background-color: #f9fafb; 
                padding-left: 12px; 
                padding-right: 12px; 
                font-size: 14px; 
                color: #111827; 
                transition: border-color 0.2s; 
                outline: none; 
                margin: 10px 0;
            "
            onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 2px rgba(59, 130, 246, 0.5)';" 
            onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none';"
        />
        <div style="margin: 10px 0;">
            <span style="font-size: 16px; font-weight: 700;">Filter by Tag</span>
            <div id="checkboxContainer" style="
                display: flex; 
                flex-wrap: wrap; 
                margin-top: 10px;
            "></div>
        </div>
    `;

    document.querySelector(".information-container .main").appendChild(searchDiv);

    var input = document.getElementById("apiSearch");
    var checkboxContainer = document.getElementById("checkboxContainer");

    // Populate checkboxes with unique data-tag values
    var tags = document.getElementsByClassName("opblock-tag-section");
    var uniqueTags = new Set();
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i].querySelector('[data-tag]').getAttribute('data-tag');
        uniqueTags.add(tag);
    }
    uniqueTags.forEach(tag => {
        var checkboxDiv = document.createElement("div");
        checkboxDiv.style.margin = "5px";
        checkboxDiv.innerHTML = `
            <label style="display: flex; align-items: center;">
                <input type="checkbox" value="${tag}" style="margin-right: 8px;">
                ${tag}
            </label>
        `;
        checkboxContainer.appendChild(checkboxDiv);
    });

    // Function to filter based on both input and selected checkboxes
    const filterContent = () => {
        var filter = input.value.toLowerCase();
        var checkedTags = Array.from(checkboxContainer.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value.toLowerCase());

        for (var i = 0; i < tags.length; i++) {
            var tagSection = tags[i];
            var tag = tagSection.querySelector('[data-tag]').getAttribute('data-tag').toLowerCase();
            var operations = tagSection.querySelectorAll('.opblock');

            var tagMatches = (checkedTags.length === 0 || checkedTags.includes(tag));

            operations.forEach(operation => {
                var path = operation.querySelector('[data-path]').getAttribute('data-path').toLowerCase();
                var pathMatches = path.includes(filter);

                if (tagMatches && pathMatches) {
                    operation.style.display = "";
                } else {
                    operation.style.display = "none";
                }
            });

            // Hide the entire tag section if no operations are visible
            var anyOperationVisible = Array.from(operations).some(op => op.style.display === "");
            tagSection.style.display = anyOperationVisible ? "" : "none";
        }
    };

    // Event listeners for input and checkboxes
    input.addEventListener("keyup", filterContent);
    checkboxContainer.addEventListener("change", filterContent);
};

const addDarkModeToggle = () => {
    const authWrapper = document.querySelector(".auth-wrapper");

    if (!authWrapper) {
        console.error("Cannot find .auth-wrapper element to add the dark mode toggle.");
        return;
    } else {
        console.log("Adding dark mode toggle...")
    }

    const toggleDiv = document.createElement("span");
    toggleDiv.style.margin = "10px 0";
    toggleDiv.style.textAlign = "right";
    toggleDiv.innerHTML = `
        <label style="cursor: pointer; font-size: 16px; font-weight: 700;">
            <input type="checkbox" id="darkModeToggle" style="margin-right: 8px;">
            Dark Mode
        </label>
    `;

    // Append the toggle button to the main container
    authWrapper.prepend(toggleDiv);

    const toggleCheckbox = document.getElementById("darkModeToggle");

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        const isDarkMode = toggleCheckbox.checked;
        const swaggerUI = document.querySelector(".swagger-ui");
        if (isDarkMode) {
            swaggerUI.classList.add("dark-mode");
        } else {
            swaggerUI.classList.remove("dark-mode");
        }
    };

    // Add event listener to toggle button
    toggleCheckbox.addEventListener("change", toggleDarkMode);
};

// Add the dark mode toggle after initialization
setTimeout(() => {
    myInitFunction();
    setTimeout(() => {
        addDarkModeToggle();
    }, 1000);
}, 4000);