import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";
import {
    AlertCircle,
    ArrowLeft,
    Clock,
    Headphones,
    Loader2,
    Pause,
    Play,
    RotateCcw,
    RotateCw,
    Volume2
} from "lucide-react";

const formatTime = (seconds = 0) => {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const mins = Math.floor(safeSeconds / 60);
    const secs = Math.floor(safeSeconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
};

const getDisplayDuration = (test) => Number(test?.duration) || 10;

function DictationPlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const audioRef = useRef(null);

    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [playing, setPlaying] = useState(false);
    const [ready, setReady] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [volume, setVolume] = useState(0.9);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await API.get(`/tests/${id}`);
                setTest(res.data);
            } catch (err) {
                console.error("Dictation fetch error:", err);
                setError(err.response?.data?.message || "Failed to load dictation");
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    }, [id]);

    const audioSrc = useMemo(() => test?.audioURL || test?.audioUrl || "", [test]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioSrc) return;

        setReady(false);
        setPlaying(false);
        setCurrentTime(0);
        audio.pause();
        audio.load();
    }, [audioSrc]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.playbackRate = playbackRate;
    }, [playbackRate]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = volume;
    }, [volume]);

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio || !ready) return;

        try {
            if (audio.paused) {
                await audio.play();
                setPlaying(true);
            } else {
                audio.pause();
                setPlaying(false);
            }
        } catch (err) {
            console.error("Audio play error:", err);
            setError("Browser blocked audio playback. Try pressing play again.");
        }
    };

    const seekBy = (seconds) => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.currentTime = Math.min(Math.max(0, audio.currentTime + seconds), duration || audio.duration || 0);
        setCurrentTime(audio.currentTime);
    };

    const seekTo = (event) => {
        const audio = audioRef.current;
        const nextTime = Number(event.target.value);
        if (!audio) return;

        audio.currentTime = nextTime;
        setCurrentTime(nextTime);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-400" size={34} />
            </div>
        );
    }

    if (error && !test) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-4">
                <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
                    <AlertCircle className="mx-auto mb-3 text-red-300" />
                    <p className="text-red-200">{error}</p>
                    <button
                        onClick={() => navigate("/dictations")}
                        className="mt-5 rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                    >
                        Back to dictations
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white px-4 py-6">
            <div className="mx-auto max-w-4xl space-y-5">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl sm:p-8"
                >
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-indigo-500/15 p-3 text-indigo-300">
                                <Headphones />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold sm:text-2xl">{test?.title || "Dictation"}</h1>
                                <p className="mt-1 text-sm text-slate-400">
                                    {test?.category || "Practice"} · {getDisplayDuration(test)} min
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                            <Clock size={16} />
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>

                    {!audioSrc ? (
                        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                            No audio file is attached to this dictation.
                        </div>
                    ) : (
                        <>
                            <audio
                                ref={audioRef}
                                src={audioSrc}
                                preload="metadata"
                                onCanPlay={() => setReady(true)}
                                onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
                                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                                onPause={() => setPlaying(false)}
                                onPlay={() => setPlaying(true)}
                                onEnded={() => setPlaying(false)}
                                onError={() => {
                                    setReady(false);
                                    setPlaying(false);
                                    setError("Audio failed to load. Please check the Cloudinary file URL.");
                                }}
                                className="hidden"
                            />

                            {error && (
                                <div className="mb-5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-6">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    step="0.1"
                                    value={currentTime}
                                    onChange={seekTo}
                                    disabled={!ready}
                                    className="w-full accent-indigo-500"
                                />

                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => seekBy(-10)}
                                        disabled={!ready}
                                        className="rounded-full border border-white/10 bg-white/5 p-3 hover:bg-white/10 disabled:opacity-40"
                                        aria-label="Rewind 10 seconds"
                                    >
                                        <RotateCcw size={20} />
                                    </button>

                                    <button
                                        onClick={togglePlay}
                                        disabled={!ready}
                                        className="rounded-full bg-indigo-600 p-5 text-white shadow-lg hover:bg-indigo-500 disabled:opacity-40"
                                        aria-label={playing ? "Pause audio" : "Play audio"}
                                    >
                                        {playing ? <Pause size={28} /> : <Play size={28} />}
                                    </button>

                                    <button
                                        onClick={() => seekBy(10)}
                                        disabled={!ready}
                                        className="rounded-full border border-white/10 bg-white/5 p-3 hover:bg-white/10 disabled:opacity-40"
                                        aria-label="Forward 10 seconds"
                                    >
                                        <RotateCw size={20} />
                                    </button>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                                        Playback Speed
                                        <select
                                            value={playbackRate}
                                            onChange={(event) => setPlaybackRate(Number(event.target.value))}
                                            className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 p-2 text-white outline-none"
                                        >
                                            {[0.75, 0.9, 1, 1.1, 1.25, 1.5].map((rate) => (
                                                <option key={rate} value={rate}>{rate}x</option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                                        <span className="flex items-center gap-2">
                                            <Volume2 size={16} />
                                            Volume {Math.round(volume * 100)}%
                                        </span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={volume}
                                            onChange={(event) => setVolume(Number(event.target.value))}
                                            className="mt-3 w-full accent-indigo-500"
                                        />
                                    </label>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default DictationPlayer;
