/*
 * @name: okImxWeb
 * @author: hui.yang@okg.com
 * @description: ImxSDK集成
 * @Date: 2022-02-18 17:31:11
 */
import { Link, ERC721TokenType, ImmutableXClient } from '@imtbl/imx-sdk';

const linkAddress = 'https://link.x.immutable.com';
const apiAddress = 'https://api.x.immutable.com/v1';
const okImxWeb = {
  getLink() {
    const link = new Link(linkAddress);
    return link;
  },
  async setupAccount() {
    const link = new Link(linkAddress);
    const { address, starkPublicKey } = await link.setup({});
    localStorage.setItem('okt_nft_address', address);
    localStorage.setItem('okt_nft_startPublicKey', starkPublicKey);
    return {address}
  },
  async getUserBalances() {
    const address = localStorage.getItem('okt_nft_address');
    const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
    const obj = await client.getBalances({ user: address });
    const balance = parseInt(obj.imx['_hex'],16);
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
    console.log(orderIds);
    const result = await link.buy(orderIds);
    return result;
  },
  async getOrders() {
    const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
    if(localStorage.getItem('okt_nft_address')){
       const {result} = await client.getOrders()||[];
       return result;
    }
  },
  async getOrder(orderId) {
    console.log(orderId)
    const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
    if(localStorage.getItem('okt_nft_address')){
       const {result} = await client.getOrder({orderId:orderId});
       console.log(result,555)
       return result;
    }
  },
  async cancelOrder(order) {
    const link = new Link(linkAddress);
    link.cancel({ orderId: order });
  },
};
export default okImxWeb;
