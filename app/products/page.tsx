'use client';
import withRouter from '@/components/routing/withRouter';
import "./product.scss"
import React, { Component } from 'react';
import Products from '@/components/ClassComponents/Products/Products';
import Comics from '@/components/ClassComponents/Comics/Comics';

interface ProductsPageProps {
  router: any; // Router instance
}

class ProductsPage extends Component<ProductsPageProps> {
  navigateToUsers = () => {
    const { router } = this.props;
    router.push('/users?userId=12345'); // Navigate with query parameters
  };

  render() {
    return (
      <div className='product-root-class'>
        {/* <h1>Products Page</h1>
        <button onClick={this.navigateToUsers}>Go to Users Page</button> */}
        {/* <Products></Products> */}
        <Comics></Comics>
      </div>
    );
  }
}

export default withRouter(ProductsPage);
