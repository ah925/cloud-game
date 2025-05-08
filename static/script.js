// Cloud Types and Matching Game - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, initializing application...');
    
    // Set up event listeners for bento items
    setupBentoGrid();
    
    // Initialize the cloud matching game
    initCloudMatchingGame();
});

// Function to set up the bento grid and expanded content
function setupBentoGrid() {
    // Set up event listeners for bento items
    const bentoItems = document.querySelectorAll('.bento-item');
    bentoItems.forEach(item => {
        item.addEventListener('click', function() {
            const expandId = this.getAttribute('data-expand');
            if (expandId) {
                openExpandedContent(expandId);
            }
        });
    });
    
    // Set up close handlers for expanded content
    const closeButtons = document.querySelectorAll('.close-expanded');
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            closeExpandedContent();
        });
    });
    
    // Close expanded content when clicking overlay
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', closeExpandedContent);
    }
    
    // Close expanded content when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeExpandedContent();
        }
    });
    
    // Apply gradient colors to bento grid
    applyBentoGridGradient();
}

// Function to open expanded content
function openExpandedContent(id) {
    // Hide any currently open expanded content
    closeExpandedContent();
    
    // Show the overlay
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.classList.add('active');
    }
    
    // Show the selected expanded content
    const expandedContent = document.getElementById(id);
    if (expandedContent) {
        expandedContent.classList.add('active');
        
        // Match header color to the bento item
        const bentoItem = document.querySelector(`[data-expand="${id}"]`);
        if (bentoItem) {
            const headerColor = window.getComputedStyle(bentoItem.querySelector('h3')).backgroundColor;
            expandedContent.querySelector('.expanded-header').style.backgroundColor = headerColor;
        }
        
        // Prevent body scrolling when expanded content is open
        document.body.style.overflow = 'hidden';
    }
}

// Function to close expanded content
function closeExpandedContent() {
    // Hide the overlay
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    // Hide all expanded content
    const expandedContents = document.querySelectorAll('.expanded-content');
    expandedContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Re-enable body scrolling
    document.body.style.overflow = '';
}

// Function to apply gradient colors to the bento grid
function applyBentoGridGradient() {
    const bentoItems = document.querySelectorAll('.bento-item');
    const totalItems = bentoItems.length;
    
    // Skip if no items found
    if (totalItems === 0) return;
    
    // Calculate rows and columns
    const gridComputedStyle = window.getComputedStyle(document.querySelector('.bento-grid'));
    const columns = parseInt(gridComputedStyle.gridTemplateColumns.split(' ').length);
    const rows = Math.ceil(totalItems / columns);
    
    console.log(`Applying gradient to bento grid: ${rows} rows, ${columns} columns`);
    
    // Color scheme from white to your blue to darker shades
    const colorScheme = [
        '#FFFFFF',     // White
        '#F0F8FF',     // Alice Blue
        '#E6F3FB',     // Very light blue
        '#D6E6FA',     // Lightest blue
        '#A8C9F2',     // Lighter blue
        '#7AADEA',     // Light blue
        '#4B90E2',     // Your specified blue
        '#3A80D2',     // Slightly darker
        '#2A70C2',     // Darker blue
        '#1A5599',     // Even darker
        '#0D3D7A'      // Darkest blue
    ];
    
    // Apply colors to each item based on its position
    bentoItems.forEach((item, index) => {
        // Calculate position in the grid
        const row = Math.floor(index / columns);
        const col = index % columns;
        
        // Calculate color based on position (0 to 1 for both dimensions)
        const rowProgress = rows > 1 ? row / (rows - 1) : 0;
        const colProgress = columns > 1 ? col / (columns - 1) : 0;
        
        // Combined progress (diagonal from top-left to bottom-right)
        const progress = (rowProgress + colProgress) / 2;
        
        // Calculate which color to use from the scheme
        const colorIndex = Math.min(
            Math.floor(progress * colorScheme.length), 
            colorScheme.length - 1
        );
        
        // Apply color
        const bgColor = colorScheme[colorIndex];
        const h3 = item.querySelector('h3');
        if (h3) {
            h3.style.backgroundColor = bgColor;
        }
        
        // Determine text color based on background brightness
        if (h3) {
            if (colorIndex >= 6) { // From your #4B90E2 and darker
                h3.style.color = '#FFFFFF'; // White text on darker backgrounds
            } else {
                h3.style.color = '#0D3D7A'; // Dark blue text on lighter backgrounds
            }
        }
    });
}

// Cloud Matching Game Logic
function initCloudMatchingGame() {
    console.log('Initializing cloud matching game...');
    
    // Game elements
    const startGameBtn = document.getElementById('startGameBtn');
    const gameBoard = document.getElementById('gameBoard');
    const matchesMade = document.getElementById('matchesMade');
    const gameTimer = document.getElementById('gameTimer');
    
    // Game state variables
    let gameActive = false;
    let timerInterval = null;
    let gameTime = 0;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;
    const totalPairs = 8;
    
    // Cloud data for the game with fallback images and Japanese names
    const cloudPairs = [
        {
            name: "Cirrus",
            japaneseName: "巻雲 (Kōun)",
            description: "Thin, wispy clouds made of ice crystals that look like delicate, feathery strands high in the sky.",
            image: "images/clouds/cirrus.jpg",
            fallbackImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Cirrus_clouds_mar07.jpg/320px-Cirrus_clouds_mar07.jpg"
        },
        {
            name: "Cumulus",
            japaneseName: "積雲 (Sekiun)",
            description: "Fluffy clouds with flat bases and rounded tops, resembling a cotton ball. They form due to thermal convection.",
            image: "images/clouds/cumulus.jpg",
            fallbackImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Cumulus_clouds_in_fair_weather.jpeg/320px-Cumulus_clouds_in_fair_weather.jpeg"
        },
        {
            name: "Stratus",
            japaneseName: "層雲 (Sōun)",
            description: "Gray cloud layer resembling fog that doesn't reach the ground. These clouds can produce drizzle or light snow.",
            image: "images/clouds/stratus.jpg",
            fallbackImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Stratus_clouds_in_Fair_Isle.jpg/320px-Stratus_clouds_in_Fair_Isle.jpg"
        },
        {
            name: "Cumulonimbus",
            japaneseName: "積乱雲 (Sekiranun)",
            description: "Massive thunderstorm clouds with a dark base and tall, flat tops. These clouds often result in heavy rain, hail, lightning, and even tornadoes.",
            image: "images/clouds/cumulonimbus.jpg",
            fallbackImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Cumulonimbus_cloud_in_Swifts_Creek.jpg/320px-Cumulonimbus_cloud_in_Swifts_Creek.jpg"
        },
        {
            name: "Altocumulus",
            japaneseName: "高積雲 (Kōsekiun)",
            description: "White or gray patch-like clouds with a rolled appearance, often arranged in waves or bands. These clouds are composed of water droplets.",
            image: "images/clouds/altocumulus.jpg",
            fallbackImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Altocumulus_cloud.jpg/320px-Altocumulus_cloud.jpg"
        },
        {
            name: "Stratocumulus",
            japaneseName: "層積雲 (Sōsekiun)",
            description: "Puffy white/gray clouds arranged in a low layer or patch with some spots of clear sky visible. One of the most common cloud types.",
            image: "images/clouds/stratocumulus.jpg",
            fallbackImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stratocumulus_stratiformis_translucidus.jpg/320px-Stratocumulus_stratiformis_translucidus.jpg"
        },
        {
            name: "Cirrostratus",
            japaneseName: "巻層雲 (Kōsōun)",
            description: "Transparent, whitish cloud veil that often covers the entire sky. These clouds can create halos around the sun or moon.",
            image: "images/clouds/cirrostratus.jpg",
            fallbackImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Cirrostratus_fibratus.jpg/320px-Cirrostratus_fibratus.jpg"
        },
        {
            name: "Nimbostratus",
            japaneseName: "乱層雲 (Ransōun)",
            description: "Dark gray cloud layer that usually covers the entire sky and produces constant rain or snow. These thick clouds often block out the sun completely.",
            image: "images/clouds/nimbostratus.jpg",
            fallbackImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Nimbostratus_praecipitatio.jpg/320px-Nimbostratus_praecipitatio.jpg"
        }
    ];
    
    // Initialize game
    if (startGameBtn) {
        startGameBtn.addEventListener('click', startGame);
        console.log('Cloud matching game ready to start');
    }
    
    function startGame() {
        console.log('Starting cloud matching game...');
        // Reset game state
        gameActive = true;
        gameTime = 0;
        matchedPairs = 0;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        
        // Update UI
        if (matchesMade) matchesMade.textContent = `Matches: 0/${totalPairs}`;
        if (gameTimer) gameTimer.textContent = 'Time: 0s';
        
        // Clear previous timer
        if (timerInterval) clearInterval(timerInterval);
        
        // Start timer
        timerInterval = setInterval(() => {
            gameTime++;
            if (gameTimer) gameTimer.textContent = `Time: ${gameTime}s`;
        }, 1000);
        
        // Create game cards
        createGameBoard();
    }
    
    function createGameBoard() {
        // Clear the board
        if (!gameBoard) {
            console.error('Game board element not found');
            return;
        }
        
        gameBoard.innerHTML = '';
        
        // Create array with pairs (cloud names and descriptions)
        let cards = [];
        cloudPairs.forEach(cloud => {
            // Card with cloud name, Japanese name, and image
            cards.push({
                type: 'name',
                content: cloud.name,
                japaneseName: cloud.japaneseName,
                pairId: cloud.name,
                image: cloud.image,
                fallbackImage: cloud.fallbackImage
            });
            
            // Card with cloud description
            cards.push({
                type: 'description',
                content: cloud.description,
                pairId: cloud.name
            });
        });
        
        // Shuffle the cards
        cards = shuffleArray(cards);
        
        // Create card elements
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'game-card';
            cardElement.dataset.pairId = card.pairId;
            cardElement.dataset.type = card.type;
            cardElement.dataset.index = index;
            
            // Create card front (question mark side)
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            cardFront.textContent = '?';
            
            // Create card back (content side)
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            
            if (card.type === 'name') {
                // For name cards, show name, Japanese name, and image
                const nameDiv = document.createElement('div');
                nameDiv.textContent = card.content;
                nameDiv.style.fontWeight = 'bold';
                nameDiv.style.marginBottom = '5px';
                cardBack.appendChild(nameDiv);
                
                // Add Japanese name if available
                if (card.japaneseName) {
                    const japaneseNameDiv = document.createElement('div');
                    japaneseNameDiv.textContent = card.japaneseName;
                    japaneseNameDiv.className = 'japanese-name';
                    cardBack.appendChild(japaneseNameDiv);
                }
                
                // Add image with proper fallback handling
                if (card.image) {
                    const img = document.createElement('img');
                    img.className = 'card-image';
                    img.alt = card.content;
                    
                    // Use fallback immediately to ensure images show up
                    img.src = card.fallbackImage;
                    
                    cardBack.appendChild(img);
                    
                    // Try loading the primary image in the background
                    const testImg = new Image();
                    testImg.onload = function() {
                        img.src = card.image;
                    };
                    testImg.src = card.image;
                }
            } else {
                // For description cards, just show text
                const descDiv = document.createElement('div');
                descDiv.textContent = card.content;
                descDiv.style.fontSize = '0.8rem';
                descDiv.style.lineHeight = '1.2';
                descDiv.style.overflow = 'auto';
                cardBack.appendChild(descDiv);
            }
            
            // Append front and back to card
            cardElement.appendChild(cardFront);
            cardElement.appendChild(cardBack);
            
            // Add click event
            cardElement.addEventListener('click', flipCard);
            
            // Add to game board
            gameBoard.appendChild(cardElement);
        });
        
        // Apply gradient colors to card fronts
        applyCardGradient();
        
        console.log('Game board created with', cards.length, 'cards');
    }
    
    // Apply gradient colors to cards (similar to bento grid)
    function applyCardGradient() {
        const cards = document.querySelectorAll('.game-card');
        const totalCards = cards.length;
        
        // Skip if no cards found
        if (totalCards === 0) return;
        
        // Calculate rows and columns
        const columns = 4; // We're using a 4-column grid for the game
        const rows = Math.ceil(totalCards / columns);
        
        // Color scheme from white to blue to darker shades (same as bento grid)
        const colorScheme = [
            '#FFFFFF',     // White
            '#F0F8FF',     // Alice Blue
            '#E6F3FB',     // Very light blue
            '#D6E6FA',     // Lightest blue
            '#A8C9F2',     // Lighter blue
            '#7AADEA',     // Light blue
            '#4B90E2',     // Your specified blue
            '#3A80D2',     // Slightly darker
            '#2A70C2',     // Darker blue
            '#1A5599',     // Even darker
            '#0D3D7A'      // Darkest blue
        ];
        
        // Apply colors to each card based on its position
        cards.forEach((card) => {
            // Get card index
            const index = parseInt(card.dataset.index);
            
            // Calculate position in the grid
            const row = Math.floor(index / columns);
            const col = index % columns;
            
            // Calculate color based on position (0 to 1 for both dimensions)
            const rowProgress = rows > 1 ? row / (rows - 1) : 0;
            const colProgress = columns > 1 ? col / (columns - 1) : 0;
            
            // Combined progress (diagonal from top-left to bottom-right)
            const progress = (rowProgress + colProgress) / 2;
            
            // Calculate which color to use from the scheme
            const colorIndex = Math.min(
                Math.floor(progress * colorScheme.length), 
                colorScheme.length - 1
            );
            
            // Apply color
            const bgColor = colorScheme[colorIndex];
            const cardFront = card.querySelector('.card-front');
            if (cardFront) {
                cardFront.style.backgroundColor = bgColor;
            }
            
            // Determine text color based on background brightness
            if (cardFront) {
                if (colorIndex >= 6) { // From your #4B90E2 and darker
                    cardFront.style.color = '#FFFFFF'; // White text on darker backgrounds
                } else {
                    cardFront.style.color = '#0D3D7A'; // Dark blue text on lighter backgrounds
                }
            }
        });
    }
    
    function flipCard() {
        // Ignore if board is locked or this card is already flipped/matched
        if (lockBoard || this === firstCard || this.classList.contains('matched')) return;
        
        // Flip this card
        this.classList.add('flipped');
        console.log('Card flipped:', this.dataset.pairId, this.dataset.type);
        
        // If this is the first card flipped
        if (!firstCard) {
            firstCard = this;
            return;
        }
        
        // This is the second card
        secondCard = this;
        checkForMatch();
    }
    
    function checkForMatch() {
        // Lock the board while checking
        lockBoard = true;
        
        // Check if the cards match
        const isMatch = firstCard.dataset.pairId === secondCard.dataset.pairId;
        console.log('Checking match:', isMatch, firstCard.dataset.pairId, secondCard.dataset.pairId);
        
        if (isMatch) {
            // Mark cards as matched
            disableCards();
            matchedPairs++;
            
            // Update matches counter
            if (matchesMade) matchesMade.textContent = `Matches: ${matchedPairs}/${totalPairs}`;
            
            // Check if game is complete
            if (matchedPairs === totalPairs) {
                endGame();
            } else {
                // Reset board for next selection
                resetBoard();
            }
        } else {
            // Not a match, flip cards back
            unflipCards();
        }
    }
    
    function disableCards() {
        // Mark the cards as matched
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        // Remove click event
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }
    
    function unflipCards() {
        // Wait a bit before flipping back
        setTimeout(() => {
            if (firstCard) firstCard.classList.remove('flipped');
            if (secondCard) secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }
    
    function resetBoard() {
        // Reset variables
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }
    
    function endGame() {
        // Stop the timer
        clearInterval(timerInterval);
        
        // Show celebration message
        setTimeout(() => {
            gameBoard.innerHTML = `
                <div class="game-message">
                    <h3>Congratulations! 🎉</h3>
                    <p>You matched all pairs in ${gameTime} seconds!</p>
                    <button id="playAgainBtn" class="game-button">Play Again</button>
                </div>
            `;
            
            // Add confetti effect
            createConfetti();
            
            // Add event listener to play again button
            const playAgainBtn = document.getElementById('playAgainBtn');
            if (playAgainBtn) {
                playAgainBtn.addEventListener('click', startGame);
            }
        }, 1000);
    }
    
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'celebration';
        gameBoard.appendChild(confettiContainer);
        
        // Create confetti pieces
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: ${getRandomColor()};
                top: -10px;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random()};
                transform: rotate(${Math.random() * 360}deg);
                animation: fall ${Math.random() * 3 + 2}s linear forwards;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        // Add animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(${gameBoard.clientHeight}px) rotate(${Math.random() * 360 + 360}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Remove confetti after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }
    
    function getRandomColor() {
        const colors = ['#4b90e2', '#75cff0', '#ffffff', '#3a6cb7', '#2a70c2'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}