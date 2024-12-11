// File: app/roles/page.tsx
'use client';

import React, { Component } from 'react';
import './WishlistPage.scss';
import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
import WishListClient from '@/services/client/common/ClientServices/WishListClient';

interface WishlistState {
  userInfo: any;
  wishlist: any[];
}

class WishlistPage extends Component<{}, WishlistState> {
  wishListServ!: WishListClient;

  constructor(props: {}) {
    super(props);
    subjectService.setHeading({ heading: 'Wish List' });
    this.wishListServ = new WishListClient();
    this.state = {
      userInfo: { RoleName: 'Guest User' },
      wishlist: [
        // {
        //   id: 1,
        //   title: 'Spider-Man',
        //   genre: 'Superhero',
        //   author: 'Stan Lee',
        //   publisher: 'Marvel Comics',
        //   price: '143',
        //   description:
        //     'Spider-Man is a comic-book character who was the original everyman superhero...',
        //   banner:
        //     'https://1hey79cgcukhbvk4.public.blob.vercel-storage.com/Spiderman-FAcVfpoXM2UQkFcIAcMpajfwbWu2uU.jpg',
        //   createdAt: '2024-11-22T20:02:18.823Z',
        //   ordered: false,
        // },
      ],
    };
  }

  componentDidMount(): void {
    this.handleAuth();
  }

  async handleAuth() {
    subjectService.getAuthData().subscribe((res: any) => {
      this.getAllWishList(res.id);
      this.setState({ userInfo: res });
    });
  }

  getAllWishList(userId: string) {
    this.wishListServ.getWishListByuserId(userId).subscribe((res: any) => {
      console.log('get wishList => ', res);
      this.setState({wishlist:res.wishlistItems})
    });
  }

  handleRemove = (itemId: number) => {
    const updatedWishlist = this.state.wishlist.filter(
      (item: any) => item.id !== itemId
    );
    this.setState({ wishlist: updatedWishlist });
  };

  handleOrder = (itemId: number) => {
    const updatedWishlist = this.state.wishlist.map((item: any) =>
      item.id === itemId ? { ...item, ordered: !item.ordered } : item
    );
    this.setState({ wishlist: updatedWishlist });
  };

  render() {
    const { wishlist } = this.state;

    return (
      <div className="wishlist-root">
        {/* <h2 className="wishlist-title">Wishlist</h2> */}
        <div className="wishlist-items">
          {wishlist.map((item: any) => (
            <div key={item.comicData.id} className={`wishlist-item ${item?.ordered ? 'ordered' : ''}`}>
              <img src={item.comicData.banner} alt={item.comicData.title} className="wishlist-item-banner" />
              <div className="wishlist-item-details">
                <h3 className="wishlist-item-title">{item.comicData.title}</h3>
                <p className="wishlist-item-description">{item.comicData.description}</p>
                <p className="wishlist-item-price">Price: ${item.comicData.price}</p>
                <div className="wishlist-item-actions">
                  <button
                    className="wishlist-btn order-btn"
                    onClick={() => this.handleOrder(item.comicData.id)}
                  >
                    {item.ordered ? 'Cancel Order' : 'Order'}
                  </button>
                  <button
                    className="wishlist-btn remove-btn"
                    onClick={() => this.handleRemove(item.comicData.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default WishlistPage;
