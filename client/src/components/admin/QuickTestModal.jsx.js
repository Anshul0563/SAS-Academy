import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import { FileText, Headphones, UploadCloud, X, Plus } from 'lucide-react';
import { getAdminAuthToken } from '../../utils/authStorage';

const getDefaultDuration = (type) => (type === 'dictation' ? 10 : 50);

const QuickTestModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    type: 'transcription',
    passage: '',
    duration: getDefaultDuration('transcription'),
    category: ''
  });
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
      duration: getDefaultDuration(type),
      passage: type === 'dictation' ? '' : prev.passage
    }));
    if (type === 'transcription') {
      setAudio(null);
    }
    setMessage('');
  };

  const handleSubmit = async () => {
    const title = form.title.trim();
    const passage = form.passage.trim();

    if (!title) {
      setMessage('Title is required');
      return;
    }

    if (form.type === 'transcription' && !passage) {
      setMessage('Passage is required');
      return;
    }

    if (form.type === 'dictation' && !audio) {
      setMessage('Audio file is required');
      return;
    }

    setLoading(true);
    try {
      const token = getAdminAuthToken();
      if (!token) {
        setMessage('❌ Admin login required. Please login again.');
        return;
      }

      const data = new FormData();

      data.append('title', title);
      data.append('type', form.type);
      data.append('passage', form.type === 'transcription' ? passage : '');
      data.append('duration', form.duration);
      data.append('category', form.category.trim());

      if (form.type === 'dictation' && audio) {
        data.append('audio', audio);
      }

      await API.post('/tests', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Test created successfully!');
      onSuccess();
      setTimeout(() => {
        onClose();
        setForm({ title: '', type: 'transcription', passage: '', duration: getDefaultDuration('transcription'), category: '' });
        setAudio(null);
      }, 1500);
    } catch (error) {
      console.error('Quick test create error:', error.response?.data || error);
      setMessage(`❌ ${error.response?.data?.message || 'Error creating test'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Plus size={24} /> Quick Add Test
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-medium text-center ${
            message.includes('✅') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message}
          </div>
        )}

        {/* Type Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleTypeChange('transcription')}
            className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
              form.type === 'transcription'
                ? 'bg-indigo-500/20 text-indigo-300 border-2 border-indigo-500/40 shadow-lg'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 border border-slate-700/50'
            }`}
          >
            <FileText size={18} />
            Transcription
          </button>
          <button
            onClick={() => handleTypeChange('dictation')}
            className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
              form.type === 'dictation'
                ? 'bg-indigo-500/20 text-indigo-300 border-2 border-indigo-500/40 shadow-lg'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 border border-slate-700/50'
            }`}
          >
            <Headphones size={18} />
            Dictation
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            name="title"
            placeholder="Test Title *"
            value={form.title}
            onChange={handleChange}
            className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          />
          
          {form.type === 'transcription' ? (
            <textarea
              name="passage"
              placeholder="Type the passage here..."
              value={form.passage}
              onChange={handleChange}
              rows={4}
              className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-vertical transition"
            />
          ) : (
            <div className="p-4 border-2 border-dashed border-slate-700 rounded-xl hover:border-indigo-500/50 transition cursor-pointer bg-slate-800/30">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudio(e.target.files?.[0] || null)}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                <UploadCloud size={32} className="text-indigo-400" />
                <div>
                  <p className="font-medium text-indigo-300">{audio?.name || 'Upload dictation audio'}</p>
                  <p className="text-xs text-slate-500">MP3, WAV, M4A (max 10MB)</p>
                </div>
              </label>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input
              name="duration"
              type="number"
              placeholder="Duration (min)"
              value={form.duration}
              onChange={handleChange}
              className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none transition"
              min={1}
              max={60}
            />
            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none transition"
            />
          </div>
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2" />
              Creating...
            </>
          ) : (
            '🚀 Create Test'
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default QuickTestModal;
