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
  },
  async getUserBalances() {
    const address = localStorage.getItem('WALLET_ADDRESS');
    const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
    const balance = await client.getBalances({ user: address });
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
  async getOrders(collectionAddress) {
    // const client = await ImmutableXClient.build(apiAddress);
    window.open(
      `https://api.x.immutable.com/v1/orders?sell_token_address=${collectionAddress}&status=active`
    );
    // console.log(client, 5555);
    // const ordersRequest = await client.getOrders({
    //   status: 'active',
    //   sell_token_address: collectionAddress,
    // });
    // console.log(ordersRequest);
  },
  async cancelOrder(order) {
    const link = new Link(linkAddress);
    link.cancel({ orderId: order });
  },
};
export default okImxWeb;
