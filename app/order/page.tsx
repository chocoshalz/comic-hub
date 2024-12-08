'use client'
// File: app/orders/page.tsx
import React, { Component } from 'react';
import './OrdersPage.scss'; // Import SCSS file for styling
import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
import orderService from '@/services/client/common/ClientServices/OrderClient';
import toast from 'react-hot-toast';

class OrdersPage extends Component//<{}, OrdersState> 
{
  state = {
    loading:true,
    orders: [
    //   {
    //     "order": {
    //         "id": "e79ea30b-801a-43e6-809f-6cc5b1efdaba",
    //         "userId": "3f5a19ff-a5a7-4be8-8381-7400b52be9e3",
    //         "comicId": "de9a53bf-357c-4461-8ff2-e5f2569240e0",
    //         "orderDate": "2024-11-24T09:10:44.823Z",
    //         "status": "order created",
    //         "createdAt": "2024-11-24T09:10:44.823Z"
    //     },
    //     "comicData": {
    //         "id": "de9a53bf-357c-4461-8ff2-e5f2569240e0",
    //         "title": "spiderman",
    //         "genre": "spideqq",
    //         "author": "deepu",
    //         "publisher": "hello",
    //         "price": "143",
    //         "description": "Spider-Man, a comic-book character who was the original everyman superhero, was created by writer Stan Lee and illustrator Steve Ditko.\n\nHow does Spider-Man get his powers?\n\nAmerican teenager Peter Parker, a poor sickly orphan, is bitten by a radioactive spider. As a result of the bite, he gains superhuman strength, speed, and agility, along with the ability to cling to walls, turning him into Spider-Man. Parker also acquired a precognitive “spidey-sense” that alerted him to approaching dangers.\n\nWhen was the Spider-Man \"Ultimate\" comic line launched?\n\nThe Spider-Man “Ultimate” comic line was launched in 2000 with the debut of Ultimate Spider-Man. The “Ultimate” series allowed writers and artists to reinterpret classic stories. The Ultimate Spider-Man ran until 2009 and concluded with Peter Parker's apparent death.\n\nIn what Marvel movie did Tom Holland first appear as Spider-Man?\n\nSee full list on britannica.com",
    //         "banner": "https://1hey79cgcukhbvk4.public.blob.vercel-storage.com/Spiderman-FAcVfpoXM2UQkFcIAcMpajfwbWu2uU.jpg",
    //         "createdAt": "2024-11-22T20:02:18.823Z"
    //     }
    // }
    ]
  };
  constructor(props: {}) {
    super(props);
    subjectService.setHeading({heading:"Orders"})
    
  }

  componentDidMount(): void {
    this.handleAuth()
  }
  userInfo:any 
  handleAuth()
  {
    
    subjectService.getAuthData().subscribe((res:any)=>{
      this.userInfo = res
      console.log("this.userInfo => ", this.userInfo)
        this.getOrdersList()
    })
  }

  getOrdersList()
  {
    if( this.userInfo.roleName === "User")
      {
        this.getOrdersListById()
      }
      else if( this.userInfo.roleName === "Admin")
      {
        this.getGlobalOrdersList()
      }
  }

  getGlobalOrdersList()
  {
    orderService.getGlobalOrdersList().subscribe((orders:any)=>{
      console.log("orders => ", orders)
      this.setState({orders:orders.orders, loading:false})
    })
  }

  getOrdersListById()
  {
    orderService.getAllOrderList(this.userInfo.id).subscribe((orders:any)=>{
      console.log("orders => ", orders)
      this.setState({orders:orders.orders, loading:false})
    })
  }

  completeOrder(order:any)
  {
    console.log("complete order => ", order)
    orderService.updateOrder(order.order.id, "order completed").subscribe((res:any)=>{
      toast.success(res.message)
      this.getOrdersList()
    })
  }

  cancelOrder(order:any)
  {
    console.log("cancel order => ", order)
    orderService.RemoveOrder(order.order.id).subscribe((res:any)=>{
      toast.success(res.message)
      this.getOrdersList()
    })
  }

  acceptOrder(order:any)
  {
    console.log("accept order => ", order)
    orderService.updateOrder(order.order.id, "order accepted").subscribe((res:any)=>{
      toast.success(res.message)
      this.getOrdersList()
    })
  }


  render() {
    const  orders:any = this.state.orders;
    console.log("orders => ", orders)
    
    return (
      <div className="orders-root-class">
        <div className='order-list'>
        {
          orders.length === 0
          ? <div style={{textAlign:'center'}}> no orders found </div>
          : orders.map((order:any,orderI:number)=>(
            <div key={orderI} className='order-card'>
              <div className='order-title'>
               <strong>{order.comicData.title}</strong>
              </div>
               <div className='order-image-description'>
                <div className='order-image'>
                  <img src={order.comicData.banner} alt="" />
                </div>
                <div className='order-description'>
                {order.comicData.description}
                </div>
              </div>
              <div className='order-author-genre-publisher text_dotdotdot'>
                <div><strong>author: </strong>{order.comicData.author}</div>
                <div><strong>genre: </strong>{order.comicData.genre}</div>
                <div><strong>publisher: </strong>{order.comicData.publisher}</div>
              </div>
              <div className='order-status-accept-delete'>
                <div className='order-status'><strong>status: </strong><span className={`${order.order.status}`}>{order.order.status}</span></div>
                {
                 (this.userInfo.roleName === "User" || this.userInfo.roleName === "Admin" && order.order.status !== "order completed") &&
                  <div className='order-cancel' onClick={()=> this.cancelOrder(order)} >cancel order</div>
                }
                {
                  (this.userInfo.roleName === "Admin" && order.order.status === "order created") && 
                  <div className='order-accept' onClick={()=> this.acceptOrder(order)}>accept order</div>
                }
                {
                  (this.userInfo.roleName === "Admin" && order.order.status === "order accepted") && 
                  <div className='order-complete' onClick={()=> this.completeOrder(order)}>complete order</div>
                }
              </div>
            </div>
          ))
        }
        </div>
      </div>
    );
  }
}

export default OrdersPage;
