import { FC, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cities } from "@/hooks/cities";
import { universities } from "@/hooks/universities";
import { workTypes } from "@/hooks/workTypes";

interface CardFormData {
  workType: string;
  subject: string;
  title: string;
  description: string;
  files: File[];
  university: string;
  city: string;
  existingFiles: string[];
  course: string;
  color: string;
  shadow: string;
}

interface CardFormProps {
  initialData?: Partial<CardFormData>;
  isEditing?: boolean;
  cardId?: string | undefined;
  onSubmit: (data: CardFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  onDelete?: () => void;
  deleting?: boolean;
}

interface FileItem {
  name: string;
  isExisting: boolean;
  index: number;
}

const courses = ["1", "2", "3", "4", "5", "6"];

const colorOptions = [
  { border: "#FFB4A7", shadow: "0_0_20px_rgba(255,180,167,0.3)" },
  { border: "#FFD166", shadow: "0_0_25px_rgba(255,209,102,0.35)" },
  { border: "#06D6A0", shadow: "0_0_25px_rgba(6,214,160,0.4)" },
  { border: "#118AB2", shadow: "0_0_25px_rgba(17,138,178,0.4)" },
  { border: "#073B4C", shadow: "0_0_30px_rgba(7,59,76,0.5)" },
  { border: "#EF476F", shadow: "0_0_25px_rgba(239,71,111,0.4)" },
  { border: "#7209B7", shadow: "0_0_25px_rgba(114,9,183,0.4)" },
  { border: "#F72585", shadow: "0_0_25px_rgba(247,37,133,0.4)" },
  { border: "#4CC9F0", shadow: "0_0_25px_rgba(76,201,240,0.4)" },
  { border: "#4361EE", shadow: "0_0_25px_rgba(67,97,238,0.4)" },
];

export const CardForm: FC<CardFormProps> = ({
  initialData = {},
  isEditing = false,
  cardId,
  onSubmit,
  onCancel,
  onDelete,
  deleting = false,
  loading = false,
}) => {
  const storedColor = useLocalStorage(
    cardId ? `card_color_${cardId}` : "",
    "#FFB4A7"
  );
  const storedShadow = useLocalStorage(
    cardId ? `card_shadow_${cardId}` : "",
    "0_0_20px_rgba(255,180,167,0.3)"
  );
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [useCustomUniversity, setUseCustomUniversity] = useState(false);
  const [formData, setFormData] = useState<CardFormData>({
    workType: "",
    subject: "",
    title: "",
    description: "",
    files: [],
    university: "",
    existingFiles: [],
    course: "",
    city: "",
    color: "#FFB4A7",
    shadow: "0_0_20px_rgba(255,180,167,0.3)",
    ...initialData,
  });

  useEffect(() => {
    if (isEditing && cardId) {
      setFormData((prev) => ({
        ...prev,
        color: storedColor || "#FFB4A7",
        shadow: storedShadow || "0_0_20px_rgba(255,180,167,0.3)",
      }));
    }
  }, [isEditing, cardId, storedColor, storedShadow]);

  useEffect(() => {
    if (initialData.city && !cities.includes(initialData.city)) {
      setUseCustomCity(true);
    }

    if (
      initialData.university &&
      !universities.includes(initialData.university)
    ) {
      setUseCustomUniversity(true);
    }
  }, [initialData.city, initialData.university]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        files: Array.from(e.target.files!),
      }));
    }
  };

  const handleColorChange = (color: string, shadow: string) => {
    setFormData((prev) => ({ ...prev, color, shadow }));
  };

  const getAllFileNames = (): FileItem[] => {
    const allFiles: FileItem[] = [];

    if (formData.existingFiles && formData.existingFiles.length > 0) {
      formData.existingFiles.forEach((fileName: string, index: number) => {
        const cleanName = fileName.split("/").pop() || fileName;
        allFiles.push({
          name: cleanName,
          isExisting: true,
          index,
        });
      });
    }

    if (formData.files && formData.files.length > 0) {
      formData.files.forEach((file: File, index: number) => {
        allFiles.push({
          name: file.name,
          isExisting: false,
          index,
        });
      });
    }

    return allFiles;
  };

  const fileNames = getAllFileNames();

  return (
    <div className="h-[calc(100vh-76px)] p-6">
      <form onSubmit={handleSubmit} className="h-full grid grid-cols-2 gap-8">
        <div className="space-y-6 overflow-y-auto pr-4">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Тип работы
            </label>
            <select
              value={formData.workType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, workType: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-[#FF684D] focus:outline-none"
            >
              <option value="">Выберите тип работы</option>
              {workTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Предмет
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#FF684D] focus:outline-none"
              placeholder="Введите предмет"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Название
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#FF684D] focus:outline-none"
              placeholder="Введите название работы"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#FF684D] focus:outline-none resize-none custom-scrollbar"
              placeholder="Введите описание работы"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Файлы
            </label>
            {fileNames.length > 0 && (
              <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {isEditing ? "Текущие файлы:" : "Прикрепленные файлы:"}
                </p>
                <ul className="space-y-1">
                  {fileNames.map((file, index) => (
                    <li
                      key={`${file.isExisting ? "existing" : "new"}-${index}`}
                      className="flex items-center justify-between text-sm text-gray-600"
                    >
                      <span className="truncate" title={file.name}>
                        {file.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#FF684D] focus:outline-none opacity-0 absolute z-10 cursor-pointer"
              />
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-white flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span className="text-gray-500">
                  {fileNames.length > 0
                    ? `Добавить еще файлов (всего: ${fileNames.length})`
                    : "Прикрепите файлы"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Вуз/колледж
            </label>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="customUniversity"
                checked={useCustomUniversity}
                onChange={(e) => setUseCustomUniversity(e.target.checked)}
                className="mr-2"
              />
              <label
                htmlFor="customUniversity"
                className="text-sm text-gray-600"
              >
                Указать другое учебное заведение
              </label>
            </div>

            {useCustomUniversity ? (
              <input
                type="text"
                value={formData.university}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    university: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#FF684D] focus:outline-none"
                placeholder="Введите название учебного заведения"
              />
            ) : (
              <select
                value={formData.university}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    university: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-[#FF684D] focus:outline-none"
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
            <label className="block text-lg font-semibold text-gray-900 mb-2">
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
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#FF684D] focus:outline-none"
                placeholder="Введите ваш город"
              />
            ) : (
              <select
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-[#FF684D] focus:outline-none"
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
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Курс
            </label>
            <select
              value={formData.course}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, course: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-[#FF684D] focus:outline-none"
            >
              <option value="">Выберите курс</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <div
            className="h-96 w-72 bg-[#FFFFF5] shadow-md border p-4 rounded-xl flex flex-col mx-auto mb-8 transition-all duration-200"
            style={{
              borderColor: formData.color,
              boxShadow: formData.shadow.replace(/_/g, " "),
            }}
          >
            <h2 className="text-xl font-bold text-black text-center">
              {formData.title || "Название работы"}
            </h2>
            <p className="text-lg text-gray-700 mt-2 text-center">
              {formData.subject || "Предмет"}
            </p>
            <p className="text-lg text-gray-700 text-center">
              {formData.workType || "Тип работы"}
            </p>
            <div className="max-h-[150px] mt-4 rounded-md flex-grow overflow-y-auto custom-scrollbar">
              <p className="text-base font-light px-2 mt-2 text-gray-700">
                {formData.description ||
                  "Описание работы будет отображаться здесь"}
              </p>
            </div>
            <div className="mt-auto text-right">
              <p className="text-base text-gray-900 font-light">
                {formData.university || "Учебное заведение"}
              </p>
              <p className="text-base text-gray-900 font-light">
                {formData.course} курс
              </p>
              <p className="text-base text-gray-900 font-light">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Выберите цвет карточки
            </label>
            <div className="grid grid-cols-5 gap-6">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption.border}
                  type="button"
                  onClick={() =>
                    handleColorChange(colorOption.border, colorOption.shadow)
                  }
                  className={`w-8 h-10 rounded-md border-2 transition-all ${
                    formData.color === colorOption.border
                      ? "border-gray-800 scale-110"
                      : "border-gray-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: colorOption.border }}
                  title={`Цвет: ${colorOption.border}`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {deleting ? "Удаление..." : "Удалить"}
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#FF684D] text-white rounded-lg hover:bg-[#E55A40] transition-colors disabled:opacity-50"
            >
              {loading ? "Сохранение..." : isEditing ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
