document.addEventListener("DOMContentLoaded", () => {

    const mushroomContainer = document.querySelector("#mushroom-container");
    const popup = document.getElementById("popup");
    const popupCloseButton = document.getElementById("popup-close");
    const collectedCountDisplay = document.getElementById("collected-count");
    const clockOverlay = document.getElementById("clock-overlay");
    const clockTime = document.getElementById("clock-time");
    const clockDate = document.getElementById("clock-date");
    const showClockButton = document.getElementById("show-clock");
    const focusImage = document.getElementById("focus-image");

    const changeFocusButton = document.getElementById("change-focus");


    // Settings Elements
    const settingsButton = document.getElementById("settings-button");
    const settingsPanel = document.getElementById("settings-panel");
    const manualTimeInput = document.getElementById("manual-time");
    const confirmTimeButton = document.getElementById("confirm-time");
    const setRealTimeButton = document.getElementById("set-real-time");
    const closeSettingsButton = document.getElementById("close-settings");


    //focus mode
    const startFocusButton = document.getElementById("start-focus");
    const focusOverlay = document.getElementById("focus-overlay");
    const focusTimerDisplay = document.getElementById("focus-timer-display");
    const focusCat = document.getElementById("focus-cat");
    const focusSettingsPanel = document.getElementById("focus-settings-panel");
    const confirmFocusTimeButton = document.getElementById("confirm-focus-time");
    const closeFocusSettingsButton = document.getElementById("close-focus-settings");
    const focusTimeInput = document.getElementById("focus-time");
    const focusSummary = document.getElementById("focus-summary");
    const focusSummaryText = document.getElementById("focus-summary-text");
    const closeSummaryButton = document.getElementById("close-summary");
    const stopFocusButton = document.getElementById("stop-focus");


    let now = new Date();

    // Open Settings Panel
    settingsButton.addEventListener("click", () => {
        settingsPanel.classList.remove("hidden");
    });

    // Close Settings Panel
    closeSettingsButton.addEventListener("click", () => {
        settingsPanel.classList.add("hidden");
    });

    // Apply Custom Time
    confirmTimeButton.addEventListener("click", () => {
        const selectedTime = manualTimeInput.value;
        if (!selectedTime) {
            alert("Please enter a valid time.");
            return;
        }

        const [customHours, customMinutes] = selectedTime.split(":").map(Number);
        now.setHours(customHours, customMinutes);
        settingsPanel.classList.add("hidden");

        setFocusImage();
    });


    // Reset to Real Time
    setRealTimeButton.addEventListener("click", () => {
        manualTimeInput.value = ""; // clears input field
        now = new Date();
        settingsPanel.classList.add("hidden");
        setFocusImage();
    });



    const focusImages = {
        morning: [
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/morning/mushroom_morning_scene1.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/morning/mushroom_morning_scene2.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/morning/mushroom_morning_scene3.png",
        ],
        noon: [
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/noon/mushroom_noon_scene1.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/noon/mushroom_noon_scene2.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/noon/mushroom_noon_scene3.png"
        ],
        afternoon: [
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/afternoon/mushroom_afternoon_scene1.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/afternoon/mushroom_afternoon_scene2.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/afternoon/mushroom_afternoon_scene3.png"
        ],
        evening: [
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/evening/mushroom_evening_scene1.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/evening/mushroom_evening_scene2.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/evening/mushroom_evening_scene3.png"
        ],
        night: [
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/nightfall/mushroom_nightfall_scene1.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/nightfall/mushroom_nightfall_scene2.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/nightfall/mushroom_nightfall_scene3.png"
        ],
        dawn: [
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/dawn/mushroom_dawn_scene1.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/dawn/mushroom_dawn_scene2.png",
            "https://yiliu1237.github.io/FungiClock/mushroom_forest/backgrounds/dawn/mushroom_dawn_scene3.png"
        ]
    };

    let currentSet = [];
    let currentIndex = 0;


    function getTimePeriod() {
        const hours = now.getHours();

        if (hours >= 6 && hours < 10) return "morning";
        if (hours >= 10 && hours < 14) return "noon";
        if (hours >= 14 && hours < 18) return "afternoon";
        if (hours >= 18 && hours < 22) return "evening";
        if (hours >= 22 || hours < 2) return "night";
        return "dawn"; // 2am - 6am
    }


    function setFocusImage() {
        const period = getTimePeriod();
        currentSet = focusImages[period];

        if (currentIndex >= currentSet.length) {
            currentIndex = 0;
        }

        focusImage.src = currentSet[currentIndex];

        focusImage.onload = () => {
            getAverageBackgroundColor();

            setMushroomPositions();
        };
    }

    changeFocusButton.addEventListener("click", () => {
        if (currentSet.length > 0) {
            currentIndex = (currentIndex + 1) % currentSet.length;
            setFocusImage();
        }
    });

    setFocusImage(); 

    // Define mushrooms with multiple images per group
    const mushroomGroups = {
        1: ["mushroom1", "mushroom2", "mushroom5", "mushroom7"],
        2: ["mushroom3"],
        3: ["mushroom4"],
        4: ["mushroom6"],
        5: ["mushroom8"],
        6: ["mushroom9", "mushroom10"],
        7: ["mushroom11", "mushroom12"],
        8: ["mushroom13"],
        9: ["mushroom14", "mushroom15"],
        10: ["mushroom16", "mushroom17", "mushroom19"], //"mushroom18"
        11: ["mushroom20", "mushroom21"] // "mushroom22"
    };


    const mushroomGroupIcon = {
        1: ["mushroom1"],
        2: ["mushroom3"],
        3: ["mushroom4"],
        4: ["mushroom6"],
        5: ["mushroom8"],
        6: ["mushroom9"],
        7: ["mushroom11"],
        8: ["mushroom13"],
        9: ["mushroom14"],
        10: ["mushroom18"], 
        11: ["mushroom22"]
    };


    let collected = 0;

    let mushroomPositions = {}; 
    let sceneRemovedMushrooms = {}; // Stores removed mushrooms per scene

    function getSceneKey() {
        return `scene${currentIndex}`;
    }

    function getMushroomGroup(mushroomType) {
        const formattedType = `mushroom${mushroomType}`;
        return Object.entries(mushroomGroups).find(([_, mushrooms]) => mushrooms.includes(formattedType))?.[0] || null;
    }
    

    /** Load Mushroom Positions */
    function loadMushroomPositions() {
        fetch("https://yiliu1237.github.io/FungiClock/mushroom_positions.json")
            .then(response => response.json())
            .then(data => {
                mushroomPositions = data;
                console.log("mushroomPositions: ", data);

                setMushroomPositions();
            })
            .catch(error => console.error("Error loading mushroom positions:", error));
    }

    // updateMushroom is called only once 
    function setMushroomPositions() {
        const period = getTimePeriod(); // Get current time period
        const sceneKey = getSceneKey();

        mushroomContainer.innerHTML = "";  // Clear old mushrooms

        console.log(period);
        console.log(sceneKey);


        if (!mushroomPositions[period] || !mushroomPositions[period][sceneKey]) return;


        mushroomPositions[period][sceneKey].forEach(pos => {
            const mushroomImageURL = `https://yiliu1237.github.io/FungiClock/mushroom_forest/interactive_objects/mushroom${pos.type}.png`;
            const mushroom = document.createElement("img");
            mushroom.src = mushroomImageURL;
            mushroom.classList.add("mushroom");
            mushroom.setAttribute("data-type", pos.type);
            mushroom.setAttribute("data-scene", sceneKey); 
            mushroom.setAttribute("data-period", period);
            mushroom.style.left = pos.left;
            mushroom.style.top = pos.top;
            mushroom.style.width = pos.width;
            mushroom.style.position = "absolute"; // Ensure proper positioning
            mushroom.style.display = "block";
            mushroom.style.visibility = "visible";

            // Click event for mushroom
            mushroom.addEventListener("click", () => {
                const sceneKey = getSceneKey();
                const period = getTimePeriod();
        
                sceneRemovedMushrooms[period] ??= {};
                sceneRemovedMushrooms[period][sceneKey] ??= new Set();;

                sceneRemovedMushrooms[period][sceneKey].add(mushroom); 

                mushroom.style.visibility = "hidden"; // Hide mushroom instead of removing
                collected++;
                collectedCountDisplay.textContent = collected;
            });

            mushroomContainer.appendChild(mushroom);

            console.log("mushroom added");
        });
    }

    function regenerateMushrooms() {
        const period = getTimePeriod();
        const sceneKey = getSceneKey();

        if (!sceneRemovedMushrooms[period] || !sceneRemovedMushrooms[period][sceneKey]) return;

        Object.keys(sceneRemovedMushrooms[period]).forEach(sceneKey => {
            sceneRemovedMushrooms[period][sceneKey].forEach(mushroom => {
                if (!mushroom) return;
                const type = mushroom.dataset.type;

                const group = getMushroomGroup(type);

                //group number starts from 1
                const possibleMushrooms = mushroomGroups[group];
                if (!possibleMushrooms) return;

                // Pick a new random mushroom image from the same group
                const randomMushroomID = possibleMushrooms[Math.floor(Math.random() * possibleMushrooms.length)];
                mushroom.src = `https://yiliu1237.github.io/FungiClock/mushroom_forest/interactive_objects/${randomMushroomID}.png`;

                mushroom.style.visibility = "visible"; // Show the mushroom again

                console.log("mushroom regenerated.")
            });

            // Reset removed mushrooms for this scene
            sceneRemovedMushrooms[period][sceneKey].clear();
        });
    }


    // refreshes all mushrooms every minute
    //setInterval(regenerateMushrooms, 60000);
    // setInterval(regenerateMushrooms, 6000);
    loadMushroomPositions();

    // Function to schedule regeneration at 0s and 30s of every minute
    function scheduleRegeneration() {
        function runRegeneration() {
            regenerateMushrooms();
            console.log("Mushroom regeneration triggered at:", new Date().toLocaleTimeString());
        }

        function scheduleNextRun() {
            const now = new Date();
            const seconds = now.getSeconds();
            let timeToNextRun;

            if (seconds < 30) {
                timeToNextRun = (30 - seconds) * 1000; // Wait until 30 seconds
            } else {
            timeToNextRun = (60 - seconds) * 1000; // Wait until the next minute (0s)
            }

            setTimeout(() => {
                runRegeneration();
                scheduleNextRun(); // Recursively schedule next run
            }, timeToNextRun);
        }

        scheduleNextRun(); // Start the scheduling loop
    }

    scheduleRegeneration();


    // Ensure the overlays are hidden on page load
    popup.classList.add("hidden");
    clockOverlay.classList.add("hidden");

    popupCloseButton.addEventListener("click", closePopup);

    // Show the clock overlay when button is clicked
    showClockButton.addEventListener("click", () => {
        updateClock(); // Ensure time updates immediately
        clockOverlay.classList.remove("hidden");

        getAverageBackgroundColor();
    });

    // Close clock overlay when clicking on it
    clockOverlay.addEventListener("click", () => {
        clockOverlay.classList.add("hidden");
    });

    // Function to update the clock
    function updateClock() {
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        clockTime.textContent = `${hours}:${minutes}`;
        clockDate.textContent = dateStr;
    }

    // Update the clock every second
    setInterval(updateClock, 1000);

    function showPopup() {
        popup.classList.remove("hidden");
    }

    function closePopup() {
        popup.classList.add("hidden");
    }



    function getAverageBackgroundColor() {
        const canvas = document.getElementById("color-analyzer");
        const ctx = canvas.getContext("2d");

        // Ensure the image has loaded before processing
        if (!focusImage.complete) {
            focusImage.onload = getAverageBackgroundColor;
        }

        // Resize canvas to be a small sample of the image (faster processing)
        canvas.width = 50;  // Downsample to 50x50 pixels
        canvas.height = 50;
        ctx.drawImage(focusImage, 0, 0, canvas.width, canvas.height);

        // Get pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let totalPixels = pixels.length / 4;

        let sumR = 0, sumG = 0, sumB = 0;

        // Iterate through every pixel
        for (let i = 0; i < pixels.length; i += 4) {
            sumR += pixels[i];      
            sumG += pixels[i + 1];  
            sumB += pixels[i + 2];  
        }

        const factor = 0.7;
        const avgR = Math.round(sumR / totalPixels) * factor;
        const avgG = Math.round(sumG / totalPixels) * factor;
        const avgB = Math.round(sumB / totalPixels) * factor;
        const averageColor = `rgb(${avgR}, ${avgG}, ${avgB})`;

        clockTime.style.color = averageColor;
        clockDate.style.color = averageColor;
    }



    let focusTimeLeft = 0; // Countdown in seconds
    let totalFocusTime = 0; // Stores initially set time
    let focusInterval;
    let collectedMushrooms = {}; // Tracks mushroom types and counts
    let startTime; // Stores the start timestamp

    // Open Focus Settings Panel
    startFocusButton.addEventListener("click", () => {
        focusSettingsPanel.classList.remove("hidden");
    });

    // Close Focus Settings Panel
    closeFocusSettingsButton.addEventListener("click", () => {
        focusSettingsPanel.classList.add("hidden");
    });

    // Start Focus Timer
    confirmFocusTimeButton.addEventListener("click", () => {
        let minutes = parseInt(focusTimeInput.value);
        if (minutes < 10 || minutes > 180) {
            alert("Please select a time between 10 minutes and 3 hours.");
            return;
        }

        totalFocusTime = minutes * 60; // Convert minutes to seconds
        focusTimeLeft = totalFocusTime;
        collectedMushrooms = {}; // Reset collection tracking
        startTime = Date.now(); // Capture start time

        focusSettingsPanel.classList.add("hidden");
        focusOverlay.classList.remove("hidden");

        startFocusCountdown();
    });

    // Start Countdown Timer
    function startFocusCountdown() {
        updateFocusDisplay();

        focusInterval = setInterval(() => {
            focusTimeLeft--;

            if (focusTimeLeft <= 0) {
                clearInterval(focusInterval);
                endFocusSession();
            } else {
                updateFocusDisplay();
                collectMushroomAutomatically();
            }
        }, 1000);
    }

    // Update Timer Display
    function updateFocusDisplay() {
        let hours = Math.floor(focusTimeLeft / 3600);
        let minutes = Math.floor((focusTimeLeft % 3600) / 60);
        let seconds = focusTimeLeft % 60;

        focusTimerDisplay.textContent = 
            `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    // Automatically Collect Mushrooms
    let automaticCollectedMushrooms = 0;
    let mushroomGroupCounts = {}; 
    const MushroomsPerSecond = 1;

    function collectMushroomAutomatically() {
        const period = getTimePeriod();
        const sceneKeys = Object.keys(mushroomPositions[period]);
    
        sceneKeys.forEach(sceneKey => {
            if (mushroomPositions[period][sceneKey]) {
                mushroomPositions[period][sceneKey].forEach(mushroom => {
                    const type = mushroom.type;  // Use mushroom.type instead of dataset.type
                    const group = getMushroomGroup(type);
    
                    if (group) {
                        mushroomGroupCounts[group] = (mushroomGroupCounts[group] || 0) + 1;
                        automaticCollectedMushrooms++;
                    }
                });
            }
        });
    
        // Determine mushrooms collected based on time and frequency
        let MushroomCollectedElapsedTime = Math.floor((totalFocusTime - focusTimeLeft) * MushroomsPerSecond);

        Object.keys(mushroomGroupCounts).forEach(group => {
            let perGroupCollected = Math.floor(mushroomGroupCounts[group] * MushroomCollectedElapsedTime);
        
            const possibleMushrooms = mushroomGroups[group];
            if (possibleMushrooms) {
                // Distribute mushrooms fairly among the available types
                let mushroomsPerType = Math.floor(perGroupCollected / possibleMushrooms.length);
        
                possibleMushrooms.forEach(mushroomType => {
                    collectedMushrooms[mushroomType] = (collectedMushrooms[mushroomType] || 0) + mushroomsPerType;
                });
        
                // Handle any leftover mushrooms due to rounding
                let remainingMushrooms = perGroupCollected % possibleMushrooms.length;
                for (let i = 0; i < remainingMushrooms; i++) {
                    let extraMushroom = possibleMushrooms[Math.floor(Math.random() * possibleMushrooms.length)];
                    collectedMushrooms[extraMushroom] = (collectedMushrooms[extraMushroom] || 0) + 1;
                }
            }
        });
    

        // // Update the total collected mushrooms counter //Incorrect place!!
        // collected += automaticCollectedMushrooms;
        // console.log("automaticCollectedMushrooms:", automaticCollectedMushrooms);
        // collectedCountDisplay.textContent = collected;

        console.log("Mushrooms collected automatically:", collectedMushrooms);
    }
    


    // Stop Focus Session Early
    stopFocusButton.addEventListener("click", () => {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds
        let completedRatio = elapsedTime / totalFocusTime; // Calculate completion %

        // Scale collected mushrooms based on elapsed time
        Object.keys(collectedMushrooms).forEach((mushroom) => {
            collectedMushrooms[mushroom] = Math.round(collectedMushrooms[mushroom] * completedRatio);
        });

        clearInterval(focusInterval);
        endFocusSession();
    });


    function endFocusSession() {
        focusOverlay.classList.add("hidden");
        focusSummary.classList.remove("hidden");
    
        let summaryHTML = "<h3>You collected:</h3>";
    
        summaryHTML += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 10px; text-align: center;">`;
    
        Object.entries(mushroomGroupCounts).forEach(([group, count]) => {
            let imageURL = `https://yiliu1237.github.io/FungiClock/mushroom_forest/interactive_objects/${mushroomGroupIcon[group]}.png`;
    
            summaryHTML += `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="${imageURL}" style="width: 50px; height: 50px; object-fit: cover;">
                    <span style="font-size: 16px; font-weight: bold;">x${count}</span>
                </div>
            `;
        });
    
        summaryHTML += `</div>`; // Close the grid div
    
        focusSummaryText.innerHTML = summaryHTML; // Insert HTML into the summary

        // Update the total collected mushrooms counter
        collected += automaticCollectedMushrooms;
        console.log("automaticCollectedMushrooms:", automaticCollectedMushrooms);
        collectedCountDisplay.textContent = collected;
    }



    // Close Summary
    closeSummaryButton.addEventListener("click", () => {
        focusSummary.classList.add("hidden");
    });

    // Animate Cat During Focus Session
    const catImages = ["https://yiliu1237.github.io/FungiClock/mushroom_forest/cats/cat1.png", 
        "https://yiliu1237.github.io/FungiClock/mushroom_forest/cats/cat2.png", 
        "https://yiliu1237.github.io/FungiClock/mushroom_forest/cats/cat3.png", 
        "https://yiliu1237.github.io/FungiClock/mushroom_forest/cats/cat4.png"];

    let catIndex = 0;
    let catAnimating = false;
        
    function animateFocusCat() {
        if (catAnimating) return; // Prevent overlapping animations
        catAnimating = true;
        
        focusCat.style.opacity = "0"; // Start fade-out
        setTimeout(() => {
            catIndex = (catIndex + 1) % catImages.length;
            focusCat.src = catImages[catIndex];
            focusCat.style.opacity = "1"; // Fade-in effect
        
            catAnimating = false;
        }, 300); // Adjust transition delay
    }
        
    setInterval(animateFocusCat, 1000);       

});
