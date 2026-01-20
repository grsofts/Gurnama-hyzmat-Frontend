import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Flex, Spin, Typography } from "antd";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Flex
        align="center"
        justify="center"
        vertical
        style={{
          height: "100vh",
          background: "#f5f7fa",
        }}
      >
        <Spin size="large" />
        <Typography.Text style={{ marginTop: 16, color: "#8c8c8c" }}>
          Loading…
        </Typography.Text>
      </Flex>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}