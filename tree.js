let nfts = []; // Initialize NFT array with null values
const gridSize = 100; // 100x100 grid for 10,000 NFTs
const blockSize = 6; // Size of each block
let remainingBlocks = gridSize * gridSize; // Total number of blocks

function setup() {
  createCanvas(1000, 1000);
  noLoop();
  drawGrid();
}

function drawGrid() {
  background(255);
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      stroke(0);
      fill(255); // Start with all white blocks
      rect(x * blockSize, y * blockSize, blockSize, blockSize);
    }
  }
}

function colorBlock(index) {
  let x = index % gridSize;
  let y = Math.floor(index / gridSize);
  let color = nfts[index].attributes.color; // Assuming color attribute is given
  fill(color);
  noStroke();
  rect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function displayMintingInfo(nft, index) {
    let nftInfoDiv = document.createElement('div');
    nftInfoDiv.classList.add('nft-info');
    nftInfoDiv.innerHTML = `
      <h3>NFT #${index + 1}</h3>
      <p>Color: ${nft.attributes.color}</p>
      <p>Size: ${nft.attributes.size}</p>
      <p>Status: ${nft.minted ? 'Minted' : 'Not Minted'}</p>
    `;
    
    // Get a reference to the container for mint information
    let mintInfoContainer = document.getElementById('mint-info-container');
  
    // Prepend the new minting info to the mint info container, ensuring newest info is on top
    if (mintInfoContainer.firstChild) {
      mintInfoContainer.insertBefore(nftInfoDiv, mintInfoContainer.firstChild);
    } else {
      // If it is the first element, just add it normally
      mintInfoContainer.appendChild(nftInfoDiv);
    }
  }
  

function displayRemainingBlocks() {
  let remainingBlocksDiv = document.getElementById('remaining-blocks');
  remainingBlocksDiv.textContent = `Remaining Blocks: ${remainingBlocks}`;
}

function fetchNFTs() {
  fetch('http://127.0.0.1:5000/mint')
  // fetch('https://cosmic-travesseiro-f7cb88.netlify.app/mint')
    .then(response => response.json())
    .then(data => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * (gridSize * gridSize));
      } while (nfts[randomIndex]); // Find an unminted block

      data.number = randomIndex + 1; // Assign the NFT number based on the random index
      nfts[randomIndex] = data; // Store NFT at the random index
      colorBlock(randomIndex); // Color the block for this NFT
      displayMintingInfo(data, randomIndex); // Update the sidebar with this NFT's info
      remainingBlocks--; // Decrement the remaining blocks count
      displayRemainingBlocks(); // Update the remaining blocks display
    })
    .catch(error => {
      console.error('Error fetching NFTs:', error);
    });
}

setInterval(fetchNFTs, 3000); // Fetch a new NFT every 2 seconds