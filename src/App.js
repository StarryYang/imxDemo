/*
 * @name: ImxDemo
 * @author: hui.yang@okg.com
 * @description: ImxDemo 调研
 * @Date: 2022-02-22 16:51:49
 */
import React, { useState } from "react";
import { Button, Input, Row, Col ,message} from "antd";
import okImxWeb from "./okImxWeb";
import "./App.less";

const App = () => {
  const tokenId = "52041845";
  const tokenAddress = "0xacb3c6a43d15b907e8433077b6d38ae40936fe2c";
  const [order, setOrder] = useState("");
  const [price, setPrice] = useState("");
  const [addr,setAddr] = useState("");
  const [list,setList] = useState([]);
  const [balance,setBalance] = useState('');
  const linkWallet = async() => {
   const {address} = await okImxWeb.setupAccount();
   setAddr(address)
  };
  const buy = (orderIds) => {
    console.log(orderIds, 1111);
    okImxWeb.buy(orderIds);
  };
  const sell = () => {
    okImxWeb.sell(price, tokenId, tokenAddress);
  };
  const search = () => {
    okImxWeb.getOrders(tokenAddress);
  };
  const cancel = () => {
    okImxWeb.cancelOrder(order);
  };
  const transformNft = () => {
    okImxWeb.transferERC721(
      {
        id: "0x8d83587d0440c78df20cb38ddcb92c87c92d2c7109ec849b6d62fdc4ab610ce9",
        token_address: "0xacb3c6a43d15b907e8433077b6d38ae40936fe2c",
      },
      "0x09D5e8711bbb6bC376435E6A8625848E0dd01343"
    );
  };
 const getOrders = async() =>{
   if(!localStorage.getItem('okt_nft_address')) return message.error('请链接钱包');
   const orders = await okImxWeb.getOrders();
   console.log(orders);
   setList(orders);
 }
  const getBalance = async() =>{
    const ban=  await okImxWeb.getUserBalances();
    setBalance(ban)
  }
  const getOrder = async() =>{
    const result = await okImxWeb.getOrder(order);
    console.log(result)
  }
  return (
    <div className="imx-container">
      <h1>Imx调研</h1>
      {
            addr&&
            <p>钱包地址：{addr}</p>
          }
          {
            balance&&
            <p>账户余额:{balance}</p>
          }
      <Row gutter={16}>
        <Col span={12} className="gutter-row">
          <Button
            onClick={() => {
              linkWallet();
            }}
          >
            链接钱包
          </Button>
         
        </Col>
        <Col span={12} className="gutter-row">
          <Input
            placeholder="请输入订单编号"
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
            }}
          ></Input>
          <Button
            onClick={() => {
              buy({ orderIds: [order] });
            }}
          >
            购买
          </Button>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12} className="gutter-row">
          <Input
            placeholder="请输入价格"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          ></Input>
          <Button
            onClick={() => {
              sell();
            }}
          >
            出价
          </Button>
        </Col>
        <Col span={12} className="gutter-row">
          <Input
            placeholder="请输入订单编号"
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
            }}
          ></Input>
          <Button
            onClick={() => {
              search();
            }}
          >
            查询orderId
          </Button>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12} className="gutter-row">
          <Button
            onClick={() => {
              transformNft();
            }}
          >
            转移
          </Button>
        </Col>
        <Col span={12} className="gutter-row">
            <Input
              placeholder="请输入订单编号"
              value={order}
              onChange={(e) => {
                setOrder(e.target.value);
              }}
            />
            <Button
              onClick={() => {
                cancel();
              }}
            >
              取消订单
            </Button>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Button onClick={()=>{getBalance()}}>查询账户余额</Button>
        </Col>
        <Col span={12}>
          <Button onClick={()=>{getOrders()}}>查询所有订单</Button>
        </Col>
      </Row>
      {list&&(
        list.map((item,index)=>{
          return <div key={item.order_id}>
            <p>订单号：{item.order_id}</p>
            <p>user: {item.user}</p>
           </div>
        })
      )}
    </div>
  );
};

export default App;
