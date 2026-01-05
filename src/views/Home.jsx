// zadanie:
// pobranie listy produktów z API i wyświetlenie ich (używając wielokrotnie ProductCard)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  Box,
  TextField,
} from "@mui/material";
// wszystko powyzej to sa wsm wymogi, css bedzie w wiekszosci zalatwi
// iony tym mui material
import { useCart } from "../context/CartContext";

const Home = () => {
  // lista produktow pobrana z API
  const [products, setProducts] = useState([]);
  // co uzytkownik wpisuje w wyszukiwarke
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    // pobieranie produktow z API
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => setProducts(res.data));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // lg nam rozciaga i dopasowuje jakby
    <Container maxWidth="lg" sx={{ pt: { xs: 7, sm: 9 } }}>
      {/* box jest jak div */}
      <Box sx={{ textAlign: "center", mb: 3, mt: 0 }}>
        <TextField
          fullWidth
          label="Szukaj..."
          variant="outlined"
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 600, mb: 2, bgcolor: "white", borderRadius: 1 }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 3,
        }}
      >
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              "&:hover": { boxShadow: 6 },
            }}
          >
            <Link
              to={`/product/${product.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  height: 110,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  bgcolor: "#f5f5f5",
                }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {product.title.length > 20
                    ? product.title.substring(0, 30) + "..."
                    : product.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2, // Maksymalnie 2 linie opisu
                    fontSize: "0.8rem",
                    lineHeight: 1.4,
                  }}
                >
                  {product.description}
                </Typography>
                <Typography
                  sx={{
                    color: "#2771a7ff",
                    fontWeight: "bold",
                    mt: "auto",
                    mb: 0,
                    pt: 1,
                    textAlign: "left",
                  }}
                >
                  ${product.price}
                </Typography>
              </CardContent>
            </Link>

            <Button
              onClick={(e) => addToCart(product)}
              variant="contained"
              sx={{
                m: 1,
                mt: 0,
                bgcolor: "#316E9A",
                "&:hover": { bgcolor: "#1a5a8a" },
                fontFamily: "inherit",
              }}
            >
              Dodaj
            </Button>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Home;
