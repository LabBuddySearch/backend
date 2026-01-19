import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import labsterLogo from "@/assets/labster-logo.png";
import { UnderlinedLink } from "@/components/UnderlinedLink";
import { authService } from "@/services/authService";
import { PATHS } from "@/router/paths";

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData);
      localStorage.setItem("authorId", response.id);
      localStorage.setItem("userName", response.name);

      navigate(PATHS.ROOT);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFF5]">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={labsterLogo} alt="Labster" className="h-16 w-16" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Вход в Labster</h1>
        <p className="text-gray-600 text-center mb-6">
          Введите почту и пароль, чтобы войти
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <UnderlinedLink
                onClick={() => navigate("/forgot-password")}
                className="text-sm"
              >
                Забыли пароль?
              </UnderlinedLink>
            </div>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите Ваш email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-2 rounded-md hover:bg-orange-600 transition bg-[#FF684D] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
        <p className="text-center mt-4">
          Нет аккаунта?{" "}
          <UnderlinedLink onClick={() => navigate("/auth")}>
            Зарегистрироваться
          </UnderlinedLink>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
