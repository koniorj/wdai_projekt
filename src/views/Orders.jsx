import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const orders =
    JSON.parse(localStorage.getItem("orders")) || [];

  const userOrders = orders.filter(
    (order) => order.userId === user.id
  );

  return (
    <Container sx={{ pt: 12 }}>
      <Typography variant="h4" gutterBottom>
        Historia zamówień
      </Typography>

      {userOrders.length === 0 ? (
        <Typography>Brak zamówień</Typography>
      ) : (
        userOrders.map((order) => (
          <Card key={order.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography>
                <b>Numer zamówienia:</b> {order.id}
              </Typography>
              <Typography>
                <b>Data:</b> {order.date}
              </Typography>
              <Typography>
                <b>Łączna kwota:</b> ${order.total}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate(`/orders/${order.id}`)
                  }
                >
                  Szczegóły
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Orders;
