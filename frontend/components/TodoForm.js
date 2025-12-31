/**
 * Modern Form for creating/editing todos
 */
"use client";

import { useState, useEffect } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Card from "./ui/Card";
import PrioritySelector from "./ui/PrioritySelector";
import { DEFAULT_PRIORITY } from "../lib/constants/priorities";

export default function TodoForm({ task, onSubmit, onCancel, loading }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || DEFAULT_PRIORITY);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      await onSubmit({ title, description, priority });
    } catch (err) {
      setError(err.message || "Failed to save task");
    }
  };

  return (
    <Card className="animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Task Title"
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          disabled={loading}
          autoComplete="off"
          error={error}
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            autoComplete="off"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="Add details about this task (optional)"
            disabled={loading}
          />
        </div>

        <PrioritySelector
          value={priority}
          onChange={setPriority}
          disabled={loading}
        />

        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={task ? "primary" : "primary"}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : task ? (
              "Update Task"
            ) : (
              "Create Task"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
