import { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Stripe from 'stripe';
import axios from 'axios';

import { stripe } from '../../libs/stripe';
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/product';
import { priceFormatter } from '../../utils/formatter';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: {
    id: string;
    amount: string;
  };
}

type ProductProps = {
  product: Product;
};

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false);
  const { isFallback } = useRouter();

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSession(true);

      const response = await axios.post('/api/checkout', {
        priceId: product.price.id,
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (err) {
      setIsCreatingCheckoutSession(false);

      alert('Falha ao redirecionar ao checkout!');
    }
  }

  if (isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price.amount}</span>

          <p>{product.description}</p>

          <button
            onClick={handleBuyProduct}
            disabled={isCreatingCheckoutSession}
          >
            {isCreatingCheckoutSession ? 'Aguarde um momento' : 'Comprar agora'}
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { id: 'prod_MpoBjUjYfzyOyk' },
      },
      {
        params: { id: 'prod_MpoA6NkWFAgrbt' },
      },
    ],
    fallback: 'blocking',
  };
};

type PageProps =
  | {
      product: Product;
    }
  | {};

type ContextParams = {
  id: string;
};

export const getStaticProps: GetStaticProps<PageProps, ContextParams> = async ({
  params,
}) => {
  if (params) {
    const productId = params.id;

    try {
      const response = await stripe.products.retrieve(productId, {
        expand: ['default_price'],
      });

      const price = response.default_price as Stripe.Price;

      const product = {
        id: response.id,
        name: response.name,
        description: response.description,
        imageUrl: response.images[0],
        price: {
          id: price.id,
          amount: priceFormatter.format(
            price.unit_amount ? price.unit_amount / 100 : 0
          ),
        },
      };

      return {
        props: {
          product,
        },
        revalidate: 60 * 60 * 1, // 1 hour
      };
    } catch (err) {
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {},
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};
