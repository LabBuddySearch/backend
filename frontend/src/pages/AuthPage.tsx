import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import labsterLogo from "@/assets/labster-logo.png";
import { UnderlinedLink } from "@/components/UnderlinedLink";
import { authService } from "@/services/authService";
import { cities } from "@/hooks/cities";
import { universities } from "@/hooks/universities";
import { PATHS } from "@/router/paths";

const AuthPage: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    city: "",
    universities: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [useCustomStudy, setUseCustomStudy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.city || !formData.universities) {
      setError("Заполните все поля");
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        city: formData.city,
        study: formData.universities,
      });

      localStorage.setItem("authorId", userData.id);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userEmail", userData.email || formData.email);
      localStorage.setItem("userCity", formData.city);
      localStorage.setItem("userStudy", formData.universities);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userData,
          city: formData.city,
          study: formData.universities,
        })
      );
      navigate(PATHS.ROOT);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла ошибка при регистрации"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        <h1 className="text-2xl font-bold text-center mb-2">Регистрация</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Имя
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите ваше имя"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Email
            </label>
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
              Город
            </label>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="customCity"
                checked={useCustomCity}
                onChange={(e) => setUseCustomCity(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="customCity" className="text-sm text-gray-600">
                Указать другой город
              </label>
            </div>

            {useCustomCity ? (
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Введите ваш город"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ) : (
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Выберите город</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Учебное заведение
            </label>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="customStudy"
                checked={useCustomStudy}
                onChange={(e) => setUseCustomStudy(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="customStudy" className="text-sm text-gray-600">
                Указать другое учебное заведение
              </label>
            </div>

            {useCustomStudy ? (
              <input
                type="text"
                name="universities"
                value={formData.universities}
                onChange={handleChange}
                placeholder="Введите ваше учебное заведение"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ) : (
              <select
                name="universities"
                value={formData.universities}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Выберите учебное заведение</option>
                {universities.map((university) => (
                  <option key={university} value={university}>
                    {university}
                  </option>
                ))}
              </select>
            )}
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

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Подтверждение пароля
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF684D] text-white py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
        <div className="text-center mt-4">
          Есть аккаунт?{" "}
          <UnderlinedLink onClick={() => navigate(PATHS.LOGIN)}>
            Войти
          </UnderlinedLink>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
