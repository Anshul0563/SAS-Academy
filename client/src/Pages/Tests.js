import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Tests() {

    const [tests, setTests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/tests", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setTests(res.data);
            } catch (err) {
                console.log("Fetch error:", err);
            }
        };

        fetchTests();
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 sm:px-6 lg:px-10 py-6">

            {/* HEADER */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
                Available Tests
            </h1>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {tests.map((test) => (

                    <div
                        key={test._id}
                        className="bg-[#1e293b] p-5 rounded-xl hover:scale-[1.02] transition cursor-pointer flex flex-col justify-between"
                    >

                        {/* CONTENT */}
                        <div>
                            <h2 className="text-base sm:text-lg font-semibold">
                                {test.title}
                            </h2>

                            <p className="text-gray-400 mt-1 text-sm">
                                {test.type}
                            </p>

                            <p className="text-gray-500 mt-1 text-sm">
                                {test.duration} min
                            </p>
                        </div>

                        {/* BUTTON */}
                        <button
                            onClick={() => navigate(`/typing-settings/${test._id}`)}
                            className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded text-sm sm:text-base"
                        >
                            Start Test
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Tests;