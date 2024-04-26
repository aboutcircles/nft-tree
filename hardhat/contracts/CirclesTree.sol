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

    constructor(address initialOwner)

        ERC721("CirclesTree", "CTR")
        Ownable(initialOwner)
    { _tokenIdCounter = 1;} // Start token ID from 1

    function generateSVG(uint256 tokenId) public pure returns (string memory) {
    bytes memory svg = abi.encodePacked(
        '<svg width="282" height="282" viewBox="0 0 282 282" fill="none" xmlns="http://www.w3.org/2000/svg">'
        '<style>.base {fill: white;font-family:monospace;font-size: 14px;}</style>'
        '<rect width="282" height="282" fill="#1D1D1D"/>'
        '<mask id="path-1-inside-1_5_3814" fill="white">'
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M129.75 226.668C169.1 226.668 201 188.053 201 140.418C201 92.7834 169.1 54.168 129.75 54.168C90.3997 54.168 58.5 92.7834 58.5 140.418C58.5 188.053 90.3997 226.668 129.75 226.668ZM128.704 206.933C129.261 206.947 129.714 206.493 129.714 205.935V172.228H129.708C115.907 172.228 104.719 157.977 104.719 140.397C104.719 122.817 115.907 108.565 129.708 108.565H129.714V74.8807C129.714 74.3229 129.261 73.8694 128.704 73.8831C122.188 74.0436 115.75 75.7559 109.724 78.9356C103.387 82.2794 97.6283 87.1805 92.7779 93.359C87.9274 99.5376 84.0798 106.873 81.4547 114.945C78.8297 123.018 77.4786 131.67 77.4786 140.408C77.4786 149.146 78.8297 157.798 81.4547 165.871C84.0798 173.943 87.9274 181.278 92.7779 187.457C97.6283 193.636 103.387 198.537 109.724 201.88C115.75 205.06 122.188 206.772 128.704 206.933ZM129.714 172.236C143.515 172.236 154.703 157.984 154.703 140.404C154.703 122.824 143.515 108.573 129.714 108.573V172.236Z"/>'
        '</mask>'
        '<path d="M128.704 206.933L128.741 205.433H128.741L128.704 206.933ZM129.714 172.228H131.214V170.728H129.714V172.228ZM129.714 108.565V110.065H131.214V108.565H129.714ZM128.704 73.8831L128.667 72.3836L128.704 73.8831ZM109.724 78.9356L109.024 77.6089L109.724 78.9356ZM92.7779 93.359L93.9577 94.2853L92.7779 93.359ZM92.7779 187.457L91.598 188.383L92.7779 187.457ZM109.724 201.88L109.024 203.207L109.724 201.88ZM129.714 172.236H128.214V173.736H129.714V172.236ZM129.714 108.573V107.073H128.214V108.573H129.714ZM199.5 140.418C199.5 187.505 168.016 225.168 129.75 225.168V228.168C170.184 228.168 202.5 188.6 202.5 140.418H199.5ZM129.75 55.668C168.016 55.668 199.5 93.3309 199.5 140.418H202.5C202.5 92.2359 170.184 52.668 129.75 52.668V55.668ZM60 140.418C60 93.3309 91.4836 55.668 129.75 55.668V52.668C89.3159 52.668 57 92.2359 57 140.418H60ZM129.75 225.168C91.4836 225.168 60 187.505 60 140.418H57C57 188.6 89.3159 228.168 129.75 228.168V225.168ZM128.214 205.935C128.214 205.675 128.431 205.426 128.741 205.433L128.667 208.432C130.091 208.468 131.214 207.312 131.214 205.935H128.214ZM128.214 172.228V205.935H131.214V172.228H128.214ZM129.708 173.728H129.714V170.728H129.708V173.728ZM103.219 140.397C103.219 158.447 114.761 173.728 129.708 173.728V170.728C117.053 170.728 106.219 157.507 106.219 140.397H103.219ZM129.708 107.065C114.761 107.065 103.219 122.347 103.219 140.397H106.219C106.219 123.287 117.053 110.065 129.708 110.065V107.065ZM129.714 107.065H129.708V110.065H129.714V107.065ZM128.214 74.8807V108.565H131.214V74.8807H128.214ZM128.741 75.3827C128.431 75.3903 128.214 75.1414 128.214 74.8807H131.214C131.214 73.5044 130.091 72.3485 128.667 72.3836L128.741 75.3827ZM110.424 80.2622C116.255 77.1857 122.467 75.5372 128.741 75.3827L128.667 72.3836C121.909 72.55 115.246 74.3262 109.024 77.6089L110.424 80.2622ZM93.9577 94.2853C98.6908 88.2563 104.29 83.4986 110.424 80.2622L109.024 77.6089C102.483 81.0601 96.5659 86.1046 91.598 92.4328L93.9577 94.2853ZM82.8812 115.409C85.4562 107.49 89.2244 100.315 93.9577 94.2853L91.598 92.4328C86.6304 98.7606 82.7033 106.255 80.0282 114.481L82.8812 115.409ZM78.9786 140.408C78.9786 131.823 80.3063 123.328 82.8812 115.409L80.0282 114.481C77.3531 122.708 75.9786 131.517 75.9786 140.408H78.9786ZM82.8812 165.407C80.3063 157.488 78.9786 148.993 78.9786 140.408H75.9786C75.9786 149.299 77.3531 158.108 80.0282 166.335L82.8812 165.407ZM93.9577 186.531C89.2244 180.501 85.4562 173.326 82.8812 165.407L80.0282 166.335C82.7033 174.561 86.6304 182.055 91.598 188.383L93.9577 186.531ZM110.424 200.554C104.29 197.317 98.6908 192.56 93.9577 186.531L91.598 188.383C96.5659 194.711 102.483 199.756 109.024 203.207L110.424 200.554ZM128.741 205.433C122.467 205.279 116.255 203.63 110.424 200.554L109.024 203.207C115.246 206.49 121.909 208.266 128.667 208.432L128.741 205.433ZM153.203 140.404C153.203 157.514 142.369 170.736 129.714 170.736V173.736C144.662 173.736 156.203 158.454 156.203 140.404H153.203ZM129.714 110.073C142.369 110.073 153.203 123.294 153.203 140.404H156.203C156.203 122.354 144.662 107.073 129.714 107.073V110.073ZM131.214 172.236V108.573H128.214V172.236H131.214Z" fill="white" mask="url(#path-1-inside-1_5_3814)"/>'
        '<mask id="path-3-inside-2_5_3814" fill="white">'
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M151.662 226.668C191.013 226.668 222.912 188.052 222.912 140.418C222.912 92.7834 191.013 54.1679 151.662 54.1679C151.028 54.1679 149.502 54.1484 147.493 54.1226C140.667 54.0351 128.253 53.876 126.162 54.1679C126.108 54.1755 126.054 54.1832 126 54.1909C126.553 54.1756 127.107 54.1679 127.662 54.1679C167.013 54.1679 198.912 92.7833 198.912 140.418C198.912 188.052 167.013 226.668 127.662 226.668C127.126 226.668 126.592 226.661 126.059 226.646C126.093 226.654 126.128 226.661 126.162 226.668H127.662H151.662Z"/>'
        '</mask>'
        '<path d="M147.493 54.1226L147.473 55.6225L147.493 54.1226ZM126.162 54.1679L126.37 55.6535H126.37L126.162 54.1679ZM126 54.1909L125.786 52.7062L126.042 55.6903L126 54.1909ZM126.059 226.646L126.099 225.147L125.752 228.115L126.059 226.646ZM126.162 226.668L125.86 228.137L126.01 228.168H126.162V226.668ZM221.412 140.418C221.412 187.505 189.929 225.168 151.662 225.168V228.168C192.096 228.168 224.412 188.6 224.412 140.418H221.412ZM151.662 55.6679C189.929 55.6679 221.412 93.3309 221.412 140.418H224.412C224.412 92.2358 192.096 52.6679 151.662 52.6679V55.6679ZM147.473 55.6225C149.476 55.6481 151.015 55.6679 151.662 55.6679V52.6679C151.04 52.6679 149.529 52.6486 147.512 52.6227L147.473 55.6225ZM126.37 55.6535C126.782 55.596 127.848 55.5504 129.441 55.5252C130.992 55.5007 132.941 55.4959 135.047 55.503C139.257 55.5172 144.059 55.5787 147.473 55.6225L147.512 52.6227C144.1 52.579 139.283 52.5173 135.057 52.503C132.944 52.4959 130.972 52.5006 129.394 52.5256C127.858 52.5499 126.588 52.5939 125.955 52.6823L126.37 55.6535ZM126.214 55.6756C126.265 55.6682 126.317 55.6608 126.37 55.6535L125.955 52.6823C125.898 52.6902 125.842 52.6982 125.786 52.7062L126.214 55.6756ZM126.042 55.6903C126.58 55.6754 127.121 55.6679 127.662 55.6679V52.6679C127.093 52.6679 126.525 52.6758 125.958 52.6915L126.042 55.6903ZM127.662 55.6679C165.929 55.6679 197.412 93.3309 197.412 140.418H200.412C200.412 92.2358 168.096 52.6679 127.662 52.6679V55.6679ZM197.412 140.418C197.412 187.505 165.929 225.168 127.662 225.168V228.168C168.096 228.168 200.412 188.6 200.412 140.418H197.412ZM127.662 225.168C127.14 225.168 126.619 225.161 126.099 225.147L126.019 228.146C126.565 228.161 127.113 228.168 127.662 228.168V225.168ZM126.464 225.199C126.431 225.192 126.398 225.185 126.366 225.178L125.752 228.115C125.789 228.122 125.825 228.13 125.86 228.137L126.464 225.199ZM127.662 225.168H126.162V228.168H127.662V225.168ZM151.662 225.168H127.662V228.168H151.662V225.168Z" fill="white" mask="url(#path-3-inside-2_5_3814)"/>'
        '<text x="20%" y="7%" class="base" dominant-baseline="middle" text-anchor="middle">DAPPCON 2024</text>'
        '<text x="84%" y="94%" class="base" dominant-baseline="middle" text-anchor="middle">', tokenId.toString(), '/1000 </text>'
        '<text x="13%" y="94%" class="base" dominant-baseline="middle" text-anchor="middle"> CIRCLES</text>'
        '</svg>'
    );
    return string(
        abi.encodePacked(
            "data:image/svg+xml;base64,",
            Base64.encode(svg)
        )
    );
}
     function getNFTID(uint256 tokenId) public pure returns (string memory) {
        return tokenId.toString();
    }
    function getTokenURI(uint256 tokenId) public pure returns (string memory){
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Circles DappCon24 NFT#', tokenId.toString(), '",',
                '"description": "Minted at DappCon2024 on Gnosis Chain",',
                '"image": "', generateSVG(tokenId), '"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, getTokenURI(tokenId));
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721, IERC721) {
        revert("Transfers are disabled.");
    }

    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) public virtual override {
    //     revert("Transfers are disabled.");
    // }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override(ERC721, IERC721)  {
        revert("Transfers are disabled.");
    }

    function approve(address to, uint256 tokenId)
        public
        virtual
        override(ERC721, IERC721) {
        revert("Approvals are disabled.");
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
         return super.tokenURI(tokenId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}