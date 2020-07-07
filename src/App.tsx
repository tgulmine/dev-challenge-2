import React, { useEffect, useState } from 'react';
import './styles/main.scss';
import { Header } from './components/Header/';
import { ProductCard } from './components/ProductCard/';
import { ShoppingCart } from './components/ShoppingCart/';
import { api } from './api/';
import { IProduct, IVoucher } from './utils/interfaces';

const App: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [productsInCart, setProductsInCart] = useState<IProduct[]>([]);

  function addOrRemoveProduct(product: IProduct) {
    let cart = [...productsInCart];
    const found = cart.find(productInCart => productInCart === product);
    product.inCart = found ? 0 : 1;
    setProductsInCart(found ? cart.filter(p => p !== product) : [...cart, product]);
  }

  function updateProductQuantity(product: IProduct, add: boolean) {
    let cart = [...productsInCart];
    const newProduct = cart.find(productInCart => productInCart === product);
    if (newProduct) {
      if (add && newProduct.inCart < newProduct.available) newProduct.inCart++;
      else if (!add && newProduct.inCart > 0) newProduct.inCart--;
      let index = cart.findIndex(productInCart => productInCart === product);
      cart.splice(index, 1, newProduct);
      setProductsInCart(cart);
    }
  }

  function setCurrentProducts(products: IProduct[]) {
    products.map((p: IProduct) => (p.inCart = 0));
    setProducts(products);
  }

  console.log('products', products);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products.json');
      setCurrentProducts(data.products);
    } catch (e) {
      console.log('error fetching products', e.response.data);
    }
  };

  const fetchVouchers = async () => {
    try {
      const { data } = await api.get('/vouchers.json');
      setVouchers(data.vouchers);
    } catch (e) {
      console.log('error fetching vouchers', e.response.data);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="pt-16 px-20">
        <div className="flex justify-between">
          <div className="flex flex-wrap w-3/5">
            {products &&
              products.map((product: IProduct, index: number) => {
                return <ProductCard key={index} product={product} addOrRemoveProduct={addOrRemoveProduct} />;
              })}
          </div>
          <div className="w-2/5">
            {console.log({ productsInCart })}
            <ShoppingCart productsInCart={productsInCart} updateProductQuantity={updateProductQuantity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
