import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardMedia,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const total = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      id: Date.now(),
      userId: user.id,
      date: new Date().toLocaleString(),
      items: cart.map((item) => ({
        ...item,
        quantity: item.quantity ?? 1,
      })),
      total,
    };

    localStorage.setItem(
      "orders",
      JSON.stringify([...existingOrders, newOrder])
    );

    clearCart();
    navigate("/orders");
  };

  if (cart.length === 0) {
    return (
      <Container sx={{ minHeight: "80vh", pt: 15, textAlign: "center" }}>
        <Typography variant="h5">Twój koszyk jest pusty</Typography>
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => navigate("/")}
        >
          Wróć do zakupów
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pt: 12 }}>
      <Typography variant="h4" gutterBottom>
        Twój koszyk
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {cart.map((item) => (
          <Card
            key={item.id}
            sx={{ display: "flex", alignItems: "center", p: 2 }}
          >
            <CardMedia
              component="img"
              image={item.image}
              alt={item.title}
              sx={{ width: 80, height: 80, objectFit: "contain" }}
            />

            <Box sx={{ flexGrow: 1, ml: 2 }}>
              <Typography>{item.title}</Typography>
              <Typography fontWeight="bold">
                ${item.price} x {item.quantity}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <IconButton
                  onClick={() => addToCart(item, -1)}
                  disabled={item.quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>

                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>

                <IconButton onClick={() => addToCart(item, 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            <IconButton onClick={() => removeFromCart(item.id)}>
              <DeleteIcon />
            </IconButton>
          </Card>
        ))}
      </Box>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Suma</Typography>
          <Typography variant="h6" fontWeight="bold">
            ${total}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button fullWidth variant="contained" onClick={handleCheckout}>
          Kup teraz
        </Button>
      </Paper>
    </Container>
  );
};

export default Cart;
