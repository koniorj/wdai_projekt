import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Typography,
  Button,
  Container,
  Box,
  Rating,
  TextField,
  IconButton,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { user, role } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState("");

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(`reviews_${id}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((res) => setProduct(res.data));
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`reviews_${id}`, JSON.stringify(reviews));
  }, [reviews, id]);

  const handleAddReview = () => {
    if (newReview.trim()) {
      const reviewObject = {
        id: Date.now(),
        text: newReview,
        authorName: user ? user.login : "Anonim",
        authorId: user ? user.id : null,
        date: new Date().toLocaleString(),
      };

      setReviews([reviewObject, ...reviews]);
      setNewReview("");
    }
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter((rev) => rev.id !== reviewId));
  };

  if (!product) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 8,
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: 1, width: "100%", textAlign: "center" }}>
          <img
            src={product.image}
            alt={product.title}
            style={{
              objectFit: "contain",
              maxHeight: "400px",
              width: "100%",
            }}
          />
        </Box>

        <Box sx={{ flex: 1, width: "100%" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom color="white">
            {product.title}
          </Typography>
          <Rating value={product.rating.rate} readOnly />
          <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
            ({product.rating.rate} / 5) — {product.rating.count} opinii
          </Typography>
          <Typography variant="h5" sx={{ mb: 2, color: "#3A83B6" }}>
            ${product.price}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 3, color: "#aeb5b3", lineHeight: 1.6 }}
          >
            {product.description}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Ilość"
              type="number"
              size="small"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              sx={{
                width: 100,
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                  "&:hover fieldset": { borderColor: "white" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
              }}
            />
            <IconButton
              onClick={() => addToCart({ ...product, quantity })}
              sx={{
                bgcolor: "white",
                color: "black",
                width: 50,
                height: 50,
                "&:hover": {
                  bgcolor: "#316E9A",
                  color: "white",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s",
              }}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{ mt: 10, pt: 5, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <Typography
          variant="h5"
          sx={{ color: "white", mb: 3, fontWeight: "bold" }}
        >
          Opinie użytkowników ({reviews.length})
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 5, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            label="Twoja opinia..."
            multiline
            rows={2}
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                "&:hover fieldset": { borderColor: "#316E9A" },
              },
              "& .MuiInputLabel-root": { color: "#aeb5b3" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddReview}
            sx={{
              bgcolor: "#316E9A",
              textTransform: "none",
              px: 4,
              height: "74px",
              mb: "4px",
              fontStyle: "bold",
            }}
          >
            DODAJ
          </Button>
        </Box>

        {reviews.length === 0 ? (
          <Typography sx={{ color: "#aeb5b3", fontStyle: "italic" }}>
            Brak opinii. Bądź pierwszy!
          </Typography>
        ) : (
          reviews.map((rev) => (
            <Box
              key={rev.id}
              sx={{
                p: 2,
                mb: 2,
                bgcolor: "rgba(255, 255, 255, 0.05)",
                borderRadius: 2,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                position: "relative",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#316E9A", fontWeight: "bold" }}
              >
                {rev.authorName}
              </Typography>
              <Typography variant="body2" sx={{ color: "white", my: 1 }}>
                {rev.text}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#aeb5b3", display: "block" }}
              >
                Dodano: {rev.date}
              </Typography>

              {(role === "admin" || (user && user.id === rev.authorId)) && (
                <IconButton
                  onClick={() => handleDeleteReview(rev.id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "rgba(255, 82, 82, 0.7)",
                    "&:hover": { color: "#ff5252" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default ProductDetails;
