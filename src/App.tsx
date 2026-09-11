import { useState, useEffect } from "react";
import { getStorageData, saveStorageData } from "./services/storage";
import { generateCoverLetter } from "./services/gemini";

type TabType = "generator" | "settings";

interface JobDetails {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  windowURL: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("generator");
  const [apiKey, setApiKey] = useState<string>("");
  const [resume, setResume] = useState<string>("");
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [tone, setTone] = useState<"Short" | "Professional">("Short");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    const initData = async () => {
      const storage = await getStorageData();
      setApiKey(storage.apiKey);
      setResume(storage.resume);

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0]?.id;
        if (activeTabId) {
          chrome.tabs.sendMessage(
            activeTabId,
            { action: "GET_JOB_DETAILS" },
            (response: JobDetails) => {
              if (chrome.runtime.lastError || !response) {
                console.log("Not a target page or content script not loaded.");
              } else {
                setJobDetails(response);
              }
            },
          );
        }
      });
    };

    initData();
  }, []);

  const handleSaveSettings = async () => {
    await saveStorageData(apiKey, resume);
    setStatusMessage("Налаштування збережено!");
    setTimeout(() => setStatusMessage(""), 2000);
    setActiveTab("generator");
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      alert("Будь ласка, вкажіть Gemini API Key у Налаштуваннях!");
      setActiveTab("settings");
      return;
    }

    if (!jobDetails?.jobDescription) {
      alert("Не вдалося отримати опис вакансії з цієї сторінки.");
      return;
    }

    setIsLoading(true);
    try {
      const letter = await generateCoverLetter({
        apiKey,
        userResume: resume,
        jobTitle: jobDetails.jobTitle,
        companyName: jobDetails.companyName,
        jobDescription: jobDetails.jobDescription,
        tone,
      });
      setCoverLetter(letter);
    } catch (error) {
      console.error(error);
      alert("Помилка під час генерації листа. Перевірте ваш API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      setStatusMessage("Скопійовано в буфер обміну!");
      setTimeout(() => setStatusMessage(""), 2000);
    }
  };

  return (
    <div className="w-96 bg-gray-50 min-h-[450px] p-4 text-gray-800 text-sm font-sans flex flex-col">
      <div className="flex border-b border-gray-200 mb-4 pb-2 justify-between items-center">
        <h1 className="font-bold text-base text-blue-600">AI Cover Letter</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
              activeTab === "generator"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Генератор
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
              activeTab === "settings"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Налаштування
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-3 p-2 bg-green-100 text-green-700 text-xs rounded border border-green-300 text-center">
          {statusMessage}
        </div>
      )}

      {activeTab === "generator" && (
        <div className="flex flex-col flex-1 gap-3">
          {jobDetails ? (
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-gray-900 truncate">
                {jobDetails.jobTitle || "Вакансія без назви"}
              </p>
              <p className="text-xs text-gray-500">{jobDetails.companyName}</p>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 text-amber-800 rounded border border-amber-200 text-xs">
              Відкрийте сторінку вакансії на Djinni або Work.ua
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Тон листа:
            </span>
            <select
              value={tone}
              onChange={(e) =>
                setTone(e.target.value as "Short" | "Professional")
              }
              className="text-xs bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none"
            >
              <option value="Short">Короткий (Short)</option>
              <option value="Professional">Професійний (Professional)</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !jobDetails}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed text-xs shadow-sm"
          >
            {isLoading ? "Генерую лист..." : "Згенерувати супровідний лист"}
          </button>

          {coverLetter && (
            <div className="flex flex-col gap-2 mt-2 flex-1">
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={8}
                className="w-full p-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
              <button
                onClick={handleCopy}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1.5 rounded-md text-xs transition"
              >
                Скопіювати в буфер
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "settings" && (
        <div className="flex flex-col gap-3 flex-1">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Gemini API Key:
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Короткий текст резюме / Стек:
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Наприклад: React/TS Frontend Dev, 2+ роки досвіду, Vite, Tailwind, Redux..."
              className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[150px]"
            />
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition text-xs shadow-sm mt-auto"
          >
            Зберегти налаштування
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
