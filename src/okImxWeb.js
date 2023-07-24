/*
 * @name: okImxWeb
 * @author: hui.yang@okg.com
 * @description: ImxSDK集成
 * @Date: 2022-02-18 17:31:11
 */
import { Link, ERC721TokenType, ImmutableXClient,ERC20TokenType } from "@imtbl/imx-sdk";

const linkAddress = "https://link.x.immutable.com";
const apiAddress = "https://api.x.immutable.com/v1";
const feeAddress = "0x8c79ed1b720a8d67ca7c99de49fa0d3ba46a157d";
const makerFees = [
  {
    percentage: 0.5, // 0.5%
    recipient: feeAddress, // Beneficiary eth address
  },
];
const takerFee = [
  {
    percentage: 0.5, // 0.5%
    recipient: feeAddress, // Beneficiary eth address
  },
];
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
  async getUserBalances(symbol) {
    const address = localStorage.getItem("okt_nft_address");
    const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
    const { result } = await client.listBalances({ user: address });
    console.log(result);
    const arr = result.filter((item) => {
      return item.symbol === symbol;
    });

    const key = "_hex";
    const amount = parseInt(arr[0]?.balance[key], 16)|| 0;
   
    return amount / 10 ** parseInt(18, 10);
  },
  async transferERC721(asset, addressToSendTo) {
    const link = new Link(linkAddress);
    await link.batchNftTransfer([
      {
        type: ERC721TokenType.ERC721,
        tokenId: asset.id,
        tokenAddress: asset.token_address,
        toAddress: addressToSendTo,
      },
    ]);
  },
  // 出售
  async sell(amount, tokenId, tokenAddress) {
    const link = new Link(linkAddress);
    const result = await link.sell({
      amount,
      tokenId,
      tokenAddress,
      fees: makerFees,
    });
    return result;
  },
  async buy(orderIds, takerFees) {
    const link = new Link(linkAddress);
    const result = await link.buy({
      orderIds: [orderIds],
      fees: takerFees || takerFee,
    });
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
  /**
   *  amount: 充值数量，示例：0.0001，
   *  type: 币种类型：ETH、IMX、USDC、GOODS、GOD；默认空或者不传充值ETH
   *
   * */
  async despoit(amount, type = "ETH") {
    const link = new Link(linkAddress);
    const obj = {
      ETH: {
        type: "ETH",
      },
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
       type: ERC20TokenType.ERC20,
        symbol: "GODS",
        tokenAddress: "0xccc8cb5229b0ac8069c51fd58367fd1e622afd97",
      },
      GOG: {
       type: ERC20TokenType.ERC20,
        symbol: "GOG",
        tokenAddress: "0x9ab7bb7fdc60f4357ecfef43986818a2a3569c62",
      },
      OMI: {
        type: ERC20TokenType.ERC20,
        symbol: 'OMI',
        tokenAddress: '0xed35af169af46a02ee13b9d79eb57d6d68c1749e',
      },
    };
    return link.deposit({
      amount,
      ...obj[type],
    });
  },
};
export default okImxWeb;
