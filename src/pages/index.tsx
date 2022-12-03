import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react';
import Stripe from 'stripe';

import type { GetStaticProps } from 'next';

import { HomeContainer, Product } from '../styles/pages/home';

// import shirt1Img from '../assets/shirts/variant-1.png';
// import shirt2Img from '../assets/shirts/variant-2.png';
// import shirt3Img from '../assets/shirts/variant-3.png';
// import shirt4Img from '../assets/shirts/variant-4.png';
import { stripe } from '../libs/stripe';

import 'keen-slider/keen-slider.min.css';
import { priceFormatter } from '../utils/formatter';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
}

type HomeProps = {
  products: Product[];
};

export default function Home({ products = [] }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 2,
      spacing: 48,
    },
    breakpoints: {
      '(min-width: 1024px)': {
        slides: {
          perView: 3,
          spacing: 48,
        },
      },
    },
  });

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.length > 0 &&
          products.map(product => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              prefetch={false}
            >
              <Product className="keen-slider__slide">
                <Image src={product.imageUrl} width={520} height={480} alt="" />

                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </footer>
              </Product>
            </Link>
          ))}
      </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  });

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price;
    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: priceFormatter.format(
        price.unit_amount ? price.unit_amount / 100 : 0
      ),
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
