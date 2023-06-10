import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconButton,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { shades } from '../../theme';
import { addToCart } from '../../state';
import { useParams } from 'react-router-dom';
import Item from '../../components/Item';

const ItemDetails = () => {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [value, setValue] = useState('description');
  const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);
  const [isSuccessToastOpen, setIsSuccessToastOpen] = useState(false);
  const [isErrorToastOpen, setIsErrorToastOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddToCartClick = () => {
    if (!cart.some((element) => element.id === item.id)) {
      dispatch(addToCart({ item: { ...item, count } }));
      setIsSuccessToastOpen(true);
    } else {
      setIsErrorToastOpen(true);
    }
  };

  async function getItem() {
    const item = await fetch(
      `${process.env.REACT_APP_SERVER_DOMAIN}/api/items/${itemId}?populate=image`,
      { method: 'GET' }
    );
    const itemJson = await item.json();
    setItem(itemJson.data);
  }

  async function getItems() {
    const items = await fetch(
      `${process.env.REACT_APP_SERVER_DOMAIN}/api/items?populate=image`,
      { method: 'GET' }
    );
    const itemsJson = await items.json();
    setItems(itemsJson.data);
  }

  useEffect(() => {
    setCount(1);
    getItem();
    getItems();
  }, [itemId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box width="80%" m="80px auto">
        <Box display="flex" flexWrap="wrap" columnGap="40px">
          {/* IMAGES */}
          <Box flex="1 1 40%" mb="40px">
            <img
              alt={item?.name}
              width="100%"
              height="100%"
              src={`${process.env.REACT_APP_SERVER_DOMAIN}${item?.attributes?.image?.data?.attributes?.formats?.medium?.url}`}
              style={{ objectFit: 'contain' }}
            />
          </Box>

          {/* ACTIONS */}
          <Box flex="1 1 50%" mb="40px">
            <Box display="flex" justifyContent="space-between">
              <Box>Home/Item</Box>
              <Box>Prev Next</Box>
            </Box>

            <Box m="65px 0 25px 0">
              <Typography variant="h3">{item?.attributes?.name}</Typography>
              <Typography>${item?.attributes?.price}</Typography>
              <Typography sx={{ mt: '20px' }}>
                {item?.attributes?.longDescription}
              </Typography>
            </Box>

            {/* COUNT AND BUTTON */}
            <Box display="flex" alignItems="center" minHeight="50px">
              <Box
                display="flex"
                alignItems="center"
                border={`1.5px solid ${shades.neutral[300]}`}
                mr="20px"
                p="2px 5px"
              >
                <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ p: '0 5px' }}>{count}</Typography>
                <IconButton onClick={() => setCount(count + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Button
                sx={{
                  backgroundColor: '#222222',
                  color: 'white',
                  borderRadius: 0,
                  minWidth: '150px',
                  padding: '10px 40px',
                  ':hover': {
                    backgroundColor: shades.primary[200],
                  },
                }}
                onClick={handleAddToCartClick}
              >
                ADD TO CART
              </Button>
            </Box>

            <Box>
              <Box m="20px 0 15px 0" display="flex">
                <FavoriteBorderOutlinedIcon />
                <Typography sx={{ ml: '5px' }}>ADD TO WISHLIST</Typography>
              </Box>
              <Typography>CATEGORIES: {item?.attributes?.category}</Typography>
            </Box>
          </Box>
        </Box>

        {/* INFORMATION */}
        <Box m="20px 0">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="DESCRIPTION" value="description" />
            <Tab label="REVIEWS" value="reviews" />
          </Tabs>
          <Box display="flex" flexWrap="wrap" gap="15px" mt="20px">
            {value === 'description' && (
              <div>{item?.attributes?.longDescription}</div>
            )}
            {value === 'reviews' && <div>reviews</div>}
          </Box>
        </Box>

        {/* RELATED ITEMS */}
        <Box mt="50px" width="100%">
          <Typography variant="h3" fontWeight="bold">
            Related Products
          </Typography>
          <Box
            mt="20px"
            display="flex"
            flexWrap="wrap"
            columnGap="1.33%"
            rowGap="15px"
            justifyContent="space-between"
          >
            {items.slice(0, 4).map((item, i) => (
              <Item key={`${item.name}-${i}`} item={item} />
            ))}
          </Box>
        </Box>
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

export default ItemDetails;
