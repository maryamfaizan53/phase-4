/**
 * Elite Todo Form with Cinematic UI
 */
"use client";

import { useState, useEffect } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Card from "./ui/Card";

export default function TodoForm({ task, onSubmit, onCancel, loading }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("TITLE IS REQUIRED IN THE NEURAL BUFFER.");
      return;
    }

    try {
      await onSubmit({ title, description });
    } catch (err) {
      setError(err.message || "SYNCHRONIZATION FAILURE.");
    }
  };

  return (
    <Card className="animate-reveal border-white/10 shadow-premium p-10 md:p-14">
      <form onSubmit={handleSubmit} className="space-y-10">
        <Input
          label="Neural Objective (Title)"
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What shall we accomplish?"
          required
          disabled={loading}
          autoComplete="off"
          error={error}
          className="bg-black/40 border-white/10 focus:border-brand-500/50 h-16 rounded-2xl text-lg font-medium"
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-bold text-gray-400 mb-3 ml-1 uppercase tracking-[0.2em] text-[10px]"
          >
            Tactical Details (Description)
          </label>
          <div className="relative group">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              autoComplete="off"
              className="w-full px-6 py-5 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all duration-500 bg-black/40 backdrop-blur-xl border-white/10 hover:border-brand-500/30 text-white font-medium placeholder-gray-600"
              placeholder="Provide further tactical context..."
              disabled={loading}
            />
            <div className="absolute inset-0 rounded-2xl bg-brand-500/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            size="lg"
            className="sm:w-1/3 border-white/5 hover:bg-white/5"
          >
            Abort
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            size="lg"
            className="flex-1 shadow-neon hover:shadow-neon-hover py-5 text-xl"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Syncing...
              </span>
            ) : task ? (
              "Update Objective"
            ) : (
              "Initialize Objective"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
