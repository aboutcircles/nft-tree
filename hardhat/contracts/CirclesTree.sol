// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CirclesTree is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    
    using Strings for uint256;
    uint256 private _tokenIdCounter;
     uint256 private constant _maxSupply = 500;
    uint256 private _maxMintPerAddress = 2;
    mapping(address => uint256) private _mintCounts;
    //enable start and end time
    uint256 public startTime;
    uint256 public endTime;

     constructor(
        address initialOwner
        ) ERC721("CirclesTree", "CTR") Ownable(initialOwner) {
        _tokenIdCounter = 1;
        // startTime = _startTime;
        // endTime = _endTime;
    }


    function getNFTID(uint256 tokenId) public pure returns (string memory) {
        return tokenId.toString();
    }

    string private constant baseURI = "ipfs://bafybeieukurvkaxyglqmwe2fsf5ewgqc6tjbqzk2nec22jgvur533qx3p4";
    function getTokenURI(uint256 tokenId) public pure returns (string memory) {
    return string(abi.encodePacked(
        "data:application/json;base64,",
        Base64.encode(
            abi.encodePacked(
                "{",
                '"name": "Token of Appreciation NFT#', tokenId.toString(), '",',
                '"description": "Minted in Eth CC for donating Circles on Gnosis Chain",',
                '"image": "', baseURI, '"',
                "}"
            )
        )
    ));
    }



    function safeMint(address to) public onlyOwner {
        require(totalSupply() < _maxSupply, "Maximum supply reached");
        require(_mintCounts[to] < _maxMintPerAddress, "Address has reached the maximum mint limit");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, getTokenURI(tokenId));
        
        _mintCounts[to]++;
    }

    // function safeMint(address to) public onlyOwner {
    //     require(block.timestamp >= startTime && block.timestamp <= endTime, "Minting is not allowed at this time");
    //     require(totalSupply() < _maxSupply, "Maximum supply reached");
    //     require(_mintCounts[to] < _maxMintPerAddress, "Address has reached the maximum mint limit");
        
    //     uint256 tokenId = _tokenIdCounter;
    //     _tokenIdCounter += 1;
    //     _safeMint(to, tokenId);
    //     _setTokenURI(tokenId, getTokenURI(tokenId));
        
    //     _mintCounts[to]++;
    // }
    
    function setMaxMintPerAddress(uint256 maxMint) external onlyOwner {
        _maxMintPerAddress = maxMint;
    }

   function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ERC721.ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    function transferFrom(
    address from,
    address to,
    uint256 tokenId
    ) public virtual override(ERC721, IERC721) {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes memory _data
    ) public virtual override(ERC721, IERC721) {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    _safeTransfer(from, to, tokenId, _data);
    }

    function approve(
    address to,
    uint256 tokenId
    ) public virtual override(ERC721, IERC721) {
    }

    // function _burn(
    //     uint256 tokenId
    // ) internal override(ERC721, ERC721URIStorage) {
    //     super._burn(tokenId);
    // }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    }