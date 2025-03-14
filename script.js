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
            "https://lh3.googleusercontent.com/d/16Y8meE7FBiKQDSGisBD1kpMZFyxh_kWe",
            "https://lh3.googleusercontent.com/d/1WzgUZgJVOfC5wK8WbtXOoPXfa-pFGt6J",
            "https://lh3.googleusercontent.com/d/1UogWV-dy1Ll8OB_PQmG1j4TQdEs7lnW7"
        ],
        noon: [
            "https://lh3.googleusercontent.com/d/1RrAKGyhnco31hw2PpqQw4gwMhRofAlb4",
            "https://lh3.googleusercontent.com/d/1qVW_itLmjGKRzqEgtFIjyWiNRaXUO4Ng",
            "https://lh3.googleusercontent.com/d/1iQMaD0ob4u4-d0-GXszKGYYblInANHD4"
        ],
        afternoon: [
            "https://lh3.googleusercontent.com/d/16901YHbEfi3tmO3aetmizSuZBhzGhFI1",
            "https://lh3.googleusercontent.com/d/1wPkQAdkJIZbxZQS_UM_8Qi1ySJeaiLQP",
            "https://lh3.googleusercontent.com/d/1HoeKCP5QZuDdvuOQt4gZORaZor7VjeiE"
        ],
        evening: [
            "https://lh3.googleusercontent.com/d/1ByQZExswP6NQey4h7y8xK_-PPV9W4KjG",
            "https://lh3.googleusercontent.com/d/1jZBfgqmMKcwjTWCO2UwXvvV_YomG1Yrq",
            "https://lh3.googleusercontent.com/d/1VI7LU42obeE9O9W1jdaX--rD7dC6OZCR"
        ],
        night: [
            "https://lh3.googleusercontent.com/d/1leuS-UAKMbtRdULQR27JbGpkER8m22mL",
            "https://lh3.googleusercontent.com/d/1l-nrgp-h_VJljwcQarJv703XdWPFIzjG",
            "https://lh3.googleusercontent.com/d/12eGi43nV_1dnyP7p0thsuyd26fPwc4GB"
        ],
        dawn: [
            "https://lh3.googleusercontent.com/d/1aPtKOwnpJEQyIq3iH70UOW04kT_9fdWl",
            "https://lh3.googleusercontent.com/d/1cLFsAYEILZ21rZzYLq3z04Gzh4lZhmMZ",
            "https://lh3.googleusercontent.com/d/1nWInoUBjIdfAmieS-moBYcEGb9C5cnHR"
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
        };
    }

    changeFocusButton.addEventListener("click", () => {
        if (currentSet.length > 0) {
            currentIndex = (currentIndex + 1) % currentSet.length;
            setFocusImage();

            setMushroomPositions();
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
        // fetch("https://yiliu1237.github.io/Forest-Wander/mushroom_positions.json")
        //     .then(response => response.json())
        //     .then(data => {
        //         mushroomPositions = data;
        //         console.log("mushroomPositions: ", data);

        //         setMushroomPositions();
        //     })
        //     .catch(error => console.error("Error loading mushroom positions:", error));

        const data = {
            "morning": {
                "scene0": [
                    { "type": "2", "left": "84vw", "top": "53vh", "width": "3vw"},
                    { "type": "3", "left": "16vw", "top": "57vh", "width": "8vw"},
                    { "type": "4", "left": "37vw", "top": "41vh", "width": "5vw"},
                    { "type": "5", "left": "22vw", "top": "57vh", "width": "10vw"}
                ],
                "scene1": [
                    { "type": "1", "left": "52vw", "top": "60vh", "width": "5vw"},
                    { "type": "2", "left": "60vw", "top": "30vh", "width": "3.5vw" },
                    { "type": "3", "left": "70vw", "top": "70vh", "width": "5vw" }
                ],
                "scene2": [
                    { "type": "1", "left": "30vw", "top": "60vh", "width": "4.5vw" },
                    { "type": "2", "left": "50vw", "top": "45vh", "width": "4vw" },
                    { "type": "3", "left": "75vw", "top": "65vh", "width": "5.5vw" }
                ]
            },
            "noon": {
                "scene0": [
                    { "type": "1", "left": "52vw", "top": "60vh", "width": "5vw"},
                    { "type": "2", "left": "60vw", "top": "30vh", "width": "3.5vw" },
                    { "type": "3", "left": "70vw", "top": "70vh", "width": "5vw" }
                ],
                "scene1": [
                    { "type": "1", "left": "52vw", "top": "60vh", "width": "5vw"},
                    { "type": "2", "left": "60vw", "top": "30vh", "width": "3.5vw" },
                    { "type": "3", "left": "70vw", "top": "70vh", "width": "5vw" }
                ],
                "scene2": [
                    { "type": "1", "left": "30vw", "top": "60vh", "width": "4.5vw" },
                    { "type": "2", "left": "50vw", "top": "45vh", "width": "4vw" },
                    { "type": "3", "left": "75vw", "top": "65vh", "width": "5.5vw" }
                ]
            },
            "afternoon": {
                "scene0": [
                    { "type": "1", "left": "52vw", "top": "70vh", "width": "5vw"},
                    { "type": "2", "left": "60vw", "top": "70vh", "width": "3.5vw" },
                    { "type": "3", "left": "70vw", "top": "70vh", "width": "5vw" }
                ],
                "scene1": [
                    { "type": "1", "left": "52vw", "top": "60vh", "width": "5vw"},
                    { "type": "2", "left": "60vw", "top": "30vh", "width": "3.5vw" },
                    { "type": "3", "left": "70vw", "top": "70vh", "width": "5vw" }
                ],
                "scene2": [
                    { "type": "1", "left": "30vw", "top": "60vh", "width": "4.5vw" },
                    { "type": "2", "left": "50vw", "top": "45vh", "width": "4vw" },
                    { "type": "3", "left": "75vw", "top": "65vh", "width": "5.5vw" }
                ]
            },
            "evening": {
                "scene0": [
                    { "type": "11", "left": "47vw", "top": "88vh", "width": "8vw"},
                    { "type": "8", "left": "75vw", "top": "76vh", "width": "6vw" },
                    { "type": "13", "left": "9vw", "top": "67vh", "width": "5vw" } //done
                ],
                "scene1": [
                    { "type": "17", "left": "29vw", "top": "61vh", "width": "10vw"},
                    { "type": "6", "left": "41vw", "top": "76vh", "width": "5vw" } //done
                ],
                "scene2": [
                    { "type": "8", "left": "28vw", "top": "92vh", "width": "9vw" },
                    { "type": "2", "left": "58vw", "top": "67vh", "width": "2.5vw" } //done
                ]
            },
            "night": {
                "scene0": [
                    { "type": "1", "left": "52vw", "top": "60vh", "width": "5vw"},
                    { "type": "2", "left": "60vw", "top": "30vh", "width": "3.5vw" },
                    { "type": "3", "left": "70vw", "top": "70vh", "width": "5vw" }
                ],
                "scene1": [
                    { "type": "1", "left": "52vw", "top": "60vh", "width": "5vw"},
                    { "type": "2", "left": "60vw", "top": "30vh", "width": "3.5vw" },
                    { "type": "3", "left": "70vw", "top": "70vh", "width": "5vw" }
                ],
                "scene2": [
                    { "type": "1", "left": "30vw", "top": "60vh", "width": "4.5vw" },
                    { "type": "2", "left": "50vw", "top": "45vh", "width": "4vw" },
                    { "type": "3", "left": "75vw", "top": "65vh", "width": "5.5vw" }
                ]
            },
            "dawn": {
                "scene0": [
                    { "type": "1", "left": "52vw", "top": "60vh", "width": "5vw"},
                    { "type": "2", "left": "60vw", "top": "30vh", "width": "3.5vw" },
                    { "type": "3", "left": "70vw", "top": "70vh", "width": "5vw" }
                ],
                "scene1": [
                    { "type": "1", "left": "52vw", "top": "60vh", "width": "5vw"},
                    { "type": "2", "left": "60vw", "top": "30vh", "width": "3.5vw" },
                    { "type": "3", "left": "70vw", "top": "70vh", "width": "5vw" }
                ],
                "scene2": [
                    { "type": "1", "left": "30vw", "top": "60vh", "width": "4.5vw" },
                    { "type": "2", "left": "50vw", "top": "45vh", "width": "4vw" },
                    { "type": "3", "left": "75vw", "top": "65vh", "width": "5.5vw" }
                ]
            }
        };
         
        mushroomPositions = data;
        console.log("mushroomPositions: ", data);


        setMushroomPositions();
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
            const mushroomImageURL = `https://yiliu1237.github.io/Forest-Wander/mushroom_forest/interactive_objects/mushroom${pos.type}.png`;
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
                mushroom.src = `https://yiliu1237.github.io/Forest-Wander/mushroom_forest/interactive_objects/${randomMushroomID}.png`;

                mushroom.style.visibility = "visible"; // Show the mushroom again

                console.log("mushroom regenerated.")
            });

            // Reset removed mushrooms for this scene
            sceneRemovedMushrooms[period][sceneKey].clear();
        });
    }


    // refreshes all mushrooms every minute
    //setInterval(regenerateMushrooms, 60000);
    setInterval(regenerateMushrooms, 600);
    loadMushroomPositions();


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
});
