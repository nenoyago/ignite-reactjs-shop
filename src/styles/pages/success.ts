import { styled } from '..';

export const SuccessContainer = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  height: 656,

  h1: {
    fontSize: '$2xl',
    color: '$gray100',
  },

  p: {
    fontSize: 'xl',
    textAlign: 'center',
    color: '$gray300',
    lineHeight: 1.4,
    maxWidth: 560,
    marginTop: '2rem',
  },

  a: {
    fontSize: '$lg',
    fontWeight: 'bold',
    marginTop: '5rem',
    display: 'block',
    color: '$green500',

    '&:hover': {
      color: '$green300',
      transition: 'color 0.2s ease',
    },
  },
});

export const ImageContainer = styled('div', {
  width: '100%',
  maxWidth: 130,
  height: 145,
  background: 'linear-gradient(100deg, #1ea483 0%, #7465d4 100%)',
  borderRadius: 8,
  padding: '0.25rem',
  marginTop: '4rem',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  img: {
    objectFit: 'cover',
  },
});
