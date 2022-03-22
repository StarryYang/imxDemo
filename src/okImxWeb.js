/*
 * @name: okImxWeb
 * @author: hui.yang@okg.com
 * @description: ImxSDK集成
 * @Date: 2022-02-18 17:31:11
 */
import { Link, ERC721TokenType, ImmutableXClient } from "@imtbl/imx-sdk";

const linkAddress = "https://link.x.immutable.com";
const apiAddress = "https://api.x.immutable.com/v1";
const okImxWeb = {
  getLink() {
    const link = new Link(linkAddress);
    return link;
  },
  async setupAccount() {
    const link = new Link(linkAddress);
    const { address, starkPublicKey } = await link.setup({});
    localStorage.setItem("okt_nft_address", address);
    localStorage.setItem("okt_nft_startPublicKey", starkPublicKey);
    return { address };
  },
  async getUserBalances() {
    const address = localStorage.getItem("okt_nft_address");
    const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
    const obj = await client.getBalances({ user: address });
    console.log(obj);
    const balance = parseInt(obj.imx["_hex"], 16);
    return balance;
  },
  async transferERC721(asset, addressToSendTo) {
    const link = new Link(linkAddress);
    await link.transfer({
      type: ERC721TokenType.ERC721,
      tokenId: asset.id,
      tokenAddress: asset.token_address,
      to: addressToSendTo,
    });
  },
  // 出售
  async sell(amount, tokenId, tokenAddress) {
    const link = new Link(linkAddress);
    const result = await link.sell({
      amount,
      tokenId,
      tokenAddress,
    });
    return result;
  },
  async buy(orderIds) {
    const link = new Link(linkAddress);
    const result = await link.buy(orderIds);
    return result;
  },
  async getOrders() {
    const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
    if (localStorage.getItem("okt_nft_address")) {
      const { result } = (await client.getOrders()) || [];
      return result;
    }
  },

  async getAssets() {
    const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
    const address = localStorage.getItem("okt_nft_address");
    if (address) {
      const assets = await client.getAssets({
        user: address,
      });
      console.log(assets);
      return assets;
    }
  },
  async getOrder(orderId) {
    const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
    if (localStorage.getItem("okt_nft_address")) {
      const { result } = await client.getOrder({ orderId: orderId });
      return result;
    }
  },
  async cancelOrder(orderId) {
    const link = new Link(linkAddress);
    link.cancel({ orderId: orderId });
  },
  async despoit(amount, type) {
    const link = new Link(linkAddress);
    const obj = {
      IMX: {
        type: "ERC20",
        symbol: "IMX",
        tokenAddress: "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
      },
      USDC: {
        type: "ERC20",
        symbol: "USDC",
        tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      },
      GODS: {
        type: "ERC20",
        symbol: "GODS",
        tokenAddress: "0xccc8cb5229b0ac8069c51fd58367fd1e622afd97",
      },
    };
    link.deposit({
      amount: amount,
      ...obj[type],
    });
  },
};
export default okImxWeb;
