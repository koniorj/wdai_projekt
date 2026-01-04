import users from "../mock/users.json";

export const generateToken = (payload, minutes) => {
  return btoa(
    JSON.stringify({
      ...payload,
      exp: Date.now() + minutes * 60 * 1000,
    })
  );
};

export const generateRefreshToken = () => crypto.randomUUID();

export const loginUser = (login, password) => {
  const registeredUsers =
    JSON.parse(localStorage.getItem("registered_users")) || [];
  const allUsers = [...users, ...registeredUsers];

  const user = allUsers.find(
    (u) => u.login === login && u.password === password
  );

  if (!user) return null;

  const accessToken = generateToken({ userId: user.id, role: user.role }, 5);
  const refreshToken = generateRefreshToken();

  const authData = {
    accessToken,
    refreshToken,
    user,
  };

  localStorage.setItem("auth", JSON.stringify(authData));
  return authData;
};

export const registerUser = (login, password) => {
  const registeredUsers =
    JSON.parse(localStorage.getItem("registered_users")) || [];
  const userExists =
    users.some((u) => u.login === login) ||
    registeredUsers.some((u) => u.login === login);

  if (userExists) return false;

  const newUser = {
    id: Date.now(),
    login,
    password,
    role: "user",
  };

  localStorage.setItem(
    "registered_users",
    JSON.stringify([...registeredUsers, newUser])
  );
  return true;
};

export const logoutUser = () => {
  localStorage.removeItem("auth");
};

export const getAuth = () => {
  return JSON.parse(localStorage.getItem("auth"));
};

export const isTokenValid = (token) => {
  try {
    const decoded = JSON.parse(atob(token));
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
};

export const refreshAccessToken = () => {
  const auth = getAuth();
  if (!auth) return null;

  auth.accessToken = generateToken(
    { userId: auth.user.id, role: auth.user.role },
    5
  );

  localStorage.setItem("auth", JSON.stringify(auth));
  return auth;
};
