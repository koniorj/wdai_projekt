import { Container, Typography, Card, CardMedia, Box } from "@mui/material";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const order = orders.find((o) => o.id.toString() === orderId);

  if (!order) {
    return (
      <Container sx={{ pt: 12 }}>
        <Typography>Nie znaleziono zamówienia</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ pt: 12 }}>
      <Typography variant="h4" gutterBottom>
        Zamówienie #{order.id}
      </Typography>

      <Typography>Data: {order.date}</Typography>
      <Typography sx={{ mb: 3 }}>Łączna kwota: ${order.total}</Typography>

      {order.items.map((item) => (
        <Card
          key={item.id}
          sx={{
            display: "flex",
            mb: 2,
            p: 2,
            alignItems: "center",
          }}
        >
          <CardMedia
            component="img"
            image={item.image}
            sx={{ width: 80, mr: 2 }}
          />

          <Box>
            <Typography>{item.title}</Typography>
            <Typography>Cena: ${item.price}</Typography>
            <Typography>Ilość: {item.quantity ?? 1}</Typography>

            <Typography fontWeight="bold">
              Razem: ${(item.price * (item.quantity ?? 1)).toFixed(2)}
            </Typography>
          </Box>
        </Card>
      ))}
    </Container>
  );
};

export default OrderDetails;
