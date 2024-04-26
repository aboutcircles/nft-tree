import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("Circles Tree NFT collection", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, owner, account1, account2] = await hre.ethers.getSigners();

    const NFT = await hre.ethers.getContractFactory("CirclesTree");
    const nft = await NFT.deploy(owner);

    await nft.connect(owner).safeMint(account1);

    return { nft, deployer, owner, account1, account2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { nft, owner } = await loadFixture(deploy);

      expect(await nft.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint for another account", async function () {
      const { nft, account1 } = await loadFixture(deploy);
      expect(await nft.balanceOf(account1)).to.equal(1);
    });

    it("Token id autoincrements", async function () {
      const { nft, owner, account1 } = await loadFixture(deploy);

      expect(await nft.balanceOf(account1)).to.equal(1);
      expect(await nft.ownerOf(1)).to.equal(account1);

      await nft.connect(owner).safeMint(account1);
      expect(await nft.balanceOf(account1)).to.equal(2);
      expect(await nft.ownerOf(2)).to.equal(account1);
    });

    it("Only owner can mint", async function () {
      const { nft, account1, account2 } = await loadFixture(deploy);

      await expect(nft.connect(account1).safeMint(account2)).to.be.reverted;
    });
  });

  describe("Transfers", function () {
    describe("No transfer allowed", function () {
      it("Should revert", async function () {
        const { nft, account1, account2 } = await loadFixture(deploy);

        await expect(
          nft.connect(account1).transferFrom(account1, account2, 0)
        ).to.be.revertedWith("Transfers are disabled.");
      });
    });

    describe("Events", function () {
      it("Should emit an event on mint", async function () {
        const { nft, owner, account1, account2 } = await loadFixture(deploy);

        await expect(nft.connect(owner).safeMint(account1))
          .to.emit(nft, "Transfer")
          .withArgs(ZERO_ADDRESS, account1, "2");
      });
    });
  });
});
