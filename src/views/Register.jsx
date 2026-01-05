import { Button, TextField, Box, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Hasła są inne!");
      return;
    }

    const success = register(form.login, form.password);

    if (success) {
      alert("Konto utworzone pomyślnie!");
      navigate("/login");
    } else {
      alert("Ten login jest już zajęty.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 350,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Rejestracja
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Nowy Login"
            fullWidth
            margin="normal"
            required
            value={form.login}
            onChange={(e) => setForm({ ...form, login: e.target.value })}
          />
          <TextField
            label="Hasło"
            type="password"
            fullWidth
            margin="normal"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <TextField
            label="Powtórz Hasło"
            type="password"
            fullWidth
            margin="normal"
            required
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, bgcolor: "#316D98" }}
          >
            Zarejestruj się
          </Button>

          <Button
            fullWidth
            sx={{
              mt: 1,
              color: "#316D98",
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/login")}
          >
            ZALOGUJ SIĘ
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
