import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";

function DictationPlayer() {
    const { id } = useParams();

    const [test, setTest] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(90);
    const [text, setText] = useState("");
    const [time, setTime] = useState(0);
    const [ready, setReady] = useState(false); //  NEW

    const audioRef = useRef(null);

    //  FETCH TEST
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/tests/${id}`
                );
                setTest(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTest();
    }, [id]);

    //   DEBUG
    useEffect(() => {
        if (test) {
            console.log("AUDIO URL:", test.audioUrl);
        }
    }, [test]);

    //  SAFE AUDIO SRC (FIXED)
    const audioSrc = test?.audioUrl || "";

    //  LOAD AUDIO
    useEffect(() => {
        if (audioRef.current && audioSrc) {
            audioRef.current.load();
            setReady(false);
        }
    }, [audioSrc]);

    //  TIMER
    useEffect(() => {
        let interval;
        if (playing) {
            interval = setInterval(() => setTime((prev) => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [playing]);

    //  PLAY FIX (NO ABORT ERROR)
    const handlePlay = async () => {
        const audio = audioRef.current;

        if (!audio || !ready) return;

        try {
            if (!playing) {
                await audio.play();
                setPlaying(true);
            } else {
                audio.pause();
                setPlaying(false);
            }
        } catch (err) {
            console.log("Audio play error:", err.message);
        }
    };

    //  SPEED
    const handleSpeed = (e) => {
        const value = Number(e.target.value);
        setSpeed(value);

        if (audioRef.current) {
            audioRef.current.playbackRate = value / 90;
        }
    };
    useEffect(() => {
        console.log("FINAL AUDIO SRC:", audioSrc);
    }, [audioSrc]);

    // AUTO STOP WHEN ENDED
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onEnd = () => setPlaying(false);

        audio.addEventListener("ended", onEnd);

        return () => {
            audio.removeEventListener("ended", onEnd);
        };
    }, []);

    if (!test)
        return <p className="text-center mt-10 text-gray-400">Loading...</p>;

    return (
        <div className="min-h-screen bg-black text-white px-4 py-6">
            <motion.div className="max-w-4xl mx-auto bg-[#0f172a] p-6 rounded-2xl">

                <h2 className="text-xl text-center mb-6">
                    🎧 {test.title}
                </h2>

                <div className="flex flex-col items-center gap-4">

                    {/* AUDIO */}
                    <audio
                        ref={audioRef}
                        src={audioSrc}
                        controls
                        onCanPlay={() => setReady(true)} //  IMPORTANT
                        onError={() => console.log("❌ Audio failed:", audioSrc)}
                    />

                    {/* PLAY BUTTON */}
                    <button
                        disabled={!ready}
                        onClick={handlePlay}
                        className="bg-indigo-500 p-3 rounded-full disabled:opacity-50"
                    >
                        {playing ? <Pause /> : <Play />}
                    </button>

                    <Volume2 className="text-gray-400" />

                </div>

                {/* SPEED */}
                <div className="mt-6 text-center">
                    <select value={speed} onChange={handleSpeed}>
                        {[50, 60, 70, 80, 90, 100].map((wpm) => (
                            <option key={wpm}>{wpm} WPM</option>
                        ))}
                    </select>
                </div>

            </motion.div>
        </div>
    );
}

export default DictationPlayer;