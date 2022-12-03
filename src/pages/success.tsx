import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Stripe from 'stripe';
import { stripe } from '../libs/stripe';
import { ImageContainer } from '../styles/pages/success';
import { SuccessContainer } from '../styles/pages/success';

type SuccessProps = {
  customerName: string;
  product: {
    name: string;
    imageUrl: string;
  };
};

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>

        <meta name="robots" content="noindex" />
      </Head>
      <SuccessContainer>
        <h1>Compra efetuada!</h1>

        {product && (
          <>
            <ImageContainer>
              <Image src={product.imageUrl} width={120} height={110} alt="" />
            </ImageContainer>

            <p>
              Uhuul <strong>{customerName}</strong>, sua {product.name} já está
              a caminho da sua casa.
            </p>
          </>
        )}

        <Link href={'/'}>Voltar ao catálogo</Link>
      </SuccessContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      props: {},
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const sessionId = String(query.session_id);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    const customerName = session.customer_details?.name;
    const product = session.line_items?.data[0].price
      ?.product as Stripe.Product;

    return {
      props: {
        customerName,
        product: product && {
          name: product.name,
          imageUrl: product.images[0],
        },
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
