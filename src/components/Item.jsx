import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconButton,
  Box,
  Typography,
  useTheme,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { shades } from '../theme';
import { addToCart } from '../state';
import { useNavigate } from 'react-router-dom';

const Item = ({ item, width }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const {
    palette: { neutral },
  } = useTheme();
  const [isSuccessToastOpen, setIsSuccessToastOpen] = useState(false);
  const [isErrorToastOpen, setIsErrorToastOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);

  const { category, price, name, image } = item.attributes;
  const {
    data: {
      attributes: {
        formats: {
          medium: { url },
        },
      },
    },
  } = image;

  const handleAddToCartClick = () => {
    if (!cart.some((element) => element.id === item.id)) {
      dispatch(addToCart({ item: { ...item, count } }));
      setIsSuccessToastOpen(true);
    } else {
      setIsErrorToastOpen(true);
    }
  };

  return (
    <>
      <Box width={width}>
        <Box
          position="relative"
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
        >
          <img
            alt={item.name}
            width="300px"
            height="400px"
            src={`${process.env.REACT_APP_SERVER_DOMAIN}${url}`}
            onClick={() => navigate(`/item/${item.id}`)}
            style={{ cursor: 'pointer' }}
          />
          <Box
            display={isHovered ? 'block' : 'none'}
            position="absolute"
            bottom="10%"
            left="0"
            width="100%"
            padding="0 5%"
          >
            <Box display="flex" justifyContent="space-between">
              {/* AMOUNT */}
              <Box
                display="flex"
                alignItems="center"
                backgroundColor={shades.neutral[100]}
                borderRadius="3px"
              >
                <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                  <RemoveIcon />
                </IconButton>
                <Typography color={shades.primary[300]}>{count}</Typography>
                <IconButton onClick={() => setCount(count + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>

              {/* BUTTON */}
              <Button
                onClick={handleAddToCartClick}
                sx={{
                  backgroundColor: shades.primary[300],
                  color: 'white',
                  '&:hover': { backgroundColor: shades.primary[200] },
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Box>

        <Box mt="3px">
          <Typography variant="subtitle2" color={neutral.dark}>
            {category
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase())}
          </Typography>
        </Box>
        <Typography>{name}</Typography>
        <Typography fontWeight="bold">${price}</Typography>
      </Box>

      <Snackbar
        open={isSuccessToastOpen}
        autoHideDuration={3000}
        onClose={() => setIsSuccessToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setIsSuccessToastOpen(false)}
          severity="success"
          sx={{ width: '100%', '& .MuiAlert-message': { margin: 'auto 0' } }}
        >
          Product added to cart successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={isErrorToastOpen}
        autoHideDuration={3000}
        onClose={() => setIsErrorToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setIsErrorToastOpen(false)}
          severity="error"
          sx={{ width: '100%', '& .MuiAlert-message': { margin: 'auto 0' } }}
        >
          Product is already in the cart.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Item;
