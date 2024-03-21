from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:8000"}})

# Mock database for NFTs
nfts = {}

def generate_nft():
    """Generates a random NFT with minimal attributes."""
    nft_number = len(nfts) + 1
    nft = {
        'number': nft_number,
        'minted': False,
        'attributes': {
            'color': random.choice(['red', 'green', 'blue'])
        }
    }
    nfts[nft_number] = nft
    return nft

@app.route('/mint')
def mint_nft():
    """Simulate minting an NFT."""
    nft = generate_nft()
    nft['minted'] = True
    return jsonify(nft)

@app.route('/')
def home():
    return "NFT Tree Simulation Backend Running"

if __name__ == '__main__':
    app.run(debug=True)
