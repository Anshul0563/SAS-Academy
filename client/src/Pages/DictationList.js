import { useState, useEffect } from "react";
import API from "../api/axios";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Play, Headphones, Clock, Tag, Loader2 } from "lucide-react";

const getDisplayDuration = (test) => {
  const duration = Number(test?.duration);
  return !duration || duration === 5 ? 10 : duration;
};

function DictationList() {
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await API.get("/tests?type=dictation");

        const filtered = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setTests(filtered);
      } catch (err) {
        console.log("Dictation fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const filteredTests = tests.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl text-white">
      <div className="sas-panel mb-6 p-5 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="sas-kicker">Audio Practice</p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Dictation Tests
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Practice audio dictation
          </p>
        </div>

        <div className="w-full md:w-72 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="sas-input pl-10"
          />
        </div>
      </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="mb-3 animate-spin text-cyan-300" size={36} />
          <p className="text-sm text-slate-400">Loading tests...</p>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="sas-card mt-10 p-10 text-center">
          <Headphones className="mx-auto mb-3 text-slate-500" size={50} />
          <p className="text-sm text-slate-400">
            {search ? "No results found" : "No dictation tests available"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredTests.map((test) => (
            <motion.div
              key={test._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              className="sas-card sas-card-hover flex flex-col justify-between p-4"
            >
              <h2 className="font-semibold text-base sm:text-lg mb-2 text-white line-clamp-2">
                {test.title}
              </h2>

              <div className="mb-3 space-y-2 text-xs text-slate-400 sm:text-sm">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  {getDisplayDuration(test)} min
                </div>

                {test.category && (
                  <div className="flex items-center gap-2">
                    <Tag size={14} />
                    {test.category}
                  </div>
                )}
              </div>

              {/* TAGS */}
              {test.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {test.tags.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-cyan-300/10 px-2 py-1 text-[10px] text-cyan-100"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => navigate(`/dictation/${test._id}`)}
                  className="sas-button-primary flex-1 py-2 text-xs sm:text-sm"
                >
                  <Play size={14} />
                  Start
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DictationList;
